import { Link } from 'react-router-dom'
import {
  Users, Lock, Package, ShoppingCart, Tag, FileText,
  MessageSquare, CheckSquare, Trophy, Film, BookOpen,
  Globe, LayoutDashboard, ArrowRight,
} from 'lucide-react'
import { categories } from '@/data/categories'
import { allEndpoints } from '@/data/endpoints'
import { Breadcrumb } from '@/components/Breadcrumb'
import type { ApiCategory } from '@/types'

// Icon mapping
const iconMap: Record<string, React.ElementType> = {
  Users, Lock, Package, ShoppingCart, Tag, FileText,
  MessageSquare, CheckSquare, Trophy, Film, BookOpen,
  Globe, LayoutDashboard,
}

// Color mapping to Tailwind classes
const colorMap: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  blue: { bg: 'bg-blue-50 dark:bg-blue-950/30', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-100 dark:border-blue-900/50', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400' },
  amber: { bg: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-100 dark:border-amber-900/50', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400' },
  green: { bg: 'bg-green-50 dark:bg-green-950/30', text: 'text-green-700 dark:text-green-400', border: 'border-green-100 dark:border-green-900/50', badge: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400' },
  orange: { bg: 'bg-orange-50 dark:bg-orange-950/30', text: 'text-orange-700 dark:text-orange-400', border: 'border-orange-100 dark:border-orange-900/50', badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400' },
  purple: { bg: 'bg-purple-50 dark:bg-purple-950/30', text: 'text-purple-700 dark:text-purple-400', border: 'border-purple-100 dark:border-purple-900/50', badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400' },
  pink: { bg: 'bg-pink-50 dark:bg-pink-950/30', text: 'text-pink-700 dark:text-pink-400', border: 'border-pink-100 dark:border-pink-900/50', badge: 'bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-400' },
  indigo: { bg: 'bg-indigo-50 dark:bg-indigo-950/30', text: 'text-indigo-700 dark:text-indigo-400', border: 'border-indigo-100 dark:border-indigo-900/50', badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400' },
  teal: { bg: 'bg-teal-50 dark:bg-teal-950/30', text: 'text-teal-700 dark:text-teal-400', border: 'border-teal-100 dark:border-teal-900/50', badge: 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-400' },
  yellow: { bg: 'bg-yellow-50 dark:bg-yellow-950/30', text: 'text-yellow-700 dark:text-yellow-400', border: 'border-yellow-100 dark:border-yellow-900/50', badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400' },
  red: { bg: 'bg-red-50 dark:bg-red-950/30', text: 'text-red-700 dark:text-red-400', border: 'border-red-100 dark:border-red-900/50', badge: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400' },
  cyan: { bg: 'bg-cyan-50 dark:bg-cyan-950/30', text: 'text-cyan-700 dark:text-cyan-400', border: 'border-cyan-100 dark:border-cyan-900/50', badge: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-400' },
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-100 dark:border-emerald-900/50', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400' },
  violet: { bg: 'bg-violet-50 dark:bg-violet-950/30', text: 'text-violet-700 dark:text-violet-400', border: 'border-violet-100 dark:border-violet-900/50', badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-400' },
}

/**
 * Categories overview page showing all API categories as cards
 */
export default function CategoriesPage() {
  // Count endpoints per category
  const counts = allEndpoints.reduce<Partial<Record<ApiCategory, number>>>((acc, ep) => {
    acc[ep.category] = (acc[ep.category] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Categories' }]} className="mb-6" />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">API Categories</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {categories.length} categories covering {allEndpoints.length} endpoints
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map(category => {
          const Icon = iconMap[category.icon] ?? Tag
          const colors = colorMap[category.color] ?? colorMap.blue
          const count = counts[category.name] ?? 0

          return (
            <Link
              key={category.name}
              to={`/endpoints?category=${encodeURIComponent(category.name)}`}
              className="group flex flex-col gap-3 rounded-xl border bg-white p-5 transition-all hover:shadow-sm dark:bg-zinc-900 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
            >
              <div className="flex items-start justify-between">
                <div className={`inline-flex rounded-lg border p-2.5 ${colors.bg} ${colors.border}`}>
                  <Icon className={`h-5 w-5 ${colors.text}`} aria-hidden="true" />
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors.badge}`}>
                  {count} endpoint{count !== 1 ? 's' : ''}
                </span>
              </div>

              <div>
                <h2 className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-700 dark:group-hover:text-zinc-300">
                  {category.name}
                </h2>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{category.description}</p>
              </div>

              <div className={`mt-auto flex items-center gap-1 text-xs font-medium ${colors.text}`}>
                View endpoints
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
