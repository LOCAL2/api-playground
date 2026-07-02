import { Link, useLocation, useSearchParams } from 'react-router-dom'
import {
  Users, Lock, Package, ShoppingCart, Tag, FileText,
  MessageSquare, CheckSquare, Trophy, Film, BookOpen,
  Globe, LayoutDashboard, LayoutList,
} from 'lucide-react'
import { allEndpoints } from '@/data/endpoints'
import { cn } from '@/utils/cn'
import type { ApiCategory } from '@/types'

// Icon mapping for each category
const categoryIcons: Record<ApiCategory, React.ElementType> = {
  Users: Users,
  Authentication: Lock,
  Products: Package,
  Orders: ShoppingCart,
  Categories: Tag,
  Posts: FileText,
  Comments: MessageSquare,
  Todos: CheckSquare,
  Sports: Trophy,
  Movies: Film,
  Books: BookOpen,
  Countries: Globe,
  Dashboard: LayoutDashboard,
}

// Get endpoint counts per category
function getCountsByCategory() {
  const counts: Partial<Record<ApiCategory, number>> = {}
  for (const ep of allEndpoints) {
    counts[ep.category] = (counts[ep.category] ?? 0) + 1
  }
  return counts
}

interface SidebarProps {
  className?: string
}

/**
 * Sidebar navigation listing all API categories with endpoint counts
 */
export function Sidebar({ className }: SidebarProps) {
  const counts = getCountsByCategory()
  const categories = Object.keys(categoryIcons) as ApiCategory[]
  const location = useLocation()
  const [searchParams] = useSearchParams()

  // Active state helpers
  const isOnEndpoints = location.pathname === '/endpoints'
  const activeCategory = searchParams.get('category')
  const isAllActive = isOnEndpoints && !activeCategory

  return (
    <aside
      className={cn(
        'flex h-full flex-col gap-1 overflow-y-auto py-4',
        className
      )}
      aria-label="Category navigation"
    >
      <div className="mb-2 px-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Categories
        </p>
      </div>

      {/* All Endpoints link */}
      <Link
        to="/endpoints"
        className={cn(
          'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors',
          isAllActive
            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
            : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
        )}
        aria-current={isAllActive ? 'page' : undefined}
      >
        <LayoutList className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="flex-1">All Endpoints</span>
        <span className="rounded-full bg-zinc-200 px-1.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
          {allEndpoints.length}
        </span>
      </Link>

      <div className="my-1 border-t border-zinc-100 dark:border-zinc-800" />

      {/* Category links */}
      {categories.map(category => {
        const Icon = categoryIcons[category]
        const count = counts[category] ?? 0
        const isActive = isOnEndpoints && activeCategory === category

        return (
          <Link
            key={category}
            to={`/endpoints?category=${encodeURIComponent(category)}`}
            className={cn(
              'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors',
              isActive
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="flex-1 truncate">{category}</span>
            {count > 0 && (
              <span className="rounded-full bg-zinc-200 px-1.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
                {count}
              </span>
            )}
          </Link>
        )
      })}
    </aside>
  )
}
