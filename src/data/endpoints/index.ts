/**
 * Central export for all API endpoint data
 */

import { userEndpoints } from './users'
import { postEndpoints } from './posts'
import { productEndpoints } from './products'
import { studentEndpoints } from './students'
import { movieEndpoints } from './movies'
import { bookEndpoints } from './books'
import { countryEndpoints } from './countries'
import { todoEndpoints } from './todos'
import type { ApiEndpoint } from '@/types'

/** All endpoints combined into a single array */
export const allEndpoints: ApiEndpoint[] = [
  ...userEndpoints,
  ...postEndpoints,
  ...productEndpoints,
  ...studentEndpoints,
  ...movieEndpoints,
  ...bookEndpoints,
  ...countryEndpoints,
  ...todoEndpoints,
]

export {
  userEndpoints,
  postEndpoints,
  productEndpoints,
  studentEndpoints,
  movieEndpoints,
  bookEndpoints,
  countryEndpoints,
  todoEndpoints,
}
