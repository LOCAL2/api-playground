/**
 * Type definitions for the API Playground
 * All API endpoint data structures are defined here
 */

/** HTTP Methods supported */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

/** API Categories */
export type ApiCategory =
  | 'Users'
  | 'Posts'
  | 'Products'
  | 'Students'
  | 'Movies'
  | 'Books'
  | 'Countries'
  | 'Todos'
  | 'Recipes'
  | 'Animals'

/** A single path parameter definition */
export interface PathParameter {
  name: string
  type: string
  required: boolean
  description: string
}

/** A single query parameter definition */
export interface QueryParameter {
  name: string
  type: string
  required: boolean
  description: string
  example?: string
}

/** A required HTTP header */
export interface RequiredHeader {
  name: string
  value: string
  description: string
}

/** A field inside the request body */
export interface BodyField {
  name: string
  type: string
  required: boolean
  description: string
  example?: string
}

/** Request body definition */
export interface RequestBody {
  contentType: string
  fields: BodyField[]
  note?: string
}

/** HTTP Status Code definition */
export interface StatusCode {
  code: number
  meaning: string
  description: string
}

/** Full API Endpoint definition */
export interface ApiEndpoint {
  id: string
  name: string
  description: string
  method: HttpMethod
  baseUrl: string
  path: string
  category: ApiCategory
  pathParameters?: PathParameter[]
  queryParameters?: QueryParameter[]
  requiredHeaders?: RequiredHeader[]
  requestBody?: RequestBody
  requiresAuth: boolean
  authNote?: string
  statusCodes: StatusCode[]
  notes?: string[]
  tags?: string[]
}

/** Category metadata */
export interface CategoryInfo {
  name: ApiCategory
  description: string
  icon: string
  color: string
  endpointCount?: number
}

/** Filter state for the endpoint list */
export interface EndpointFilters {
  search: string
  category: ApiCategory | 'All'
  method: HttpMethod | 'All'
}
