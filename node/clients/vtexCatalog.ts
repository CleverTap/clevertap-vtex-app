import type { InstanceOptions, IOContext } from '@vtex/api'
import { JanusClient } from '@vtex/api'

export class VtexCatalog extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        VtexIdclientAutCookie:
          context.adminUserAuthToken ?? context.authToken ?? '',
      },
    })
  }

  public async getSKUIds(page: number, pagesize: number): Promise<number[]> {
    return this.http.get(
      `/api/catalog_system/pvt/sku/stockkeepingunitids?page=${page}&pagesize=${pagesize}`,
      {
        metric: 'get-sku-ids',
      }
    )
  }

  public async getSKUAndContext(skuId: number) {
    return this.http.get(
      `/api/catalog_system/pvt/sku/stockkeepingunitbyid/${skuId}`,
      {
        metric: 'get-sku-context',
      }
    )
  }
}
