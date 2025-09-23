// eslint-disable-next-line @typescript-eslint/no-var-requires
const CleverTap = require('clevertap')

const accountID = '867-848-W57Z'
const accountPasscode = '2f80009b-a468-4ed4-9cdc-2e8b549ec0a0'

const clevertap = CleverTap.init(
  accountID,
  accountPasscode,
  CleverTap.REGIONS.US
)

export default clevertap
