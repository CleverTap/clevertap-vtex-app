import type { UploadData } from 'clevertap'
import type { VBase } from '@vtex/api'

import { getCleverTap } from '../../lib/clevertap'
import { getPaymentMethodsString } from '../../utils/get-payment-method'
import { getTotal } from '../../utils/get-total'
import { normalizeItems } from '../../utils/normalize-items'
import { catalogSyncHandler } from '../../handlers/catalogSyncHandler'
import { getConfig } from '../../lib/clevertap/getConfig'

type MdUser = { email: string }

const processedOrders = new Map<string, Set<string>>()
// Local/dev helper: run catalog sync without waiting 24h (0.001h ~= 3.6s).
const catalogSyncIntervalHours = 0.001

export async function omsFilteredEvents(
  ctx: StatusChangeContext,
  next: () => Promise<any>
) {
  const {
    clients: { oms: omsClient, MD: mdClient, vbase: vbaseClient },
    body,
  } = ctx

  const settings = await getConfig(ctx)

  const { orderId, currentState } = body

  if (!orderId || !currentState || !settings) return

  if (!processedOrders.has(orderId)) {
    processedOrders.set(orderId, new Set())
  }

  const statesSet = processedOrders.get(orderId)

  if (!statesSet) return

  if (statesSet.has(currentState)) return next()

  statesSet.add(currentState)

  const clevertap = await getCleverTap(ctx)
  const response = await omsClient.order(orderId, 'AUTH_TOKEN')
  const { preferences } = settings
  const {
    catalogSync,
    integrationEmail,
    useChargeEventOnlyWhenOrderApproved,
  } = preferences

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

  const { userProfileId } = response.clientProfileData

  const mdResponse: MdUser[] = await mdClient.searchDocuments({
    dataEntity: 'CL',
    fields: ['email'],
    where: `userId=${userProfileId}`,
    pagination: { page: 1, pageSize: 1 },
  })

  const identity = mdResponse[0].email || ''

  const eventMap: Record<string, { name: string; includeItems?: boolean }> = {
    canceled: { name: 'Order Cancelled' },
    'payment-approved': {
      name: useChargeEventOnlyWhenOrderApproved ? 'Charged' : 'Order Approved',
    },
    incomplete: { name: 'Checkout Failed', includeItems: true },
    'payment-denied': { name: 'Checkout Failed', includeItems: true },
  }

  const event = eventMap[currentState]

  if (event) {
    const evtData = event.includeItems
      ? {
          ...payload,
          items: normalizeItems(response.items),
          'CT Source': 'vtex',
        }
      : { ...payload, 'CT Source': 'vtex' }

    const data = {
      identity,
      type: 'event',
      objectId: 'back-end-event',
      evtName: event.name,
      evtData,
    } as UploadData

    clevertap.upload([data])

    if (catalogSync && integrationEmail?.trim().length > 0) {
      await handleCatalogSync(ctx, vbaseClient, integrationEmail)
    }
  }

  await next()
}

async function handleCatalogSync(
  ctx: StatusChangeContext,
  vbaseClient: VBase,
  integrationEmail: string
) {
  const {
    vtex: { logger },
  } = ctx

  const now = new Date().toISOString()

  const baseBody = {
    email: integrationEmail,
    creator: integrationEmail,
  }

  try {
    const lastCatalogSync = await getLastCatalogSync(vbaseClient)

    const lastRun = lastCatalogSync?.trim()
      ? new Date(lastCatalogSync).getTime()
      : 0

    const hoursSince = (Date.now() - lastRun) / 1000 / 60 / 60

    if (hoursSince >= catalogSyncIntervalHours) {
      logger.info(
        `[OMS] ${catalogSyncIntervalHours}h passed, running catalog sync...`
      )
      console.info(
        `[OMS] ${catalogSyncIntervalHours}h passed, running catalog sync...`
      )

      const newCtx = ({
        ...ctx,
        body: {
          ...baseBody,
          replace: true,
        },
      } as unknown) as Context

      await catalogSyncHandler(newCtx)

      await vbaseClient.saveJSON('config', 'lastCatalogSync', now)
    }
  } catch (error) {
    // console.info(error)

    const noCatalog =
      error.response.data.error ===
      'No Catalog with given name exists for replacement'

    if (noCatalog) {
      const retryCtx = ({
        ...ctx,
        body: {
          ...baseBody,
          replace: false,
        },
      } as unknown) as Context

      await catalogSyncHandler(retryCtx)

      await vbaseClient.saveJSON('config', 'lastCatalogSync', now)
    } else {
      throw error
    }
  }
}

async function getLastCatalogSync(vbaseClient: VBase) {
  let lastCatalogSync = ''
  const now = new Date().toISOString()

  try {
    lastCatalogSync = await vbaseClient.getJSON<string>(
      'config',
      'lastCatalogSync'
    )
  } catch (error) {
    const errorString = error.toString()

    if (errorString === 'Error: Request failed with status code 404') {
      await vbaseClient.saveJSON('config', 'lastCatalogSync', now)

      lastCatalogSync = await vbaseClient.getJSON<string>(
        'config',
        'lastCatalogSync'
      )
    } else {
      throw error
    }
  }

  return lastCatalogSync
}
