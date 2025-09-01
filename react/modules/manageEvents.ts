/* eslint-disable no-console */

import type {
  AddPaymentInfoData,
  AddToCartData,
  AddToWishlistData,
  BeginCheckoutData,
  FilterManipulationData,
  HomePageInfo,
  OrderForm,
  OrderPlacedData,
  ProductClickData,
  ProductPageInfoData,
  ProductViewData,
  PromotionClickData,
  PromoViewData,
  RemoveFromCartData,
  RemoveToWishlistData,
  SearchData,
  SearchPageInfoData,
  ShareData,
  SignUpData,
  ViewCartData,
} from '../typings/events'
import {
  formatCartSummary,
  getCategory,
  getItemFromStorage,
  getPrice,
  getQuantity,
  getSeller,
  sendCleverTapEvent,
} from './utils'

export function signUp(eventData: SignUpData) {
  const eventName = 'Signing Up'

  console.log(eventName, eventData)

  // TODO: Send via clevertap sdk
}

export function search(eventData: SearchData) {
  const eventName = 'Products Searched'

  const { term } = eventData

  const data = {
    keyword: term,
  }

  sendCleverTapEvent(eventName, data)
}

export function filterManipulation(eventData: FilterManipulationData) {
  const eventName = 'Product Filtered By Category'

  const { items } = eventData

  const { filterName, filterProductCategory, filterValue } = items

  if (filterName !== 'Category') return

  const data = {
    list_id: filterProductCategory,
    category: filterValue,
  }

  sendCleverTapEvent(eventName, data)
}

export function categoryView(
  eventData: HomePageInfo | ProductPageInfoData | SearchPageInfoData
) {
  const eventName = 'Product List Viewed'

  const { category } = eventData as SearchPageInfoData

  if (!category) return

  const { id, name } = category

  const data = {
    list_id: id,
    category: name,
  }

  sendCleverTapEvent(eventName, data)
}

export function promoView(eventData: PromoViewData) {
  const eventName = 'Promotion Viewed'

  const {
    promotions: [{ id, name }],
  } = eventData

  const data = {
    promotion_id: id,
    name,
  }

  sendCleverTapEvent(eventName, data)
}

export function promotionClick(eventData: PromotionClickData) {
  const eventName = 'Promotion Clicked'

  const {
    promotions: [{ id, name }],
  } = eventData

  const data = {
    promotion_id: id,
    name,
  }

  sendCleverTapEvent(eventName, data)
}

export function productView(eventData: ProductViewData) {
  const eventName = 'Product Viewed'

  const { product } = eventData

  const {
    selectedSku,
    productName,
    productId,
    categories,
    brand,
    detailUrl,
  } = product

  const { itemId, imageUrl, ean } = selectedSku

  const seller = getSeller(selectedSku.sellers)
  const price = getPrice(seller)
  const quantity = getQuantity(seller)
  const category = getCategory(categories)

  const data = {
    product_id: productId,
    sku: itemId,
    category,
    name: productName,
    variant: ean,
    brand,
    price,
    quantity,
    url: detailUrl,
    image_url: imageUrl,
  }

  sendCleverTapEvent(eventName, data)
}

export function productClick(eventData: ProductClickData) {
  const eventName = 'Product Clicked'

  const { list } = eventData

  const data = {
    position: list,
  }

  sendCleverTapEvent(eventName, data)
}

export function addToCart(eventData: AddToCartData) {
  const eventName = 'Product Added To Cart'

  const orderForm = getItemFromStorage<OrderForm>('orderform')

  if (!orderForm) return

  const { id } = orderForm

  const {
    items: [
      {
        productId,
        skuId,
        category,
        name,
        brand,
        ean,
        price,
        quantity,
        detailUrl,
        imageUrl,
      },
    ],
  } = eventData

  const data = {
    cart_id: id,
    product_id: productId,
    sku: skuId,
    category,
    name,
    brand,
    variant: ean,
    price,
    quantity,
    url: detailUrl,
    image_url: imageUrl,
    // TODO: Check where to get this info
    prodUct_is_wishlisted: true,
  }

  sendCleverTapEvent(eventName, data)
}

export function removeFromCart(eventData: RemoveFromCartData) {
  const eventName = 'Product Removed From Cart'

  const orderForm = getItemFromStorage<OrderForm>('orderform')

  if (!orderForm) return

  const { id } = orderForm

  const {
    items: [
      {
        productId,
        skuId,
        category,
        name,
        brand,
        ean,
        price,
        quantity,
        detailUrl,
        imageUrl,
      },
    ],
  } = eventData

  const data = {
    cart_id: id,
    product_id: productId,
    sku: skuId,
    category,
    name,
    brand,
    variant: ean,
    price,
    quantity,
    url: detailUrl,
    image_url: imageUrl,
  }

  sendCleverTapEvent(eventName, data)
}

