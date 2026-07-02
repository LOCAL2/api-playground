import { Link } from 'react-router-dom'
import { Lock, Unlock, ChevronRight } from 'lucide-react'
import { MethodBadge } from './MethodBadge'
import { CopyButton } from './CopyButton'
import { buildFullUrl } from '@/utils/clipboard'
import type { ApiEndpoint } from '@/types'
import { cn } from '@/utils/cn'

interface EndpointCardProps {
  endpoint: ApiEndpoint
  className?: string
}

/**
 * Card component displaying a summary of an API endpoint
 * Links to the full endpoint detail page
 */
export function EndpointCard({ endpoint, className }: EndpointCardProps) {
  const fullUrl = buildFullUrl(endpoint.baseUrl, endpoint.path)

  return (
    <Link
      to={`/endpoints/${endpoint.id}`}
      className={cn(
        'group block rounded-xl border bg-white p-4 transition-all',
        'border-zinc-200 hover:border-zinc-300 hover:shadow-sm',
        'dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          {/* Method + Name */}
          <div className="flex items-center gap-2">
            <MethodBadge method={endpoint.method} size="sm" />
            <span className="truncate font-medium text-zinc-900 dark:text-zinc-100">
              {endpoint.name}
            </span>
          </div>

          {/* Full URL + copy */}
          <div
            className="flex items-center gap-1.5 rounded-md bg-zinc-50 px-2 py-1 dark:bg-zinc-800/60"
            onClick={e => e.preventDefault()}
          >
            <code className="min-w-0 truncate font-mono text-xs text-zinc-600 dark:text-zinc-400">
              {fullUrl}
            </code>
            <CopyButton text={fullUrl} label="Copy" size="md" className="ml-auto shrink-0" />
          </div>

          {/* Description */}
          <p className="line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
            {endpoint.description}
          </p>
        </div>

        {/* Auth + Arrow */}
        <div className="flex shrink-0 flex-col items-end gap-2">
          <ChevronRight className="h-4 w-4 text-zinc-300 transition-transform group-hover:translate-x-0.5 dark:text-zinc-600" />
          <div
            className={cn(
              'flex items-center gap-1 rounded-full px-2 py-0.5 text-xs',
              endpoint.requiresAuth
                ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400'
                : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
            )}
            title={endpoint.requiresAuth ? 'Requires authentication' : 'No auth required'}
          >
            {endpoint.requiresAuth ? (
              <Lock className="h-3 w-3" aria-hidden="true" />
            ) : (
              <Unlock className="h-3 w-3" aria-hidden="true" />
            )}
            <span className="hidden sm:inline">{endpoint.requiresAuth ? 'Auth' : 'Public'}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
