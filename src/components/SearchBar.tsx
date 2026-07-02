import { Search, X } from 'lucide-react'
import { cn } from '@/utils/cn'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

/**
 * Search input component with clear button
 */
export function SearchBar({ value, onChange, placeholder = 'Search endpoints...', className }: SearchBarProps) {
  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full rounded-lg border bg-white py-2 pl-9 pr-9 text-sm transition-colors',
          'border-zinc-200 text-zinc-900 placeholder-zinc-400',
          'focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200',
          'dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500',
          'dark:focus:border-zinc-500 dark:focus:ring-zinc-800',
        )}
        aria-label="Search API endpoints"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
