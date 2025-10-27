import { CatalogService } from '../services/CatalogService'

export async function catalogSyncHandler(ctx: Context) {
  const { account } = ctx.vtex
  const { email, creator, replace } = ctx.body

  ctx.status = 200
  ctx.body = { message: `Load started` }

  const service = new CatalogService(ctx)

  await service.syncCatalog(ctx, {
    accountName: account,
    email,
    creator,
    replace,
  })
}