export function viewCart(eventData: ViewCartData) {
  const eventName = 'Cart Viewed'

  const orderForm = getItemFromStorage<OrderForm>('orderform')

  if (!orderForm) return

  const { id, marketingData } = orderForm

  const { items: eventDataItems } = eventData

  const { totalItems, totalValue } = formatCartSummary(eventDataItems, {
    dividePrice: true,
  })

  const data = {
    cart_id: id,
    value: totalValue,
    items_qty: totalItems,
    coupon: marketingData.coupon,
  }

  sendCleverTapEvent(eventName, data)
}

export function beginCheckout(eventData: BeginCheckoutData) {
  const eventName = 'Checkout Started'

  console.log(eventName, eventData)

  // TODO: Send via clevertap sdk
}

export function addPaymentInfo(eventData: AddPaymentInfoData) {
  const eventName = 'Payment info'

  console.log(eventName, eventData)

  // TODO: Send via clevertap sdk
}

export function orderPlaced(eventData: OrderPlacedData) {
  const eventName = 'Order Created'

  console.log(eventName, eventData)

  // TODO: Send via clevertap sdk
}

export function addToWishlist(eventData: AddToWishlistData) {
  const eventName = 'Product Added to Wishlist'

  const { items, list } = eventData

  const { product, selectedItem } = items

  const { sku, productName, productId, detailUrl, categories, brand } = product

  const { itemId, images, ean } = selectedItem

  const imageUrl = images && images.length > 0 ? images[0].imageUrl : ''

  const seller = getSeller(sku ? sku.sellers : selectedItem.sellers)
  const price = getPrice(seller)
  const quantity = getQuantity(seller)
  const category = getCategory(categories)

  const data = {
    // TODO: Check where to get this info
    wishlist_id: 'teste123',
    wishlist_name: list,
    product_id: productId,
    sku: itemId,
    category,
    name: productName,
    brand,
    variant: ean,
    price,
    quantity,
    url: detailUrl,
    image_url: imageUrl,
  }

  sendCleverTapEvent(eventName, data)
}

export function removeToWishlist(eventData: RemoveToWishlistData) {
  const eventName = 'Product Removed from Wishlist'

  const { items, list } = eventData

  const { product, selectedItem } = items

  const { sku, productName, productId, detailUrl, categories, brand } = product

  const { itemId, images, ean } = selectedItem

  const imageUrl = images && images.length > 0 ? images[0].imageUrl : ''

  const seller = getSeller(sku ? sku.sellers : selectedItem.sellers)
  const price = getPrice(seller)
  const quantity = getQuantity(seller)
  const category = getCategory(categories)

  const data = {
    // TODO: Check where to get this info
    wishlist_id: 'teste123',
    wishlist_name: list,
    product_id: productId,
    sku: itemId,
    category,
    name: productName,
    brand,
    variant: ean,
    price,
    quantity,
    url: detailUrl,
    image_url: imageUrl,
  }

  sendCleverTapEvent(eventName, data)
}

export function share(eventData: ShareData) {
  const eventName = 'Product Shared'

  const { itemId, method } = eventData

  const data = {
    share_via: method,
    // TODO: Check where to get this info
    product_id: '123sku123',
    sku: itemId,
    // TODO: Check where to get this info
    category: 'Shoes',
    // TODO: Check where to get this info
    name: 'UltraRange 2.0 Shoe',
    // TODO: Check where to get this info
    brand: 'Vans',
    // TODO: Check where to get this info
    variant: 'VN000D60BLK',
    // TODO: Check where to get this info
    price: 100,
    // TODO: Check where to get this info
    quantity: 10,
    // TODO: Check where to get this info
    url:
      'https://www.vans.com/en-us/p/shoes/ultrarange-5140/ultrarange-20-shoe-VN000D60BLK',
    // TODO: Check where to get this info
    image_url:
      'https://assets.vans.com/images/t_img/c_fill,g_center,f_auto,h_573,w_458,e_unsharp_mask:100/dpr_2.0/v1739986118/VN000D60BLK-ALT1/UltraRange-20-Shoe.png',
  }

  sendCleverTapEvent(eventName, data)
}
