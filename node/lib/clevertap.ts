import { CLEVERTAP_REGIONS } from '../consts/clevertap'
import { getConfig } from '../middlewares/getConfig'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const CleverTap = require('clevertap')

export async function getCleverTap(ctx: any) {
  const settings = await getConfig(ctx)

  if (!settings?.accountID || !settings?.accountPasscode || !settings?.region) {
    throw new Error('CleverTap settings not configured')
  }

  const region = getRegion(settings.region)

  return CleverTap.init(settings.accountID, settings.accountPasscode, region)
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
