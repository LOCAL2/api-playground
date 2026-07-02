/**
 * Central export for all API endpoint data
 */

import { userEndpoints } from './users'
import { postEndpoints } from './posts'
import { productEndpoints } from './products'
import { studentEndpoints } from './students'
import type { ApiEndpoint } from '@/types'

/** All endpoints combined into a single array */
export const allEndpoints: ApiEndpoint[] = [
  ...userEndpoints,
  ...postEndpoints,
  ...productEndpoints,
  ...studentEndpoints,
]

export { userEndpoints, postEndpoints, productEndpoints, studentEndpoints }
