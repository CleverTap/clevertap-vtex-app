import { canUseDOM } from 'vtex.render-runtime'

import { initCleverTap } from './lib/clevertap'
import { sendEnhancedEcommerceEvents } from './modules/enhancedEcommerceEvents'
import { sendLegacyEvents } from './modules/legacyEvents'
import type { PixelMessage } from './typings/events'

export function handleEvents(e: PixelMessage) {
  sendEnhancedEcommerceEvents(e)
  sendLegacyEvents(e)
  // sendRequestEvents()
}

if (canUseDOM) {
  initCleverTap()

  window.addEventListener('message', handleEvents)
}
