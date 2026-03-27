import {
  initClevertapProfile,
  pushEvent,
  verifyIsLogged,
} from '../lib/clevertap'
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
  fetchProductBySkuId,
  formatCartSummary,
  formatMoneyAmount,
  getCategory,
  getItemFromStorage,
  getPaymentMethodsString,
  getPrice,
  getQuantity,
  getSeller,
  normalizeCartItemUnitPrice,
  normalizeUrl,
} from './utils'

export async function signIn(eventData: UserData) {
  const { isAuthenticated } = eventData
  const isLogged = verifyIsLogged()

  if (isAuthenticated && !isLogged) {
    await initClevertapProfile()

    try {
      const savedConfig = localStorage.getItem('clevertapConfigs')
      const config = savedConfig ? JSON.parse(savedConfig) : {}

      config.isLogged = true

      localStorage.setItem('clevertapConfigs', JSON.stringify(config))
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
  const price = formatMoneyAmount(getPrice(seller))
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
  const { productId, sku, categories, productName, brand, link } = product

  const { itemId, image, ean, seller } = sku
  const imageUrl = image ? image.imageUrl : ''

  const price = formatMoneyAmount(getPrice(seller))
  const quantity = getQuantity(seller)
  const category = getCategory(categories)
  const normalizedUrl = normalizeUrl(link)

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
        priceIsInt,
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
    price: normalizeCartItemUnitPrice(price, priceIsInt),
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
        priceIsInt,
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
    price: normalizeCartItemUnitPrice(price, priceIsInt),
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

  const { sku, productName, productId, link, categories, brand } = product

  const { itemId, images, ean } = selectedItem

  const imageUrl = images && images.length > 0 ? images[0].imageUrl : ''

  const seller = getSeller(sku ? sku.sellers : selectedItem.sellers)
  const price = formatMoneyAmount(getPrice(seller))
  const quantity = getQuantity(seller)
  const category = getCategory(categories)
  const normalizedUrl = normalizeUrl(link)

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

  const { sku, productName, productId, link, categories, brand } = product

  const { itemId, images, ean } = selectedItem

  const imageUrl = images && images.length > 0 ? images[0].imageUrl : ''

  const seller = getSeller(sku ? sku.sellers : selectedItem.sellers)
  const price = formatMoneyAmount(getPrice(seller))
  const quantity = getQuantity(seller)
  const category = getCategory(categories)
  const normalizedUrl = normalizeUrl(link)

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

export async function share(eventData: ShareData) {
  const eventName = 'Product Shared'

  const { itemId, method } = eventData
  const catalog = await fetchProductBySkuId(itemId)

  const data: Record<string, unknown> = {
    share_via: method,
    sku: itemId,
  }

  if (catalog) {
    const { product, item } = catalog
    const sellers = item.sellers ?? []
    const seller = sellers.length ? getSeller(sellers) : undefined
    const rawPrice = seller ? getPrice(seller) : undefined
    const price =
      rawPrice != null && !Number.isNaN(Number(rawPrice))
        ? formatMoneyAmount(rawPrice)
        : undefined

    const quantity = seller ? getQuantity(seller) : undefined
    const category = getCategory(product.categories ?? []) ?? ''
    const rawLink = product.link || product.detailUrl || product.linkText || ''
    const imageUrl =
      item.imageUrl ||
      (item.images?.length ? item.images[0]?.imageUrl : '') ||
      ''

    Object.assign(data, {
      product_id: product.productId,
      category,
      name: product.productName || item.name,
      brand: product.brand,
      variant: item.ean || '',
      ...(price !== undefined ? { price } : {}),
      ...(quantity !== undefined ? { quantity } : {}),
      url: normalizeUrl(rawLink),
      image_url: normalizeUrl(imageUrl),
    })
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
    value: formatMoneyAmount(transactionTotal),
    revenue: formatMoneyAmount(transactionSubtotal),
    shipping: formatMoneyAmount(transactionShipping),
    tax: formatMoneyAmount(transactionTax),
    discount: formatMoneyAmount(transactionDiscounts),
    payment_method: paymentMethod,
    currency,
    coupon: coupon || '',
  }

  pushEvent(eventName, data)
}
