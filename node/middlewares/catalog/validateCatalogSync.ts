import { json } from 'co-body'

import { getConfig } from '../../lib/clevertap/getConfig'

interface CatalogSyncBody {
  email?: string
  creator?: string
}

export async function validateCatalogSync(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    vtex: { logger },
  } = ctx

  const body = (await json(ctx.req)) as CatalogSyncBody | null

  const settings = await getConfig(ctx)
  const email = body?.email?.trim() || settings?.preferences?.integrationEmail
  const creator = body?.creator?.trim() || settings?.accountID

  if (!email || !creator) {
    ctx.status = 400
    ctx.body = { error: 'Missing email or creator: provide them in the request body or configure integrationEmail and accountID in app settings' }

    logger.error('400: Missing email or creator for catalog sync')
    ctx.throw(400, 'Missing email or creator')
  }

  ctx.body = { email, creator }

  await next()
}
