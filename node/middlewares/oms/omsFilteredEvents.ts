import type { UploadData } from 'clevertap'

import { getCleverTap } from '../../lib/clevertap'
import { getPaymentMethodsString } from '../../utils/get-payment-method'
import { getTotal } from '../../utils/get-total'
import { normalizeItems } from '../../utils/normalize-items'

const processedOrders = new Map<string, Set<string>>()

export async function omsFilteredEvents(
  ctx: StatusChangeContext,
  next: () => Promise<any>
) {
  const {
    clients: { oms: omsClient },
    body,
  } = ctx

  const { orderId, currentState } = body

  if (!orderId || !currentState) return

  if (!processedOrders.has(orderId)) {
    processedOrders.set(orderId, new Set())
  }

  const statesSet = processedOrders.get(orderId)!

  if (statesSet.has(currentState)) return next()
  statesSet.add(currentState)

  const clevertap = await getCleverTap(ctx)
  const response = await omsClient.order(orderId, 'AUTH_TOKEN')

  if (!clevertap) return

  const paymentMethod = getPaymentMethodsString(
    response.paymentData.transactions[0].payments
  )

  const payload = {
    order_id: orderId,
    checkout_id: response.orderFormId,
    state: currentState,
    affiliation: response.sellers?.[0]?.name || '',
    value: response.value,
    revenue: getTotal('Items', response.totals),
    shipping: getTotal('Shipping', response.totals),
    tax: getTotal('Tax', response.totals),
    discount: getTotal('Discounts', response.totals),
    payment_method: paymentMethod,
    currency: response.storePreferencesData?.currencyCode || 'USD',
    coupon: response.marketingData?.coupon || '',
  }

  const eventMap: Record<string, { name: string; includeItems?: boolean }> = {
    canceled: { name: 'Order Cancelled' },
    'payment-approved': { name: 'Order Paid' },
    incomplete: { name: 'Checkout Failed', includeItems: true },
    'payment-denied': { name: 'Checkout Failed', includeItems: true },
  }

  const event = eventMap[currentState]

  if (event) {
    const evtData = event.includeItems
      ? { ...payload, items: normalizeItems(response.items) }
      : payload

    const data = {
      type: 'event',
      objectId: 'back-end-event',
      evtName: event.name,
      evtData,
    } as UploadData

    clevertap.upload([data])
  }

  await next()
}
