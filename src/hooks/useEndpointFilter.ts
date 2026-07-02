import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { allEndpoints } from '@/data/endpoints'
import type { ApiEndpoint, HttpMethod, ApiCategory } from '@/types'

/**
 * Custom hook for filtering and searching API endpoints.
 * Category is driven by the URL ?category= param directly,
 * so sidebar navigation always reflects the current list.
 */
export function useEndpointFilter() {
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [method, setMethod] = useState<HttpMethod | 'All'>('All')

  // Read category straight from URL — no extra state needed
  const category = (searchParams.get('category') as ApiCategory | null) ?? 'All'

  const filteredEndpoints = useMemo<ApiEndpoint[]>(() => {
    return allEndpoints.filter(endpoint => {
      // Search filter
      if (search) {
        const q = search.toLowerCase()
        const matchesSearch =
          endpoint.name.toLowerCase().includes(q) ||
          endpoint.description.toLowerCase().includes(q) ||
          endpoint.path.toLowerCase().includes(q) ||
          endpoint.tags?.some(tag => tag.toLowerCase().includes(q))
        if (!matchesSearch) return false
      }

      // Category filter — from URL
      if (category !== 'All' && endpoint.category !== category) {
        return false
      }

      // Method filter
      if (method !== 'All' && endpoint.method !== method) {
        return false
      }

      return true
    })
  }, [search, category, method])

  const filters = { search, category, method }

  const resetFilters = () => {
    setSearch('')
    setMethod('All')
    // category is reset by navigating to / (clearing ?category param)
  }

  return {
    filters,
    filteredEndpoints,
    setSearch,
    setMethod,
    resetFilters,
    totalCount: allEndpoints.length,
    filteredCount: filteredEndpoints.length,
  }
}
