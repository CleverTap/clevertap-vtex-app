import type { PixelMessage } from '../typings/events'
import {
  addPaymentInfo,
  addToCart,
  addToWishlist,
  beginCheckout,
  filterManipulation,
  orderPlaced,
  productClick,
  productView,
  promotionClick,
  promoView,
  removeFromCart,
  removeToWishlist,
  search,
  share,
  signUp,
  viewCart,
} from './manageEvents'

export function sendEnhancedEcommerceEvents(e: PixelMessage) {
  switch (e.data.eventName) {
    // This trigger is not firing
    case 'vtex:signUp': {
      signUp(e.data)

      break
    }

    case 'vtex:search': {
      search(e.data)

      break
    }

    case 'vtex:filterManipulation': {
      filterManipulation(e.data)

      break
    }

    // This trigger is not firing
    case 'vtex:promoView': {
      promoView(e.data)

      break
    }

    // This trigger is not firing
    case 'vtex:promotionClick': {
      promotionClick(e.data)

      break
    }

    case 'vtex:productClick': {
      productClick(e.data)

      break
    }

    case 'vtex:productView': {
      productView(e.data)

      break
    }

    case 'vtex:addToCart': {
      addToCart(e.data)

      break
    }

    case 'vtex:removeFromCart': {
      removeFromCart(e.data)

      break
    }

    case 'vtex:viewCart': {
      viewCart(e.data)

      break
    }

    // This trigger is not firing
    case 'vtex:beginCheckout': {
      beginCheckout(e.data)

      break
    }

    // Checkout Step Viewed (pending)

    // Checkout Step Completed (pending)

    // This trigger is not firing
    case 'vtex:addPaymentInfo': {
      addPaymentInfo(e.data)

      break
    }

    // Checkout Failed (pending)

    // This trigger is not firing
    case 'vtex:orderPlaced': {
      orderPlaced(e.data)

      break
    }

    // Order Paid (pending)

    // Order Updated (pending)

    // Charged (pending)

    // Order Cancelled (pending)

    // Order Cancelled (pending)

    // Coupon Applied (pending)

    // Coupon Denied (pending)

    case 'vtex:addToWishlist': {
      addToWishlist(e.data)

      break
    }

    case 'vtex:removeToWishlist': {
      removeToWishlist(e.data)

      break
    }

    case 'vtex:share': {
      share(e.data)

      break
    }

    // Cart Shared (pending)

    // Product Reviewed (pending)

    default:
      break
  }
}
