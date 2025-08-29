export function getItemFromStorage<T = unknown>(key: string): T | null {
  try {
    const existing = window.localStorage.getItem(key)

    if (!existing) return null

    try {
      return JSON.parse(existing) as T
    } catch {
      return (existing as unknown) as T
    }
  } catch (e) {
    console.error('Error while getting item from localStorage', e)

    return null
  }
}
