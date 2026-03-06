import clevertap from 'clevertap-web-sdk'

import type {
  AddToCartData,
  AddToWishlistData,
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
  UserData,
  ViewCartData,
} from '../typings/events'
import {
  formatCartSummary,
  getCategory,
  getItemFromStorage,
  getPaymentMethodsString,
  getPrice,
  getQuantity,
  getSeller,
  normalizeUrl,
} from './utils'
import {
  fetchProfileSession,
  initClevertapProfile,
  pushEvent,
  verifyIsLogged,
} from '../lib/clevertap'

export async function signIn(eventData: UserData) {
  const { isAuthenticated, email } = eventData
  const isLogged = verifyIsLogged()

  if (isAuthenticated && !isLogged) {
    await initClevertapProfile()

    try {
      const savedConfig = localStorage.getItem('clevertapConfigs')
      const config = savedConfig ? JSON.parse(savedConfig) : {}

      config.isLogged = true

      localStorage.setItem('clevertapConfigs', JSON.stringify(config))

      const userEmail = email || (await fetchProfileSession())?.email

      if (userEmail) {
        signUp({ email: userEmail })
      }
    } catch (e) {
      console.error('CleverTap: failed to update isLogged in localStorage', e)
    }
  }
}

export function signUp(eventData: SignUpData) {
  const eventName = 'Sign Up'

  const { email } = eventData

  const data = {
    email,
  }

  pushEvent(eventName, data)
}

export function search(eventData: SearchData) {
  const eventName = 'Products Searched'

  const { term } = eventData

  const decodedTerm = term ? decodeURIComponent(term) : term

  const data = {
    keyword: decodedTerm,
  }

  pushEvent(eventName, data)
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

  pushEvent(eventName, data)
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

  pushEvent(eventName, data)
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

  pushEvent(eventName, data)
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

  pushEvent(eventName, data)
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

  const { itemId, imageUrl, ean, sellers } = selectedSku

  const seller = getSeller(sellers)
  const price = getPrice(seller)
  const quantity = getQuantity(seller)
  const category = getCategory(categories)
  const normalizedUrl = normalizeUrl(detailUrl)

  const data = {
    product_id: productId,
    sku: itemId,
    category,
    name: productName,
    variant: ean,
    brand,
    price,
    quantity,
    url: normalizedUrl,
    image_url: imageUrl,
  }

  pushEvent(eventName, data)
}

export function productClick(eventData: ProductClickData) {
  const eventName = 'Product Clicked'

  const { list, product } = eventData
  const { productId, sku, categories, productName, brand, detailUrl } = product

  const { itemId, image, ean, seller } = sku
  const imageUrl = image ? image.imageUrl : ''

  const price = getPrice(seller)
  const quantity = getQuantity(seller)
  const category = getCategory(categories)
  const normalizedUrl = normalizeUrl(detailUrl)

  const data = {
    position: list,
    product_id: productId,
    sku: itemId,
    category,
    name: productName,
    variant: ean,
    brand,
    price,
    quantity,
    url: normalizedUrl,
    image_url: imageUrl,
  }

  pushEvent(eventName, data)
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

  const normalizedUrl = normalizeUrl(detailUrl)

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
    url: normalizedUrl,
    image_url: imageUrl,
    // prodUct_is_wishlisted: true,
  }

  pushEvent(eventName, data)
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

  const normalizedUrl = normalizeUrl(detailUrl)

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
    url: normalizedUrl,
    image_url: imageUrl,
  }

  pushEvent(eventName, data)
}

export function viewCart(eventData: ViewCartData) {
  const eventName = 'Cart Viewed'

  const orderForm = getItemFromStorage<OrderForm>('orderform')

  if (!orderForm) return

  const { id, marketingData } = orderForm

  const { items } = eventData

  const { totalItems, totalValue } = formatCartSummary(items, {
    dividePrice: true,
  })

  const data = {
    cart_id: id,
    value: totalValue,
    items_qty: totalItems,
    coupon: marketingData.coupon,
  }

  pushEvent(eventName, data)
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
  const normalizedUrl = normalizeUrl(detailUrl)

  const data = {
    // wishlist_id: 'teste123',
    wishlist_name: list,
    product_id: productId,
    sku: itemId,
    category,
    name: productName,
    brand,
    variant: ean,
    price,
    quantity,
    url: normalizedUrl,
    image_url: imageUrl,
  }

  pushEvent(eventName, data)
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
  const normalizedUrl = normalizeUrl(detailUrl)

  const data = {
    // wishlist_id: 'teste123',
    wishlist_name: list,
    product_id: productId,
    sku: itemId,
    category,
    name: productName,
    brand,
    variant: ean,
    price,
    quantity,
    url: normalizedUrl,
    image_url: imageUrl,
  }

  pushEvent(eventName, data)
}

export function share(eventData: ShareData) {
  const eventName = 'Product Shared'

  const { itemId, method } = eventData

  const data = {
    share_via: method,
    // product_id: '123sku123',
    sku: itemId,
    // category: 'Shoes',
    // name: 'UltraRange 2.0 Shoe',
    // brand: 'Vans',
    // variant: 'VN000D60BLK',
    // price: 100,
    // quantity: 10,
    // url:
    //  'https://www.vans.com/en-us/p/shoes/ultrarange-5140/ultrarange-20-shoe-VN000D60BLK',
    // image_url:
    //  'https://assets.vans.com/images/t_img/c_fill,g_center,f_auto,h_573,w_458,e_unsharp_mask:100/dpr_2.0/v1739986118/VN000D60BLK-ALT1/UltraRange-20-Shoe.png',
  }

  pushEvent(eventName, data)
}

export function orderPlaced(
  eventData: OrderPlacedData,
  useChargeEventOnlyWhenOrderApproved: boolean
) {
  const eventName = useChargeEventOnlyWhenOrderApproved
    ? 'Order Created'
    : 'Charged'

  const {
    transactionId,
    transactionAffiliation,
    transactionTotal,
    transactionSubtotal,
    transactionShipping,
    transactionDiscounts,
    transactionTax,
    transactionPaymentType,
    coupon,
    currency,
  } = eventData

  const paymentMethod = getPaymentMethodsString(transactionPaymentType)

  const data = {
    order_id: transactionId,
    affiliation: transactionAffiliation,
    value: transactionTotal,
    revenue: transactionSubtotal,
    shipping: transactionShipping,
    tax: transactionTax,
    discount: transactionDiscounts,
    payment_method: paymentMethod,
    currency,
    coupon: coupon || '',
  }

  pushEvent(eventName, data)
}
