import { canUseDOM } from 'vtex.render-runtime'

import type { PixelMessage } from './typings/events'

export function handleEvents(e: PixelMessage) {
  switch (e.data.eventName) {
    case 'vtex:addToCart':
      // eslint-disable-next-line no-console
      console.log('Produto adicionado ao carrinho', e.data)
      break

    case 'vtex:pageView': {
      // eslint-disable-next-line no-console
      console.log('Page view disparado')
      break
    }

    default: {
      break
    }
  }
}

if (canUseDOM) {
  window.addEventListener('message', handleEvents)
}
