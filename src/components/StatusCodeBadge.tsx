import { cn } from '@/utils/cn'

interface StatusCodeBadgeProps {
  code: number
  className?: string
}

/**
 * Badge showing HTTP status codes with color-coded ranges
 */
export function StatusCodeBadge({ code, className }: StatusCodeBadgeProps) {
  const getColor = (code: number) => {
    if (code >= 200 && code < 300) return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800'
    if (code >= 300 && code < 400) return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800'
    if (code >= 400 && code < 500) return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800'
    if (code >= 500) return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800'
    return 'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded border px-2 py-0.5 font-mono text-xs font-semibold',
        getColor(code),
        className
      )}
    >
      {code}
    </span>
  )
}
