import { Link } from 'react-router-dom'
import { Code2 } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

/**
 * Top navigation bar
 */
export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-100">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 dark:bg-zinc-100">
            <Code2 className="h-4 w-4 text-white dark:text-zinc-900" aria-hidden="true" />
          </div>
          <span>API Playground</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
