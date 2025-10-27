import jwtDecode from 'jwt-decode'

import { signUp } from './manageEvents'

let loginEventSent = false

export function sendRequestEvents() {
  const originalFetch = window.fetch

  window.fetch = async (...args) => {
    const response = await originalFetch(...args)

    try {
      const url = (args[0] as any)?.url || args[0]

      // Envia evento de cadastro
      if (
        !loginEventSent &&
        url.includes('/api/vtexid/pub/authentication/classic/validate')
      ) {
        const cloned = response.clone()
        const data = await cloned.json().catch(() => null)
        const authCookie = data?.authCookie?.Value

        if (authCookie) {
          try {
            const decoded: { sub?: string } = jwtDecode(authCookie)

            if (decoded.sub) {
              loginEventSent = true
              signUp({ email: decoded.sub })
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
