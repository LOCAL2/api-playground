import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MainLayout } from '@/components/layouts/MainLayout'
import HomePage from '@/pages/HomePage'
import EndpointsPage from '@/pages/EndpointsPage'
import EndpointDetailPage from '@/pages/EndpointDetailPage'
import CategoriesPage from '@/pages/CategoriesPage'

/**
 * Root application component with routing configuration
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="endpoints" element={<EndpointsPage />} />
          <Route path="endpoints/:id" element={<EndpointDetailPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          {/* 404 fallback */}
          <Route
            path="*"
            element={
              <div className="mx-auto max-w-xl px-4 py-20 text-center">
                <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">404</h1>
                <p className="mt-2 text-zinc-500 dark:text-zinc-400">Page not found</p>
              </div>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
