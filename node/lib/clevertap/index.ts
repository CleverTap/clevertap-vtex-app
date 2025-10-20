import * as clevertap from 'clevertap'

import { CLEVERTAP_REGIONS } from '../../consts/clevertap'
import { getConfig } from './getConfig'

export async function getCleverTap(ctx: any) {
  const settings = await getConfig(ctx)

  if (!settings?.accountID || !settings?.accountPasscode || !settings?.region) {
    throw new Error('CleverTap settings not configured')
  }

  const region = getRegion(settings.region)

  return clevertap.init(
    settings.accountID,
    settings.accountPasscode,
    region as clevertap.REGIONS
  )
}

function getRegion(region: string) {
  const entry = Object.entries(CLEVERTAP_REGIONS).find(
    ([, value]) => value === region
  )

  if (!entry) {
    throw new Error(`Invalid CleverTap region: ${region}`)
  }

  return entry[1]
}
