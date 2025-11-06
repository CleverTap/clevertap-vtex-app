import { method } from '@vtex/api'

import { validateCatalogSync } from '../middlewares/catalog/validateCatalogSync'
import { catalogSyncHandler } from '../handlers/catalogSyncHandler'
import { errorMiddleware } from '../middlewares/error/errorMiddleware'

// Only for testing purposes
export const catalogRoutes = {
  catalogSync: method({
    POST: [errorMiddleware, validateCatalogSync, catalogSyncHandler],
  }),
}
