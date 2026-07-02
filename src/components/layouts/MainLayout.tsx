import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'

/**
 * Main layout wrapper with top navigation bar
 */
export function MainLayout() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navbar />
      <main id="main-content">
        <Outlet />
      </main>
      <footer className="mt-16 border-t border-zinc-200 py-8 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-zinc-500 dark:text-zinc-500 sm:px-6">
          <p>API Playground — API Reference for Web API &amp; REST API Course</p>
          <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-600">
            Use Postman or your preferred API client to test endpoints
          </p>
        </div>
      </footer>
    </div>
  )
}
