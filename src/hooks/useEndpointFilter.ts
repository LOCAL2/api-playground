import { useState, useMemo } from 'react'
import { allEndpoints } from '@/data/endpoints'
import type { EndpointFilters, ApiEndpoint, HttpMethod, ApiCategory } from '@/types'

/**
 * Custom hook for filtering and searching API endpoints
 * Handles search, category filter, and method filter
 */
export function useEndpointFilter() {
  const [filters, setFilters] = useState<EndpointFilters>({
    search: '',
    category: 'All',
    method: 'All',
  })

  const filteredEndpoints = useMemo<ApiEndpoint[]>(() => {
    return allEndpoints.filter(endpoint => {
      // Search filter
      if (filters.search) {
        const q = filters.search.toLowerCase()
        const matchesSearch =
          endpoint.name.toLowerCase().includes(q) ||
          endpoint.description.toLowerCase().includes(q) ||
          endpoint.path.toLowerCase().includes(q) ||
          endpoint.tags?.some(tag => tag.toLowerCase().includes(q))
        if (!matchesSearch) return false
      }

      // Category filter
      if (filters.category !== 'All' && endpoint.category !== filters.category) {
        return false
      }

      // Method filter
      if (filters.method !== 'All' && endpoint.method !== filters.method) {
        return false
      }

      return true
    })
  }, [filters])

  const setSearch = (search: string) => setFilters(prev => ({ ...prev, search }))
  const setCategory = (category: ApiCategory | 'All') => setFilters(prev => ({ ...prev, category }))
  const setMethod = (method: HttpMethod | 'All') => setFilters(prev => ({ ...prev, method }))
  const resetFilters = () => setFilters({ search: '', category: 'All', method: 'All' })

  return {
    filters,
    filteredEndpoints,
    setSearch,
    setCategory,
    setMethod,
    resetFilters,
    totalCount: allEndpoints.length,
    filteredCount: filteredEndpoints.length,
  }
}
