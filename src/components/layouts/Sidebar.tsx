import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { Users, Package, FileText, GraduationCap, LayoutList, Film, BookOpen, Globe, CheckSquare, ChefHat, PawPrint } from 'lucide-react'
import { allEndpoints } from '@/data/endpoints'
import { categories } from '@/data/categories'
import { cn } from '@/utils/cn'
import type { ApiCategory } from '@/types'

const categoryIcons: Record<ApiCategory, React.ElementType> = {
  Users: Users,
  Posts: FileText,
  Products: Package,
  Students: GraduationCap,
  Movies: Film,
  Books: BookOpen,
  Countries: Globe,
  Todos: CheckSquare,
  Recipes: ChefHat,
  Animals: PawPrint,
}

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

const activeClass = 'bg-zinc-200/80 text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100'
const inactiveClass = 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-700/60 dark:hover:text-zinc-100'
const activeIconClass = 'bg-zinc-300/60 text-white dark:bg-zinc-600 dark:text-white'
const inactiveIconClass = 'bg-zinc-100 text-white group-hover:text-white dark:bg-zinc-700 dark:text-white dark:group-hover:text-white'
const activeBadgeClass = 'bg-zinc-300/60 text-zinc-700 dark:bg-zinc-600 dark:text-zinc-200'
const inactiveBadgeClass = 'bg-zinc-100 text-zinc-500 group-hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-400 dark:group-hover:bg-zinc-600'

export function Sidebar({ className }: SidebarProps) {
  const counts = getCountsByCategory()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  const isOnRoot = location.pathname === '/'
  const activeCategory = searchParams.get('category')
  const isAllActive = isOnRoot && !activeCategory

  return (
    <aside
      className={cn('flex h-full flex-col overflow-y-auto p-3', className)}
      aria-label="Category navigation"
    >
      {/* ── Overview ── */}
      <div className="mb-3 rounded-xl border border-zinc-200 bg-white p-2 shadow-sm dark:border-zinc-700/60 dark:bg-zinc-800/60">
        <p className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          Overview
        </p>
        <Link
          to="/"
          className={cn('flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-all', isAllActive ? activeClass : inactiveClass)}
          aria-current={isAllActive ? 'page' : undefined}
        >
          <div className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-md', isAllActive ? activeIconClass : inactiveIconClass)}>
            <LayoutList className="h-3.5 w-3.5" aria-hidden="true" />
          </div>
          <span className="flex-1">All Endpoints</span>
          <span className={cn('rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums', isAllActive ? activeBadgeClass : inactiveBadgeClass)}>
            {allEndpoints.length}
          </span>
        </Link>
      </div>

      {/* ── Categories ── */}
      <div className="rounded-xl border border-zinc-200 bg-white p-2 shadow-sm dark:border-zinc-700/60 dark:bg-zinc-800/60">
        <p className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          Categories
        </p>
        <nav className="flex flex-col gap-0.5">
          {categories.map(cat => {
            const Icon = categoryIcons[cat.name]
            const count = counts[cat.name] ?? 0
            const isActive = isOnRoot && activeCategory === cat.name

            return (
              <Link
                key={cat.name}
                to={`/?category=${encodeURIComponent(cat.name)}`}
                className={cn('group flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-all', isActive ? activeClass : inactiveClass)}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors', isActive ? activeIconClass : inactiveIconClass)}>
                  {Icon && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
                </div>
                <span className="flex-1 truncate">{cat.name}</span>
                {cat.name === 'Students' && (
                  <span className="rounded-full bg-blue-500 px-1.5 py-0.5 text-[10px] font-bold text-white">TNK</span>
                )}
                {count > 0 && (
                  <span className={cn('rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums transition-colors', isActive ? activeBadgeClass : inactiveBadgeClass)}>
                    {count}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
