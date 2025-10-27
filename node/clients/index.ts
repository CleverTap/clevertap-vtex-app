import { IOClients } from '@vtex/api'
import { OMS } from '@vtex/clients'

import { ClevertapCatalog } from './clevertapCatalog'
import MD from './md'
import { VtexCatalog } from './vtexCatalog'

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get oms() {
    return this.getOrSet('oms', OMS)
  }

  public get MD() {
    return this.getOrSet('MD', MD)
  }

  public get vtexCatalog() {
    return this.getOrSet('vtexCatalog', VtexCatalog)
  }

  public get clevertapCatalog() {
    return this.getOrSet('clevertapCatalog', ClevertapCatalog)
  }
}
