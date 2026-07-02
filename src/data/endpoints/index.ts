/**
 * Central export for all API endpoint data
 * Add new endpoint files here to include them in the catalog
 */

import { userEndpoints } from './users'
import { authEndpoints } from './auth'
import { productEndpoints } from './products'
import { orderEndpoints } from './orders'
import { postEndpoints } from './posts'
import { miscEndpoints } from './misc'
import type { ApiEndpoint } from '@/types'

/** All endpoints combined into a single array */
export const allEndpoints: ApiEndpoint[] = [
  ...userEndpoints,
  ...authEndpoints,
  ...productEndpoints,
  ...orderEndpoints,
  ...postEndpoints,
  ...miscEndpoints,
]

export { userEndpoints, authEndpoints, productEndpoints, orderEndpoints, postEndpoints, miscEndpoints }
