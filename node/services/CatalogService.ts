/* eslint-disable no-await-in-loop */
import { json2csv } from 'json-2-csv'

import type { ClevertapCatalog } from '../clients/clevertapCatalog'
import type { VtexCatalog } from '../clients/vtexCatalog'

interface SyncCatalogOptions {
  accountName: string
  email: string
  creator: string
  replace: boolean
}

export class CatalogService {
  private vtexCatalogClient: VtexCatalog
  private clevertapCatalogClient: ClevertapCatalog
  private pageSize = 20

  constructor(ctx: Context) {
    this.vtexCatalogClient = ctx.clients.vtexCatalog
    this.clevertapCatalogClient = ctx.clients.clevertapCatalog
  }

  public async syncCatalog(ctx: Context, options: SyncCatalogOptions) {
    try {
      const skuIds = await this.getAllSkuIds()

      console.info(`Processed: ${skuIds.length} skus`)

      const clevertapSkus = await this.buildClevertapSkus(skuIds)
      const csv = json2csv(clevertapSkus)

      const {
        presignedS3URL,
      } = await this.clevertapCatalogClient.postCatalogUrl(ctx)

      await this.clevertapCatalogClient.uploadCatalog(csv, presignedS3URL, ctx)

      await this.clevertapCatalogClient.completeUpload(presignedS3URL, ctx, {
        name: `catalog_${options.accountName}`,
        email: options.email,
        creator: options.creator,
        replace: options.replace,
      })

      console.info(`Load completed`)
    } catch (err) {
      console.error(`Error processing load: ${err}`)
      throw err
    }
  }

  private async getAllSkuIds(): Promise<number[]> {
    const skuIds: number[] = []
    let page = 1
    let pageSkuIds: number[] = []

    do {
      pageSkuIds = await this.vtexCatalogClient.getSKUIds(page, this.pageSize)

      if (!pageSkuIds?.length) break

      skuIds.push(...pageSkuIds)
      page++
    } while (pageSkuIds.length === this.pageSize)

    return skuIds
  }

  private async buildClevertapSkus(skuIds: number[]): Promise<any[]> {
    const clevertapSkus: any[] = []

    for (const skuId of skuIds) {
      try {
        const skuData = await this.vtexCatalogClient.getSKUAndContext(skuId)

        if (!skuData.IsActive) {
          continue
        }

        clevertapSkus.push(this.mapToClevertapSku(skuData))
      } catch (err) {
        console.error(`Error processing SKU ${skuId}: ${err}`)
      }
    }

    return clevertapSkus
  }

  private mapToClevertapSku(skuData: any) {
    return {
      Identity: skuData.Id,
      ProductId: skuData.ProductId,
      SkuId: skuData.Id,
      Ean: skuData.AlternateIds.Ean,
      RefId: skuData.AlternateIds.RefId,
      Name: `${skuData.ProductName} - ${skuData.SkuName}`,
      ImageUrl: skuData.ImageUrl,
      Categories: Object.values(skuData.ProductCategories).join(' - '),
      BrandName: skuData.BrandName,
      SalesChannels: skuData.SalesChannels.join(','),
      CommercialCondition: skuData.CommercialConditionId,
    }
  }
}
