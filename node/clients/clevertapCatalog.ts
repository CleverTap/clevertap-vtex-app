import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

import { getConfig } from '../lib/clevertap/getConfig'

export class ClevertapCatalog extends ExternalClient {
  private settings: any
  private baseUrl: string | null = null

  constructor(context: IOContext, options?: InstanceOptions) {
    super('', context, options)
  }

  public async init(ctx: Context) {
    if (this.settings) return

    this.settings = await getConfig(ctx)
    const region = this.settings?.region ?? 'us1'

    this.baseUrl = `https://${region}.api.clevertap.com`
  }

  public async postCatalogUrl(ctx: Context): Promise<any> {
    await this.init(ctx)

    return this.http.post(
      `${this.baseUrl}/get_catalog_url`,
      {},
      {
        headers: {
          'X-CleverTap-Account-Id': this.settings.accountID,
          'X-CleverTap-Passcode': this.settings.accountPasscode,
        },
      }
    )
  }

  public async uploadCatalog(csv: string, presignedUrl: string, ctx: Context) {
    await this.init(ctx)

    return this.http.put(presignedUrl, Buffer.from(csv))
  }

  public async completeUpload(
    url: string,
    ctx: Context,
    options: {
      name: string
      email: string
      creator: string
      replace?: boolean
    }
  ) {
    await this.init(ctx)

    return this.http.post(
      `${this.baseUrl}/upload_catalog_completed`,
      {
        name: options.name,
        email: options.email,
        creator: options.creator,
        url,
        replace: options.replace ?? false,
      },
      {
        headers: {
          'X-CleverTap-Account-Id': this.settings.accountID,
          'X-CleverTap-Passcode': this.settings.accountPasscode,
        },
      }
    )
  }
}
