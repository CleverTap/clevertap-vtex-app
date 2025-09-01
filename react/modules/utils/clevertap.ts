import type { CleverTapEvent } from '../../typings/clevertap'

export function sendCleverTapEvent(
  eventName: string,
  eventData: CleverTapEvent
) {
  window.clevertap.event.push(eventName, eventData)
}
