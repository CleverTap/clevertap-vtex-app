import {
  getUseChargeEventOnlyWhenOrderApproved,
  verifyEvent,
  verifyIsLogged,
  verifyIsUnknownEvents,
} from '../lib/clevertap'
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
  signIn,
  viewCart,
} from './manageEvents'

export async function sendEnhancedEcommerceEvents(e: PixelMessage) {
  switch (e.data.eventName) {
    case 'vtex:userData': {
      signIn(e.data)

      break
    }

    case 'vtex:search': {
      // Delay required to ensure the vtex:userData event is trigered
      await new Promise(resolve => setTimeout(resolve, 500))

      const isUnknownEvents = verifyIsUnknownEvents()
      const isLogged = verifyIsLogged()

      if (!isUnknownEvents && !isLogged) return

      if (verifyEvent('vtex:search')) search(e.data)

      break
    }

    case 'vtex:filterManipulation': {
      // Delay required to ensure the vtex:userData event is trigered
      await new Promise(resolve => setTimeout(resolve, 500))

      // Delay required to ensure the vtex:userData event is trigered
      await new Promise(resolve => setTimeout(resolve, 500))

      const isUnknownEvents = verifyIsUnknownEvents()
      const isLogged = verifyIsLogged()

      if (!isUnknownEvents && !isLogged) return

      if (verifyEvent('vtex:filterManipulation')) filterManipulation(e.data)

      break
    }

    case 'vtex:promoView': {
      // Delay required to ensure the vtex:userData event is trigered
      await new Promise(resolve => setTimeout(resolve, 500))

      const isUnknownEvents = verifyIsUnknownEvents()
      const isLogged = verifyIsLogged()

      if (!isUnknownEvents && !isLogged) return

      if (verifyEvent('vtex:promoView')) promoView(e.data)

      break
    }

    case 'vtex:promotionClick': {
      // Delay required to ensure the vtex:userData event is trigered
      await new Promise(resolve => setTimeout(resolve, 500))

      const isUnknownEvents = verifyIsUnknownEvents()
      const isLogged = verifyIsLogged()

      if (!isUnknownEvents && !isLogged) return

      if (verifyEvent('vtex:promotionClick')) promotionClick(e.data)

      break
    }

    case 'vtex:productClick': {
      // Delay required to ensure the vtex:userData event is trigered
      await new Promise(resolve => setTimeout(resolve, 500))

      const isUnknownEvents = verifyIsUnknownEvents()
      const isLogged = verifyIsLogged()

      if (!isUnknownEvents && !isLogged) return

      if (verifyEvent('vtex:productClick')) productClick(e.data)

      break
    }

    case 'vtex:productView': {
      // Delay required to ensure the vtex:userData event is trigered
      await new Promise(resolve => setTimeout(resolve, 500))

      const isUnknownEvents = verifyIsUnknownEvents()
      const isLogged = verifyIsLogged()

      if (!isUnknownEvents && !isLogged) return

      if (verifyEvent('vtex:productView')) productView(e.data)

      break
    }

    case 'vtex:addToCart': {
      // Delay required to ensure the vtex:userData event is trigered
      await new Promise(resolve => setTimeout(resolve, 500))

      const isUnknownEvents = verifyIsUnknownEvents()
      const isLogged = verifyIsLogged()

      if (!isUnknownEvents && !isLogged) return

      if (verifyEvent('vtex:addToCart')) addToCart(e.data)

      break
    }

    case 'vtex:removeFromCart': {
      // Delay required to ensure the vtex:userData event is trigered
      await new Promise(resolve => setTimeout(resolve, 500))

      const isUnknownEvents = verifyIsUnknownEvents()
      const isLogged = verifyIsLogged()

      if (!isUnknownEvents && !isLogged) return

      if (verifyEvent('vtex:removeFromCart')) removeFromCart(e.data)

      break
    }

    case 'vtex:viewCart': {
      // Delay required to ensure the vtex:userData event is trigered
      await new Promise(resolve => setTimeout(resolve, 500))

      const isUnknownEvents = verifyIsUnknownEvents()
      const isLogged = verifyIsLogged()

      if (!isUnknownEvents && !isLogged) return

      if (verifyEvent('vtex:viewCart')) viewCart(e.data)

      break
    }

    case 'vtex:orderPlaced': {
      // Delay required to ensure the vtex:userData event is trigered
      await new Promise(resolve => setTimeout(resolve, 500))

      const isUnknownEvents = verifyIsUnknownEvents()
      const isLogged = verifyIsLogged()

      if (!isUnknownEvents && !isLogged) return

      if (verifyEvent('vtex:orderPlaced')) {
        orderPlaced(e.data, getUseChargeEventOnlyWhenOrderApproved())
      }

      break
    }

    case 'vtex:addToWishlist': {
      // Delay required to ensure the vtex:userData event is trigered
      await new Promise(resolve => setTimeout(resolve, 500))

      const isUnknownEvents = verifyIsUnknownEvents()
      const isLogged = verifyIsLogged()

      if (!isUnknownEvents && !isLogged) return

      if (verifyEvent('vtex:addToWishlist')) addToWishlist(e.data)

      break
    }

    case 'vtex:removeToWishlist': {
      // Delay required to ensure the vtex:userData event is trigered
      await new Promise(resolve => setTimeout(resolve, 500))

      const isUnknownEvents = verifyIsUnknownEvents()
      const isLogged = verifyIsLogged()

      if (!isUnknownEvents && !isLogged) return

      if (verifyEvent('vtex:removeToWishlist')) removeToWishlist(e.data)

      break
    }

    case 'vtex:share': {
      // Delay required to ensure the vtex:userData event is trigered
      await new Promise(resolve => setTimeout(resolve, 500))

      const isUnknownEvents = verifyIsUnknownEvents()
      const isLogged = verifyIsLogged()

      if (!isUnknownEvents && !isLogged) return

      if (verifyEvent('vtex:share')) share(e.data)

      break
    }

    default:
      break
  }
}
