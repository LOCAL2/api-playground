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
import { recipeEndpoints } from './recipes'
import { animalEndpoints } from './animals'
import type { ApiEndpoint } from '@/types'

export const allEndpoints: ApiEndpoint[] = [
  ...userEndpoints,
  ...postEndpoints,
  ...productEndpoints,
  ...studentEndpoints,
  ...movieEndpoints,
  ...bookEndpoints,
  ...countryEndpoints,
  ...todoEndpoints,
  ...recipeEndpoints,
  ...animalEndpoints,
]

export {
  userEndpoints, postEndpoints, productEndpoints, studentEndpoints,
  movieEndpoints, bookEndpoints, countryEndpoints, todoEndpoints,
  recipeEndpoints, animalEndpoints,
}
