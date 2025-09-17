import { canUseDOM } from 'vtex.render-runtime'

import type { PixelMessage } from './typings/events'
import { sendEnhancedEcommerceEvents } from './modules/enhancedEcommerceEvents'
import { sendLegacyEvents } from './modules/legacyEvents'
import { sendRequestEvents } from './modules/requestEvents'

export function handleEvents(e: PixelMessage) {
  sendEnhancedEcommerceEvents(e)
  sendLegacyEvents(e)
  sendRequestEvents()
}

if (canUseDOM) {
  window.addEventListener('message', handleEvents)
}
