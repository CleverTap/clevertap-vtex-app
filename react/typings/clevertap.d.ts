export interface CleverTapEvent {
  [key: string]: any
}

export interface CleverTap {
  event: {
    push: (eventName: string, eventData: CleverTapEvent) => void
  }
  profile: {
    push: (data: any) => void
  }
}
