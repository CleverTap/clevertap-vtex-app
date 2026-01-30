export function normalizeUrl(url: string | undefined): string {
  if (!url) return ''

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  if (url.startsWith('/')) {
    return `${window.location.origin}${url}`
  }

  return url
}
