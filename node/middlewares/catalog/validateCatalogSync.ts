import { json } from 'co-body'

interface CatalogSyncBody {
  email: string
  creator: string
  replace: boolean
}

export async function validateCatalogSync(
  ctx: Context,
  next: () => Promise<any>
) {
  const body = await json(ctx.req)

  if (!body) {
    ctx.status = 400
    ctx.body = { error: 'Body is required' }

    ctx.throw(400, 'Body is required')
  }

  const { email, creator, replace } = body as CatalogSyncBody

  if (!email?.trim() || !creator?.trim() || replace === undefined) {
    ctx.status = 400
    ctx.body = { error: 'Missing required fields' }

    ctx.throw(400, 'Missing required fields')
  }

  ctx.body = { email, creator, replace }

  await next()
}
