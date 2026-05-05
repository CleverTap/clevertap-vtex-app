import type { Logger, VBase } from '@vtex/api'
import type { UploadData } from 'clevertap'

import { getCleverTap } from '../../lib/clevertap'
import { getConfig } from '../../lib/clevertap/getConfig'
import { acquireLock, releaseLock } from '../../lib/syncState'
import { CatalogService } from '../../services/CatalogService'
import { getPaymentMethodsString } from '../../utils/get-payment-method'
import { getTotal } from '../../utils/get-total'
import { normalizeItems } from '../../utils/normalize-items'

const MIN_INTERVAL_MINUTES = 1440

export async function omsFilteredEvents(
  ctx: StatusChangeContext,
  next: () => Promise<any>
) {
  const {
    clients: { oms: omsClient },
    body,
  } = ctx

  const settings = await getConfig(ctx)

  const { orderId, currentState } = body

  if (!orderId || !currentState || !settings) { return }

  const clevertap = await getCleverTap(ctx)

  if (!clevertap) { return }

  const response = await omsClient.order(orderId, 'AUTH_TOKEN')
  const { preferences, accountID } = settings
  const {
    catalogSync,
    integrationEmail,
    useChargeEventOnlyWhenOrderApproved,
  } = preferences

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

  const identity = response.clientProfileData.email || ''

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

    await clevertap.upload([data])

    if (catalogSync && integrationEmail?.trim().length > 0 && accountID) {
      await triggerCatalogSyncAsync(ctx, {
        accountName: ctx.vtex.account,
        creator: accountID,
        email: integrationEmail,
      })
    }
  }

  await next()
}

interface CatalogSyncOptions {
  accountName: string
  email: string
  creator: string
}

async function triggerCatalogSyncAsync(
  ctx: StatusChangeContext,
  options: CatalogSyncOptions
) {
  const {
    clients: { vbase },
    vtex: { logger },
  } = ctx

  const handle = await acquireLock(vbase, MIN_INTERVAL_MINUTES).catch(err => {
    logger.error(`[OMS] acquireLock failed: ${err?.message ?? err}`)

    return null
  })

  if (!handle) {
    logger.info('[OMS] Catalog sync skipped (recent or in progress)')

    return
  }

  logger.info('[OMS] Catalog sync lock acquired, starting in background')

  runCatalogSyncInBackground(ctx, options, handle, vbase, logger)
}

function runCatalogSyncInBackground(
  ctx: StatusChangeContext,
  options: CatalogSyncOptions,
  handle: { lockId: string },
  vbase: VBase,
  logger: Logger
) {
  const syncCtx = (ctx as unknown) as Context
  const service = new CatalogService(syncCtx)

  service
    .syncCatalog(syncCtx, options)
    .then(async () => {
      logger.info('[OMS] Catalog sync completed')
      await releaseLock(vbase, handle, { markSynced: true }).catch(err =>
        logger.error(`[OMS] releaseLock after success failed: ${err?.message ?? err}`)
      )
    })
    .catch(async err => {
      const detail = err?.response?.data ?? err?.message ?? err
      logger.error(`[OMS] Catalog sync failed: ${JSON.stringify(detail)}`)
      await releaseLock(vbase, handle, { markSynced: false }).catch(
        releaseErr =>
          logger.error(
            `[OMS] releaseLock after failure failed: ${releaseErr?.message ?? releaseErr}`
          )
      )
    })
}
