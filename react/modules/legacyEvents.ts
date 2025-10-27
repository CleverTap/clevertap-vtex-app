import {
  verifyEvent,
  verifyIsLogged,
  verifyIsUnknownEvents,
} from '../lib/clevertap'
import type { PixelMessage } from '../typings/events'
import { categoryView } from './manageEvents'

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
