import type { IOContext, InstanceOptions } from '@vtex/api'
import { MasterData } from '@vtex/api'

export default class MD extends MasterData {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
    })
  }
}
