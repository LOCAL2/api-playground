import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X, LayoutList } from 'lucide-react'
import { Sidebar } from '@/components/layouts/Sidebar'
import { SearchBar } from '@/components/SearchBar'
import { EndpointCard } from '@/components/EndpointCard'
import { useEndpointFilter } from '@/hooks/useEndpointFilter'
import { categories } from '@/data/categories'
import { cn } from '@/utils/cn'
import type { HttpMethod } from '@/types'

/**
 * Main endpoint listing page with sidebar navigation, search, and filters.
 * Category filter is driven entirely by the URL ?category= param.
 */
export default function EndpointsPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const activeCategory = searchParams.get('category')

  const {
    filters,
    filteredEndpoints,
    setSearch,
    setMethod,
    resetFilters,
    totalCount,
    filteredCount,
  } = useEndpointFilter()

  const hasActiveFilters =
    filters.search || filters.category !== 'All' || filters.method !== 'All'

  const handleReset = () => {
    resetFilters()
    navigate('/')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="flex gap-6">
        {/* Sidebar — desktop only */}
        <div className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-20">
            <Sidebar />
          </div>
        </div>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {filters.category !== 'All' ? filters.category : 'API Endpoints'}
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {filteredCount} of {totalCount} endpoints
            </p>
          </div>

          {/* Mobile category pills — hidden on lg */}
          <div className="mb-4 -mx-4 px-4 lg:hidden">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              <Link
                to="/"
                className={cn(
                  'flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                  !activeCategory
                    ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                    : 'border-zinc-200 bg-white text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400'
                )}
              >
                <LayoutList className="h-3.5 w-3.5" aria-hidden="true" />
                All
              </Link>
              {categories.map(cat => (
                <Link
                  key={cat.name}
                  to={`/?category=${encodeURIComponent(cat.name)}`}
                  className={cn(
                    'shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                    activeCategory === cat.name
                      ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                      : 'border-zinc-200 bg-white text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400'
                  )}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 space-y-3">
            <SearchBar value={filters.search} onChange={setSearch} className="w-full" />

            <div className="flex flex-wrap items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />

              {/* Method filters */}
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by HTTP method">
                <button
                  onClick={() => setMethod('All')}
                  className={cn(
                    'cursor-pointer rounded-md border px-4 py-1.5 text-sm font-semibold transition-all',
                    filters.method === 'All'
                      ? 'border-zinc-900 bg-zinc-900 text-white shadow-sm dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                      : 'border-zinc-300 bg-white text-zinc-500 hover:border-zinc-500 hover:text-zinc-800 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-400 dark:hover:text-zinc-200'
                  )}
                >
                  All
                </button>
                {(
                  [
                    { m: 'GET',    active: 'border-emerald-600 bg-emerald-600 text-white shadow-sm', idle: 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:border-emerald-500 hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 dark:hover:border-emerald-500' },
                    { m: 'POST',   active: 'border-blue-600 bg-blue-600 text-white shadow-sm',       idle: 'border-blue-300 bg-blue-50 text-blue-700 hover:border-blue-500 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-950/40 dark:text-blue-400 dark:hover:border-blue-500' },
                    { m: 'PUT',    active: 'border-amber-600 bg-amber-600 text-white shadow-sm',     idle: 'border-amber-300 bg-amber-50 text-amber-700 hover:border-amber-500 hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-400 dark:hover:border-amber-500' },
                    { m: 'PATCH',  active: 'border-purple-600 bg-purple-600 text-white shadow-sm',   idle: 'border-purple-300 bg-purple-50 text-purple-700 hover:border-purple-500 hover:bg-purple-100 dark:border-purple-700 dark:bg-purple-950/40 dark:text-purple-400 dark:hover:border-purple-500' },
                    { m: 'DELETE', active: 'border-red-600 bg-red-600 text-white shadow-sm',         idle: 'border-red-300 bg-red-50 text-red-700 hover:border-red-500 hover:bg-red-100 dark:border-red-700 dark:bg-red-950/40 dark:text-red-400 dark:hover:border-red-500' },
                  ] as const
                ).map(({ m, active, idle }) => (
                  <button
                    key={m}
                    onClick={() => setMethod(m === filters.method ? 'All' : m)}
                    className={cn(
                      'cursor-pointer rounded-md border px-4 py-1.5 font-mono text-sm font-bold tracking-wide transition-all',
                      filters.method === m ? active : idle
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {/* Reset filters */}
              {hasActiveFilters && (
                <button
                  onClick={handleReset}
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
                onClick={handleReset}
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
