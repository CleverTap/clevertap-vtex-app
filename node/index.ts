import type {
  ClientsConfig,
  EventContext,
  RecorderState,
  ServiceContext,
} from '@vtex/api'
import { LRUCache, Service } from '@vtex/api'

import { Clients } from './clients'
import { omsFilteredEvents } from './middlewares/oms/omsFilteredEvents'

const TIMEOUT_MS = 800
const CATALOG_TIMEOUT_MS = 10000

// Create a LRU memory cache for the Status client.
// The @vtex/api HttpClient respects Cache-Control headers and uses the provided cache.
const memoryCache = new LRUCache<string, any>({ max: 5000 })

metrics.trackCache('status', memoryCache)

// This is the configuration for clients available in `ctx.clients`.
const clients: ClientsConfig<Clients> = {
  // We pass our custom implementation of the clients bag, containing the Status client.
  implementation: Clients,
  options: {
    // All IO Clients will be initialized with these options, unless otherwise specified.
    default: {
      retries: 2,
      timeout: TIMEOUT_MS,
    },
    // This key will be merged with the default options and add this cache to our Status client.
    status: {
      memoryCache,
    },
    vtexCatalog: {
      retries: 2,
      timeout: CATALOG_TIMEOUT_MS,
    },
    clevertapCatalog: {
      retries: 2,
      timeout: CATALOG_TIMEOUT_MS,
    },
  },
}

declare global {
  type Context = ServiceContext<Clients, State>

  interface StatusChangeContext extends EventContext<Clients> {
    body: {
      domain: string
      orderId: string
      currentState: string
      lastState: string
      currentChangeDate: string
      lastChangeDate: string
    }
  }
  // The shape of our State object found in `ctx.state`. This is used as state bag to communicate between middlewares.
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface State extends RecorderState {}
}

// Export a service that defines route handlers and client options.
export default new Service({
  clients,
  events: {
    omsFilteredEvents,
  },
  // For testing only:
  // To enable this, add the "catalogSync" route to your service.json with the POST method.
  // routes: {
  //   ...catalogRoutes,
  // },
})
