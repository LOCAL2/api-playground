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
    </div>
  )
}
