import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import { Sidebar } from '@/components/layouts/Sidebar'
import { SearchBar } from '@/components/SearchBar'
import { EndpointCard } from '@/components/EndpointCard'
import { MethodBadge } from '@/components/MethodBadge'
import { Breadcrumb } from '@/components/Breadcrumb'
import { useEndpointFilter } from '@/hooks/useEndpointFilter'
import { cn } from '@/utils/cn'
import type { HttpMethod, ApiCategory } from '@/types'

const HTTP_METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']

/**
 * Main endpoint listing page with sidebar navigation, search, and filters
 */
export default function EndpointsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const {
    filters,
    filteredEndpoints,
    setSearch,
    setCategory,
    setMethod,
    resetFilters,
    totalCount,
    filteredCount,
  } = useEndpointFilter()

  // Sync URL query params with filter state
  useEffect(() => {
    const cat = searchParams.get('category') as ApiCategory | null
    const method = searchParams.get('method') as HttpMethod | null
    if (cat) setCategory(cat)
    if (method) setMethod(method)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const hasActiveFilters = filters.search || filters.category !== 'All' || filters.method !== 'All'

  const handleCategoryChange = (cat: ApiCategory | 'All') => {
    setCategory(cat)
    const params = new URLSearchParams(searchParams)
    if (cat === 'All') {
      params.delete('category')
    } else {
      params.set('category', cat)
    }
    setSearchParams(params)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'API Endpoints' }]} className="mb-6" />

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-20">
            <Sidebar />
          </div>
        </div>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">API Endpoints</h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {filteredCount} of {totalCount} endpoints
            </p>
          </div>

          {/* Filters */}
          <div className="mb-6 space-y-3">
            <SearchBar value={filters.search} onChange={setSearch} className="w-full" />

            <div className="flex flex-wrap items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />

              {/* Method filters */}
              <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by HTTP method">
                <button
                  onClick={() => setMethod('All')}
                  className={cn(
                    'rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
                    filters.method === 'All'
                      ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                      : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800'
                  )}
                >
                  All Methods
                </button>
                {HTTP_METHODS.map(method => (
                  <button
                    key={method}
                    onClick={() => setMethod(method === filters.method ? 'All' : method)}
                    className={cn(
                      'rounded-md border px-2.5 py-1 transition-colors',
                      filters.method === method
                        ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                        : 'border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800'
                    )}
                  >
                    <MethodBadge method={method} size="sm" />
                  </button>
                ))}
              </div>

              {/* Reset filters */}
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="ml-auto flex items-center gap-1 rounded-md px-2 py-1 text-xs text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {/* Endpoint list */}
          {filteredEndpoints.length > 0 ? (
            <div className="space-y-3" role="list" aria-label="API endpoints">
              {filteredEndpoints.map(endpoint => (
                <div key={endpoint.id} role="listitem">
                  <EndpointCard endpoint={endpoint} />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-zinc-200 bg-white py-16 text-center dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-zinc-500 dark:text-zinc-400">No endpoints found matching your filters.</p>
              <button
                onClick={resetFilters}
                className="mt-3 text-sm font-medium text-zinc-900 underline-offset-2 hover:underline dark:text-zinc-100"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
