import { CatalogService } from '../services/CatalogService'

export async function catalogSyncHandler(ctx: Context) {
  const { account } = ctx.vtex
  const { email, creator, replace } = ctx.body

  const service = new CatalogService(ctx)

  await service.syncCatalog(ctx, {
    accountName: account,
    email,
    creator,
    replace,
  })

  ctx.status = 200
  ctx.body = { message: `Load started` }
}
