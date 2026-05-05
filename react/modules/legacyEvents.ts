import {
  verifyEvent,
  verifyIsLogged,
  verifyIsUnknownEvents,
} from '../lib/clevertap'
import type { PixelMessage } from '../typings/events'
import { categoryView, pageView } from './manageEvents'

const PAGE_VIEW_TYPE_MAP = {
  homeView: 'home',
  internalSiteSearchView: 'search',
  emptySearchView: 'empty_search',
  productPageInfo: 'product',
} as const

type PageViewEventType = keyof typeof PAGE_VIEW_TYPE_MAP

export async function sendLegacyEvents(e: PixelMessage) {
  const isUnknownEvents = verifyIsUnknownEvents()
  const isLogged = verifyIsLogged()

  switch (e.data.eventName) {
    case 'vtex:pageInfo': {
      const { eventType } = e.data

      switch (eventType) {
        case 'categoryView': {
          if (!isUnknownEvents && !isLogged) return

          if (verifyEvent('categoryView')) categoryView(e.data)

          break
        }

        case 'homeView':
        case 'internalSiteSearchView':
        case 'emptySearchView':
        case 'productPageInfo': {
          if (!isUnknownEvents && !isLogged) return

          if (verifyEvent('pageView')) {
            pageView(PAGE_VIEW_TYPE_MAP[eventType as PageViewEventType], e.data)
          }

          break
        }

        default: {
          break
        }
      }

      break
    }

    default: {
      break
    }
  }
}
