import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { EndpointDetail } from '@/components/EndpointDetail'
import { Breadcrumb } from '@/components/Breadcrumb'
import { allEndpoints } from '@/data/endpoints'

/**
 * Page showing full details of a single API endpoint
 */
export default function EndpointDetailPage() {
  const { id } = useParams<{ id: string }>()
  const endpoint = allEndpoints.find(ep => ep.id === id)

  if (!endpoint) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Endpoint not found</h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          The endpoint you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-900 hover:underline dark:text-zinc-100"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to endpoints
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <Breadcrumb
        items={[
          { label: 'API Endpoints', href: '/' },
          { label: endpoint.category, href: `/?category=${encodeURIComponent(endpoint.category)}` },
          { label: endpoint.name },
        ]}
        className="mb-6"
      />

      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to endpoints
      </Link>

      <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
        <EndpointDetail endpoint={endpoint} />
      </div>

      {/* Category navigation */}
      <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          More endpoints in{' '}
          <Link
            to={`/?category=${encodeURIComponent(endpoint.category)}`}
            className="font-medium text-zinc-900 hover:underline dark:text-zinc-100"
          >
            {endpoint.category}
          </Link>
        </p>
      </div>
    </div>
  )
}
