import type { UploadData } from 'clevertap'

import { getPaymentMethodsString } from '../../utils/get-payment-method'
import { getTotal } from '../../utils/get-total'
import { getCleverTap } from '../../lib/clevertap'

type MdUser = { email: string }

export async function omsAllEvents(
  ctx: StatusChangeContext,
  next: () => Promise<any>
) {
  const {
    clients: { oms: omsClient, MD: mdClient },
    body,
  } = ctx

  const { orderId, currentState } = body

  if (!orderId || !currentState) return

  const clevertap = await getCleverTap(ctx)
  const response = await omsClient.order(orderId, 'AUTH_TOKEN')

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

  const { userProfileId } = response.clientProfileData

  const mdResponse: MdUser[] = await mdClient.searchDocuments({
    dataEntity: 'CL',
    fields: ['email'],
    where: `userId=${userProfileId}`,
    pagination: { page: 1, pageSize: 1 },
  })

  const identity = mdResponse[0].email || ''

  const data = {
    identity,
    type: 'event',
    objectId: 'back-end-event',
    evtName: 'Order Updated',
    evtData: payload,
  } as UploadData

  clevertap.upload([data])

  await next()
}
