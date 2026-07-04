import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from '@/components/layouts/MainLayout'
import EndpointsPage from '@/pages/EndpointsPage'
import EndpointDetailPage from '@/pages/EndpointDetailPage'
import AdminPage from '@/pages/AdminPage'
import NotFoundPage from '@/pages/NotFoundPage'
import ChangelogPage from '@/pages/ChangelogPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<EndpointsPage />} />
          <Route path="endpoints" element={<Navigate to="/" replace />} />
          <Route path="endpoints/:id" element={<EndpointDetailPage />} />
          <Route path="changelog" element={<ChangelogPage />} />
          <Route path="dev" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
