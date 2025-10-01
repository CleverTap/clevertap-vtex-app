import type { OrderItemDetailResponse } from '@vtex/clients'

import { getCategory } from './get-categories'

export function normalizeItems(items: OrderItemDetailResponse[]) {
  return items.map(item => ({
    product_id: item.productId,
    sku: item.id,
    category: getCategory(item.productCategories),
    name: item.name,
    brand: item.additionalInfo?.brandName || '',
    variant: item.ean || '',
    price: item.price,
    quantity: String(item.quantity),
    url: item.detailUrl || '',
    image_url: item.imageUrl || '',
  }))
}
