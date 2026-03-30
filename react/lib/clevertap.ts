import clevertap from 'clevertap-web-sdk'

import type { CleverTapProfile } from '../typings/clevertap'

export function initCleverTap() {
  const savedConfig = localStorage.getItem('clevertapConfigs')
  let config = null

  if (savedConfig) {
    try {
      config = JSON.parse(savedConfig)
    } catch (e) {
      console.error('CleverTap: failed to parse config from localStorage', e)
    }
  }

  if (!config || !config.accountID || !config.region) {
    console.error('CleverTap: no valid configuration found.')

    return null
  }

  clevertap.init(config.accountID, config.region)
  clevertap.privacy.push(config.privacy)
  clevertap.spa = config.spa

  initClevertapNotifications()
  initClevertapLocation(config.privacy.useIP)

  return clevertap
}

export function verifyEvent(eventName: string) {
  const savedConfig = localStorage.getItem('clevertapConfigs')
  let config = null

  if (savedConfig) {
    try {
      config = JSON.parse(savedConfig)
    } catch (e) {
      console.error('CleverTap: failed to parse config from localStorage', e)
    }
  }

  if (!config || !config.preferences || !config.preferences.trackEvents) {
    console.error('CleverTap: no valid configuration found.')

    return false
  }

  const { trackEvents } = config.preferences

  return !!trackEvents[eventName]
}

export function verifyIsUnknownEvents() {
  const savedConfig = localStorage.getItem('clevertapConfigs')
  let config = null

  if (savedConfig) {
    try {
      config = JSON.parse(savedConfig)
    } catch (e) {
      console.error('CleverTap: failed to parse config from localStorage', e)
    }
  }

  if (
    !config ||
    !config.preferences ||
    !config.preferences.allowUnknownUsersEvents
  ) {
    return false
  }

  const { allowUnknownUsersEvents } = config.preferences

  return allowUnknownUsersEvents
}

export function verifyIsLogged() {
  const savedConfig = localStorage.getItem('clevertapConfigs')
  let config = null

  if (savedConfig) {
    try {
      config = JSON.parse(savedConfig)
    } catch (e) {
      console.error('CleverTap: failed to parse config from localStorage', e)
    }
  }

  if (!config || !config.isLogged) {
    return false
  }

  const { isLogged } = config

  return isLogged
}

export function getUseChargeEventOnlyWhenOrderApproved(): boolean {
  const savedConfig = localStorage.getItem('clevertapConfigs')
  let config = null

  if (savedConfig) {
    try {
      config = JSON.parse(savedConfig)
    } catch (e) {
      console.error('CleverTap: failed to parse config from localStorage', e)
    }
  }

  if (!config?.preferences) {
    return true
  }

  return config.preferences.useChargeEventOnlyWhenOrderApproved !== false
}

export async function initClevertapProfile(): Promise<boolean> {
  try {
    const profile = await fetchProfileSession()

    if (!profile?.email) return false

    clevertap.onUserLogin.push({
      Site: {
        Name: profile.name,
        Email: profile.email,
        Phone: profile.phone,
        Gender: profile.gender,
        'MSG-email': false,
        'MSG-push': true,
        'MSG-sms': true,
        'MSG-whatsapp': true,
      },
    })

    return true
  } catch (err) {
    console.error('Erro ao inicializar CleverTap profile:', err)

    return false
  }
}

export function initClevertapNotifications() {
  clevertap.notifications.push({
    titleText: 'Would you like to receive Push Notifications?',
    bodyText:
      'We promise to only send you relevant content and give you updates on your transactions',
    okButtonText: 'Sign me up!',
    rejectButtonText: 'No thanks',
    okButtonColor: '#F28046',
    serviceWorkerPath: '/serviceWorkerMerged.js',
  })
}

export function initClevertapLocation(useIP: boolean) {
  if (useIP) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords

      clevertap.getLocation(latitude, longitude)
    })
  }
}

export async function fetchProfileSession(): Promise<CleverTapProfile | null> {
  try {
    const res = await fetch(
      '/api/sessions?items=profile.firstName,profile.lastName,profile.email,profile.phone,profile.gender'
    )

    if (!res.ok) {
      throw new Error(`Erro na request: ${res.status}`)
    }

    const data = await res.json()

    const namespaces = data?.namespaces?.profile

    if (!namespaces) return null

    const name =
      [namespaces?.firstName?.value, namespaces?.lastName?.value]
        .filter(Boolean)
        .join(' ') || undefined

    const profile: CleverTapProfile = {
      name,
      email: namespaces?.email?.value ?? undefined,
      phone: namespaces?.phone?.value ?? undefined,
      gender: namespaces?.gender?.value ?? undefined,
    }

    return profile
  } catch (err) {
    console.error('Erro ao buscar sessão de perfil:', err)

    return null
  }
}

export function pushEvent(eventName: string, data: Record<string, unknown>) {
  clevertap.event.push(eventName, { ...data, 'CT Source': 'vtex' })
}
