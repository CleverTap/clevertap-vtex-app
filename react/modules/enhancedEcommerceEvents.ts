import type { PixelMessage } from '../typings/events'
import {
  addToCart,
  addToWishlist,
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
    // Signing Up (pending)
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

    case 'vtex:promoView': {
      promoView(e.data)

      break
    }

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

    // Checkout Failed (pending)

    // Order Paid (pending)

    // Order Updated (pending)

    // Charged (pending)

    case 'vtex:orderPlaced': {
      orderPlaced(e.data)

      break
    }

    // Order Cancelled (pending)
    // vtex:refund

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
