import { Lock, Unlock, Info, AlertCircle } from 'lucide-react'
import { MethodBadge } from './MethodBadge'
import { StatusCodeBadge } from './StatusCodeBadge'
import { CopyButton } from './CopyButton'
import { buildFullUrl } from '@/utils/clipboard'
import type { ApiEndpoint } from '@/types'
import { cn } from '@/utils/cn'

interface EndpointDetailProps {
  endpoint: ApiEndpoint
}

/** Section wrapper for consistent styling */
function Section({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn('space-y-3', className)} aria-labelledby={`section-${title.replace(/\s+/g, '-').toLowerCase()}`}>
      <h2
        id={`section-${title.replace(/\s+/g, '-').toLowerCase()}`}
        className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
      >
        {title}
      </h2>
      {children}
    </section>
  )
}

/** Table for displaying parameter lists */
function ParamTable({ headers, rows }: { headers: string[]; rows: (string | React.ReactNode)[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
            {headers.map(h => (
              <th key={h} className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {rows.map((row, i) => (
            <tr key={i} className="bg-white dark:bg-zinc-900">
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2.5 text-zinc-700 dark:text-zinc-300">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/**
 * Full detail view of a single API endpoint
 * Displays all endpoint information needed to call it with Postman
 */
export function EndpointDetail({ endpoint }: EndpointDetailProps) {
  const fullUrl = buildFullUrl(endpoint.baseUrl, endpoint.path)

  return (
    <article className="space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <MethodBadge method={endpoint.method} size="lg" />
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {endpoint.name}
          </h1>
          <span
            className={cn(
              'ml-auto flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium',
              endpoint.requiresAuth
                ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
                : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
            )}
          >
            {endpoint.requiresAuth ? (
              <><Lock className="h-3.5 w-3.5" aria-hidden="true" /> Requires Auth</>
            ) : (
              <><Unlock className="h-3.5 w-3.5" aria-hidden="true" /> Public</>
            )}
          </span>
        </div>
        <p className="text-base text-zinc-600 dark:text-zinc-400">{endpoint.description}</p>
      </div>

      {/* Endpoint URL */}
      <Section title="Endpoint URL">
        <div className="space-y-2">
          <div>
            <p className="mb-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">Base URL</p>
            <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900">
              <code className="flex-1 font-mono text-sm text-zinc-600 dark:text-zinc-400">{endpoint.baseUrl}</code>
              <CopyButton text={endpoint.baseUrl} />
            </div>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">Path</p>
            <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900">
              <code className="flex-1 font-mono text-sm text-zinc-600 dark:text-zinc-400">{endpoint.path}</code>
              <CopyButton text={endpoint.path} />
            </div>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">Full URL</p>
            <div className="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800">
              <code className="flex-1 break-all font-mono text-sm font-medium text-zinc-900 dark:text-zinc-100">{fullUrl}</code>
              <CopyButton text={fullUrl} label="Copy URL" size="md" />
            </div>
          </div>
        </div>
      </Section>

      {/* Path Parameters */}
      {endpoint.pathParameters && endpoint.pathParameters.length > 0 && (
        <Section title="Path Parameters">
          <ParamTable
            headers={['Parameter', 'Type', 'Required', 'Description']}
            rows={endpoint.pathParameters.map(p => [
              <code key={p.name} className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs dark:bg-zinc-800">:{p.name}</code>,
              <span key="type" className="font-mono text-xs text-zinc-500">{p.type}</span>,
              <span key="req" className={p.required ? 'font-medium text-red-600 dark:text-red-400' : 'text-zinc-400'}>
                {p.required ? 'Yes' : 'No'}
              </span>,
              p.description,
            ])}
          />
        </Section>
      )}

      {/* Query Parameters */}
      {endpoint.queryParameters && endpoint.queryParameters.length > 0 && (
        <Section title="Query Parameters">
          <ParamTable
            headers={['Parameter', 'Type', 'Required', 'Description', 'Example']}
            rows={endpoint.queryParameters.map(p => [
              <code key={p.name} className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs dark:bg-zinc-800">{p.name}</code>,
              <span key="type" className="font-mono text-xs text-zinc-500">{p.type}</span>,
              <span key="req" className={p.required ? 'font-medium text-red-600 dark:text-red-400' : 'text-zinc-400'}>
                {p.required ? 'Yes' : 'No'}
              </span>,
              p.description,
              p.example ? (
                <code key="ex" className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs dark:bg-zinc-800">{p.example}</code>
              ) : '—',
            ])}
          />
        </Section>
      )}

      {/* Required Headers */}
      {endpoint.requiredHeaders && endpoint.requiredHeaders.length > 0 && (
        <Section title="Required Headers">
          <div className="space-y-2">
            {endpoint.requiredHeaders.map(header => (
              <div
                key={header.name}
                className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-900"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{header.name}</code>
                    <span className="text-zinc-400 dark:text-zinc-600">:</span>
                    <code className="text-sm text-zinc-600 dark:text-zinc-400">{header.value}</code>
                  </div>
                  <p className="mt-0.5 text-xs text-zinc-500">{header.description}</p>
                </div>
                <CopyButton text={`${header.name}: ${header.value}`} label="Copy" size="md" />
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Request Body */}
      {endpoint.requestBody && (
        <Section title="Request Body">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">Content-Type:</span>
              <code className="rounded bg-zinc-100 px-2 py-0.5 font-mono text-xs dark:bg-zinc-800">
                {endpoint.requestBody.contentType}
              </code>
              <CopyButton text={endpoint.requestBody.contentType} />
            </div>

            <ParamTable
              headers={['Field', 'Type', 'Required', 'Description', 'Example']}
              rows={endpoint.requestBody.fields.map(f => [
                <code key={f.name} className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs dark:bg-zinc-800">{f.name}</code>,
                <span key="type" className="font-mono text-xs text-zinc-500">{f.type}</span>,
                <span key="req" className={f.required ? 'font-medium text-red-600 dark:text-red-400' : 'text-zinc-400'}>
                  {f.required ? 'Yes' : 'No'}
                </span>,
                f.description,
                f.example ? (
                  <div key="ex" className="flex items-center gap-1">
                    <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs dark:bg-zinc-800">{f.example}</code>
                    <CopyButton text={f.example} />
                  </div>
                ) : '—',
              ])}
            />

            {endpoint.requestBody.note && (
              <div className="flex items-start gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-700 dark:bg-blue-950/30 dark:text-blue-400">
                <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{endpoint.requestBody.note}</span>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Authorization */}
      {endpoint.requiresAuth && (
        <Section title="Authorization">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800/50 dark:bg-amber-950/20">
            <div className="flex items-start gap-3">
              <Lock className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
              <div className="space-y-1 text-sm">
                <p className="font-medium text-amber-800 dark:text-amber-300">Authentication Required</p>
                <p className="text-amber-700 dark:text-amber-400">
                  {endpoint.authNote ?? 'Include a valid JWT token in the Authorization header.'}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <code className="rounded bg-amber-100 px-2 py-0.5 font-mono text-xs dark:bg-amber-900/50">
                    Authorization: Bearer {'<your-token>'}
                  </code>
                  <CopyButton text="Authorization: Bearer <your-token>" />
                </div>
              </div>
            </div>
          </div>
        </Section>
      )}

      {/* Status Codes */}
      <Section title="Status Codes">
        <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Code</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Meaning</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {endpoint.statusCodes.map(sc => (
                <tr key={sc.code} className="bg-white dark:bg-zinc-900">
                  <td className="px-3 py-2.5">
                    <StatusCodeBadge code={sc.code} />
                  </td>
                  <td className="px-3 py-2.5 font-medium text-zinc-700 dark:text-zinc-300">{sc.meaning}</td>
                  <td className="px-3 py-2.5 text-zinc-500 dark:text-zinc-400">{sc.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Notes */}
      {endpoint.notes && endpoint.notes.length > 0 && (
        <Section title="Notes">
          <div className="space-y-2">
            {endpoint.notes.map((note, i) => (
              <div
                key={i}
                className="flex items-start gap-2 rounded-lg bg-zinc-50 p-3 text-sm text-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-300"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                <span>{note}</span>
              </div>
            ))}
          </div>
        </Section>
      )}
    </article>
  )
}
