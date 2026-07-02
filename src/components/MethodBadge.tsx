import { cn } from '@/utils/cn'
import type { HttpMethod } from '@/types'

interface MethodBadgeProps {
  method: HttpMethod
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/** Color mapping for each HTTP method */
const methodConfig: Record<HttpMethod, { bg: string; text: string; border: string }> = {
  GET: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/50',
    text: 'text-emerald-700 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800',
  },
  POST: {
    bg: 'bg-blue-50 dark:bg-blue-950/50',
    text: 'text-blue-700 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
  },
  PUT: {
    bg: 'bg-amber-50 dark:bg-amber-950/50',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800',
  },
  PATCH: {
    bg: 'bg-purple-50 dark:bg-purple-950/50',
    text: 'text-purple-700 dark:text-purple-400',
    border: 'border-purple-200 dark:border-purple-800',
  },
  DELETE: {
    bg: 'bg-red-50 dark:bg-red-950/50',
    text: 'text-red-700 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800',
  },
}

const sizeConfig = {
  sm: 'text-xs px-1.5 py-0.5 min-w-[52px]',
  md: 'text-xs px-2 py-0.5 min-w-[60px]',
  lg: 'text-sm px-2.5 py-1 min-w-[68px]',
}

/**
 * Badge component displaying HTTP method with appropriate color coding
 */
export function MethodBadge({ method, size = 'md', className }: MethodBadgeProps) {
  const config = methodConfig[method]

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded border font-mono font-semibold tracking-wide',
        config.bg,
        config.text,
        config.border,
        sizeConfig[size],
        className
      )}
    >
      {method}
    </span>
  )
}
