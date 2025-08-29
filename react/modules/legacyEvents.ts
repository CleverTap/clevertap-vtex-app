import type { PixelMessage } from '../typings/events'
import { categoryView } from './manageEvents'

export async function sendLegacyEvents(e: PixelMessage) {
  switch (e.data.eventName) {
    case 'vtex:pageInfo': {
      const { eventType } = e.data

      switch (eventType) {
        case 'categoryView': {
          categoryView(e.data)

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
