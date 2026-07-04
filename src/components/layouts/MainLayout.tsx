import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

export function MainLayout() {
  const { pathname } = useLocation()
  const hideSidebar = pathname === '/dev'

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="flex gap-6">
          {!hideSidebar && (
            <div className="hidden w-52 shrink-0 lg:block">
              <div className="sticky top-20 rounded-xl border border-zinc-200 bg-white py-2 shadow-sm dark:border-zinc-700/60 dark:bg-zinc-900">
                <Sidebar />
              </div>
            </div>
          )}
          <main id="main-content" className="min-w-0 flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
