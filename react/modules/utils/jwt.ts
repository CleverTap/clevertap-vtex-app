import jwtDecode from 'jwt-decode'

export function decodeJWT<T = Record<string, any>>(token: string): T | null {
  if (!token) return null

  try {
    const payload = jwtDecode<T>(token)

    return payload
  } catch (err) {
    console.error('Erro ao decodificar JWT:', err)

    return null
  }
}
