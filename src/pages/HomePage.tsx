import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Code2, Layers, Search } from 'lucide-react'
import { allEndpoints } from '@/data/endpoints'
import { categories } from '@/data/categories'

const methodColors: Record<string, string> = {
  GET: 'text-emerald-600 dark:text-emerald-400',
  POST: 'text-blue-600 dark:text-blue-400',
  PUT: 'text-amber-600 dark:text-amber-400',
  PATCH: 'text-purple-600 dark:text-purple-400',
  DELETE: 'text-red-600 dark:text-red-400',
}

/**
 * Home / landing page for the API Playground
 */
export default function HomePage() {
  const totalEndpoints = allEndpoints.length
  const totalCategories = categories.length

  // Count by method
  const methodCounts = allEndpoints.reduce<Record<string, number>>((acc, ep) => {
    acc[ep.method] = (acc[ep.method] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {/* Hero */}
      <section className="mb-16 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
          <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
          API Reference for Web API &amp; REST API Course
        </div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
          API Playground
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          A comprehensive reference catalog of REST API endpoints for learning and teaching.
          Browse endpoints, understand request structures, and practice with Postman.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/endpoints"
            className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Browse Endpoints
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <Layers className="h-4 w-4" aria-hidden="true" />
            View Categories
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="mb-16" aria-label="Statistics">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Total Endpoints</p>
            <p className="mt-1 text-3xl font-bold text-zinc-900 dark:text-zinc-100">{totalEndpoints}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Categories</p>
            <p className="mt-1 text-3xl font-bold text-zinc-900 dark:text-zinc-100">{totalCategories}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 sm:col-span-2">
            <p className="mb-3 text-sm text-zinc-500 dark:text-zinc-400">By HTTP Method</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {Object.entries(methodCounts).map(([method, count]) => (
                <div key={method} className="flex items-center gap-2">
                  <span className={`font-mono text-sm font-semibold ${methodColors[method] ?? ''}`}>{method}</span>
                  <span className="text-sm text-zinc-500">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mb-16" aria-label="Features">
        <h2 className="mb-8 text-center text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          What's in this reference
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Code2,
              title: 'Endpoint Documentation',
              desc: 'Full details for every endpoint: method, URL, parameters, headers, and request body structure.',
            },
            {
              icon: Search,
              title: 'Search & Filter',
              desc: 'Quickly find endpoints by name, path, category, or HTTP method with instant search.',
            },
            {
              icon: Layers,
              title: '13 API Categories',
              desc: 'Organized into logical categories: Users, Auth, Products, Orders, Posts, and more.',
            },
          ].map(feature => (
            <div
              key={feature.title}
              className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="mb-3 inline-flex rounded-lg bg-zinc-100 p-2 dark:bg-zinc-800">
                <feature.icon className="h-5 w-5 text-zinc-700 dark:text-zinc-300" aria-hidden="true" />
              </div>
              <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-100">{feature.title}</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Postman note */}
      <section className="rounded-xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-900/50 dark:bg-blue-950/20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <h2 className="font-semibold text-blue-900 dark:text-blue-300">Ready to test these APIs?</h2>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
              This site is an API reference only — no interactive testing here. Use Postman or your preferred API client
              to send real requests and explore the responses yourself.
            </p>
          </div>
          <a
            href="https://www.postman.com/downloads/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Download Postman
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </section>
    </div>
  )
}
