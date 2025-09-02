import type { CleverTap } from './clevertap'

declare global {
  interface Window {
    clevertap: CleverTap
  }
}
