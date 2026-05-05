import { getConfig } from '../lib/clevertap/getConfig'
import { acquireLock, releaseLock } from '../lib/syncState'
import { CatalogService } from '../services/CatalogService'

const MIN_INTERVAL_MINUTES = 1440

export async function catalogSyncSchedulerHandler(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    vtex: { logger },
    clients: { vbase },
  } = ctx

  const settings = await getConfig(ctx)

  if (!settings?.preferences?.catalogSync) {
    logger.info('[Manual] Catalog sync disabled, skipping')
    ctx.status = 200
    ctx.body = { message: 'Catalog sync is disabled' }
    await next()

    return
  }

  const email = settings?.preferences?.integrationEmail
  const creator = settings?.accountID

  if (!email || !creator) {
    logger.error('[Manual] Missing integrationEmail or accountID in settings')
    ctx.status = 500
    ctx.body = { error: 'Missing integrationEmail or accountID in settings' }
    await next()

    return
  }

  const handle = await acquireLock(vbase, MIN_INTERVAL_MINUTES)

  if (!handle) {
    logger.info('[Manual] Lock not acquired (recent sync or already running)')
    ctx.status = 200
    ctx.body = { message: 'Catalog sync skipped (recent or in progress)' }
    await next()

    return
  }

  logger.info('[Manual] Starting catalog sync run')

  try {
    const service = new CatalogService(ctx)

    await service.syncCatalog(ctx, {
      accountName: ctx.vtex.account,
      creator,
      email,
    })

    await releaseLock(vbase, handle, { markSynced: true })
  } catch (err) {
    await releaseLock(vbase, handle, { markSynced: false })
    throw err
  }

  ctx.status = 200
  ctx.body = { message: 'Catalog sync completed' }
  await next()
}
