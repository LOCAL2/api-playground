import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { Users, Package, FileText, GraduationCap, LayoutList, Film, BookOpen, Globe, CheckSquare, ChefHat, PawPrint, GitCommitHorizontal } from 'lucide-react'
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

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation()
  const [searchParams] = useSearchParams()

  const isOnRoot = location.pathname === '/'
  const activeCategory = searchParams.get('category')
  const isAllActive = isOnRoot && !activeCategory
  const isChangelog = location.pathname === '/changelog'

  return (
    <aside
      className={cn('flex h-full flex-col gap-1 overflow-y-auto px-2 py-3', className)}
      aria-label="Category navigation"
    >
      {/* ── All Endpoints ── */}
      <Link
        to="/"
        className={cn(
          'group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
          isAllActive
            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
            : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
        )}
        aria-current={isAllActive ? 'page' : undefined}
      >
        <LayoutList className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>All Endpoints</span>
      </Link>

      {/* ── Changelog ── */}
      <Link
        to="/changelog"
        className={cn(
          'group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
          isChangelog
            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
            : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
        )}
        aria-current={isChangelog ? 'page' : undefined}
      >
        <GitCommitHorizontal className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>Changelog</span>
        <span className="ml-auto rounded-full bg-emerald-500 h-1.5 w-1.5" />
      </Link>

      {/* ── divider ── */}
      <div className="my-1 h-px bg-zinc-100 dark:bg-zinc-800" />

      {/* ── Categories label ── */}
      <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
        Categories
      </p>

      {/* ── Category links ── */}
      {categories.map(cat => {
        const Icon = categoryIcons[cat.name]
        const isActive = isOnRoot && activeCategory === cat.name

        return (
          <Link
            key={cat.name}
            to={`/?category=${encodeURIComponent(cat.name)}`}
            className={cn(
              'group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
              isActive
                ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
                : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-200'
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            {isActive && (
              <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-zinc-400 dark:bg-zinc-400" />
            )}
            {Icon && (
              <Icon className={cn('h-4 w-4 shrink-0 transition-colors', isActive ? 'text-zinc-700 dark:text-zinc-200' : 'text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-300')} aria-hidden="true" />
            )}
            <span className={cat.name === 'Students' ? 'flex-1' : 'flex-1 truncate'}>
              {cat.name}
            </span>
            {cat.name === 'Students' && (
              <span className="shrink-0 rounded-full bg-blue-500 px-1.5 py-0.5 text-[9px] font-bold text-white">TNK</span>
            )}
          </Link>
        )
      })}
    </aside>
  )
}
