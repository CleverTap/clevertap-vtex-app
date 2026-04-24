import { getStateSnapshot, resetState } from '../lib/syncState'

export async function catalogSyncStateHandler(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    clients: { vbase },
  } = ctx

  const snapshot = await getStateSnapshot(vbase)

  ctx.status = 200
  ctx.body = snapshot

  await next()
}

export async function catalogSyncResetHandler(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    clients: { vbase },
    vtex: { logger },
  } = ctx

  const before = await getStateSnapshot(vbase)

  await resetState(vbase)

  const after = await getStateSnapshot(vbase)

  logger.info(
    `[Debug] Catalog sync state reset. Before: ${JSON.stringify(before)}`
  )

  ctx.status = 200
  ctx.body = { message: 'Catalog sync state reset', before, after }

  await next()
}
