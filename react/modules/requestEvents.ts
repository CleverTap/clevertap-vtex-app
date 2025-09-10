import jwtDecode from 'jwt-decode'

import { signUp } from './manageEvents'

let loginEventSent = false

export function sendRequestEvents() {
  const originalFetch = window.fetch

  window.fetch = async (...args) => {
    const response = await originalFetch(...args)

    try {
      const url = (args[0] as any)?.url || args[0]

      if (
        !loginEventSent &&
        url.includes('/api/vtexid/pub/authentication/classic/validate')
      ) {
        const cloned = response.clone()
        const data = await cloned.json().catch(() => null)

        if (data?.authCookie?.Value) {
          try {
            const decoded: { sub?: string } = jwtDecode(data.authCookie.Value)

            if (decoded.sub) {
              loginEventSent = true
              const eventData = { email: decoded.sub }

              signUp(eventData)
            }
          } catch (err) {
            console.error('Erro ao decodificar authCookie:', err)
          }
        }
      }
    } catch (err) {
      console.error('Erro ao processar fetch request:', err)
    }

    return response
  }
}
