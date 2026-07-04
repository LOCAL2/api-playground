import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from '@/components/layouts/MainLayout'
import EndpointsPage from '@/pages/EndpointsPage'
import EndpointDetailPage from '@/pages/EndpointDetailPage'
import AdminPage from '@/pages/AdminPage'

/**
 * Root application component with routing configuration
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<EndpointsPage />} />
          <Route path="endpoints" element={<Navigate to="/" replace />} />
          <Route path="endpoints/:id" element={<EndpointDetailPage />} />
          {/* Admin — hidden path */}
          <Route path="dev" element={<AdminPage />} />
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
