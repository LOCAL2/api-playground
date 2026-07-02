import { BookOpen, Code2, GraduationCap, Layers, Terminal } from 'lucide-react'
import { Breadcrumb } from '@/components/Breadcrumb'
import { allEndpoints } from '@/data/endpoints'
import { categories } from '@/data/categories'

/**
 * About page describing the purpose and usage of API Playground
 */
export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'About' }]} className="mb-6" />

      <div className="space-y-8">
        {/* Header */}
        <section>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 dark:bg-zinc-100">
              <Code2 className="h-5 w-5 text-white dark:text-zinc-900" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">About API Playground</h1>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400">
            API Playground is an API Reference catalog designed for students and instructors in Web API
            and REST API courses. It provides clear, structured documentation for REST endpoints to
            help learners understand how to construct and send HTTP requests.
          </p>
        </section>

        {/* Purpose */}
        <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            <GraduationCap className="h-5 w-5" aria-hidden="true" />
            Purpose
          </h2>
          <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
            <p>
              This site serves as an <strong className="text-zinc-900 dark:text-zinc-100">API Endpoint Catalog</strong> —
              a reference document, not an interactive testing tool. It shows you the structure and
              requirements of each API endpoint, so you know exactly what to configure in your API client.
            </p>
            <p>
              Students are expected to use <strong className="text-zinc-900 dark:text-zinc-100">Postman</strong> or
              another API client to actually send requests, inspect responses, and learn from real HTTP
              interactions.
            </p>
          </div>
        </section>

        {/* What you'll find */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            <Layers className="h-5 w-5" aria-hidden="true" />
            What Each Endpoint Shows
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              'Endpoint name and description',
              'HTTP Method (GET, POST, PUT, PATCH, DELETE)',
              'Base URL and endpoint path',
              'Full URL for copy-paste',
              'Path and query parameters',
              'Required request headers',
              'Request body fields and types',
              'Content-Type requirements',
              'Authorization requirements',
              'HTTP status codes and meanings',
              'Additional notes and constraints',
            ].map(item => (
              <div key={item} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400 dark:bg-zinc-600" />
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* What's NOT included */}
        <section className="rounded-xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/30 dark:bg-amber-950/20">
          <h2 className="mb-3 text-base font-semibold text-amber-900 dark:text-amber-300">
            What's intentionally NOT included
          </h2>
          <div className="space-y-1.5 text-sm text-amber-800 dark:text-amber-400">
            {[
              'Response JSON examples or sample output data',
              'Interactive API testing console',
              'Try It / Execute Request buttons',
              'Swagger UI or embedded Postman',
              'Live API calls from the browser',
            ].map(item => (
              <div key={item} className="flex items-center gap-2">
                <span className="text-amber-500">✕</span>
                {item}
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-amber-700 dark:text-amber-500">
            These are excluded intentionally. The goal is to encourage students to build hands-on
            experience by testing APIs themselves using proper tools.
          </p>
        </section>

        {/* How to use */}
        <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            <Terminal className="h-5 w-5" aria-hidden="true" />
            How to Use This Reference
          </h2>
          <ol className="space-y-3">
            {[
              { step: '1', text: 'Browse endpoints by category using the sidebar or the Categories page.' },
              { step: '2', text: 'Click on any endpoint card to view its full documentation.' },
              { step: '3', text: 'Copy the full URL, headers, and request body fields you need.' },
              { step: '4', text: 'Open Postman and create a new request with the copied details.' },
              { step: '5', text: 'Send the request and study the response to understand the API behavior.' },
            ].map(item => (
              <li key={item.step} className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
                  {item.step}
                </span>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">{item.text}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Stats */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            <BookOpen className="h-5 w-5" aria-hidden="true" />
            Reference Statistics
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{allEndpoints.length}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Total Endpoints</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{categories.length}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Categories</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">5</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">HTTP Methods</p>
            </div>
          </div>
        </section>

        {/* Tech stack */}
        <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-3 text-base font-semibold text-zinc-900 dark:text-zinc-100">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {['Vite', 'Bun', 'React', 'TypeScript', 'React Router', 'Tailwind CSS', 'Lucide Icons'].map(tech => (
              <span
                key={tech}
                className="rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
