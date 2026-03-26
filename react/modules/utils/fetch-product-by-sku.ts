import type { Seller } from '../../typings/events'

type CatalogSku = {
  itemId: string
  name?: string
  ean?: string
  imageUrl?: string
  images?: Array<{ imageUrl?: string }>
  sellers?: Seller[]
}

type CatalogProduct = {
  productId: string
  productName: string
  brand: string
  categories?: string[]
  link?: string
  linkText?: string
  detailUrl?: string
  items?: CatalogSku[]
}

export type ProductBySkuResult = {
  product: CatalogProduct
  item: CatalogSku
}

/**
 * Busca produto + SKU na API pública do catálogo VTEX (mesma origem da loja).
 */
export async function fetchProductBySkuId(
  skuId: string
): Promise<ProductBySkuResult | null> {
  if (!skuId?.trim()) return null

  try {
    const fq = `skuId:${encodeURIComponent(skuId)}`
    const url = `/api/catalog_system/pub/products/search?_from=0&_to=19&fq=${fq}`
    const res = await fetch(url)

    if (!res.ok) return null

    const products = (await res.json()) as CatalogProduct[]

    if (!Array.isArray(products) || !products.length) return null

    for (const product of products) {
      const item = product.items?.find(i => String(i.itemId) === String(skuId))

      if (item) {
        return { product, item }
      }
    }

    return null
  } catch {
    return null
  }
}
