import { useState, useEffect } from 'react'
import { GitCommitHorizontal, ExternalLink, RefreshCw, Clock } from 'lucide-react'
import { cn } from '@/utils/cn'

const REPO = 'LOCAL2/api-playground'
const GITHUB_API = `https://api.github.com/repos/${REPO}/commits?per_page=30`

interface Commit {
  sha: string
  commit: {
    message: string
    author: { date: string; name: string }
  }
  author: { login: string; avatar_url: string; html_url: string } | null
  html_url: string
}

const TYPE_COLORS: Record<string, string> = {
  feat:     'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  fix:      'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  chore:    'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  refactor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
  docs:     'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  style:    'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-400',
  perf:     'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  remove:   'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
}

function parseCommit(message: string) {
  const match = message.match(/^(\w+)(\(.+?\))?:\s*(.+)/)
  if (match) return { type: match[1], scope: match[2]?.slice(1,-1), desc: match[3] }
  return { type: null, scope: null, desc: message.split('\n')[0] }
}

function formatRelative(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  const h = Math.floor(m / 60)
  const d = Math.floor(h / 24)
  if (m < 1) return 'เมื่อกี้'
  if (m < 60) return `${m} นาทีที่แล้ว`
  if (h < 24) return `${h} ชั่วโมงที่แล้ว`
  if (d < 7) return `${d} วันที่แล้ว`
  return new Date(dateStr).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })
}

export default function ChangelogPage() {
  const [commits, setCommits] = useState<Commit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastFetched, setLastFetched] = useState<Date | null>(null)

  async function fetchCommits() {
    setLoading(true); setError(null)
    try {
      const r = await fetch(GITHUB_API, { headers: { Accept: 'application/vnd.github.v3+json' } })
      if (!r.ok) throw new Error(`GitHub API error: ${r.status}`)
      const data = await r.json()
      setCommits(data)
      setLastFetched(new Date())
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCommits() }, [])

  // auto-refresh ทุก 60 วินาที
  useEffect(() => {
    const id = setInterval(fetchCommits, 60000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="py-2">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Changelog</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            ประวัติการอัปเดตจาก{' '}
            <a href={`https://github.com/${REPO}`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-zinc-700 hover:underline dark:text-zinc-300">
              {REPO} <ExternalLink className="h-3 w-3" />
            </a>
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <button onClick={fetchCommits} disabled={loading}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs text-zinc-600 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800">
            <RefreshCw className={cn('h-3 w-3', loading && 'animate-spin')} />
            รีเฟรช
          </button>
          {lastFetched && (
            <span className="flex items-center gap-1 text-[10px] text-zinc-400 dark:text-zinc-600">
              <Clock className="h-2.5 w-2.5" />
              อัปเดต {formatRelative(lastFetched.toISOString())}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-800 dark:bg-red-950/20 dark:text-red-400">
          {error}
        </div>
      ) : loading && commits.length === 0 ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800/50" />
          ))}
        </div>
      ) : (
        <div className="relative">
          {/* timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-zinc-200 dark:bg-zinc-800" />

          <div className="space-y-1">
            {commits.map((commit, i) => {
              const { type, scope, desc } = parseCommit(commit.commit.message)
              const typeColor = TYPE_COLORS[type || ''] || TYPE_COLORS.chore
              const avatar = commit.author?.avatar_url
              const authorLogin = commit.author?.login || commit.commit.author.name
              const authorUrl = commit.author?.html_url || `https://github.com/${authorLogin}`
              const sha = commit.sha.slice(0, 7)
              const date = commit.commit.author.date

              return (
                <div key={commit.sha} className="relative flex gap-4 pb-1">
                  {/* avatar / dot on timeline */}
                  <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center">
                    {avatar ? (
                      <a href={authorUrl} target="_blank" rel="noopener noreferrer">
                        <img src={avatar} alt={authorLogin}
                          className="h-7 w-7 rounded-full border-2 border-white ring-1 ring-zinc-200 dark:border-zinc-950 dark:ring-zinc-700" />
                      </a>
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-700">
                        <GitCommitHorizontal className="h-3 w-3 text-zinc-500" />
                      </div>
                    )}
                  </div>

                  {/* card */}
                  <div className={cn('flex-1 rounded-xl border bg-white px-4 py-3 transition-colors dark:bg-zinc-900', i === 0 ? 'border-zinc-300 dark:border-zinc-600' : 'border-zinc-100 dark:border-zinc-800/60')}>
                    <div className="flex flex-wrap items-center gap-2">
                      {type && (
                        <span className={cn('rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide', typeColor)}>
                          {type}
                        </span>
                      )}
                      {scope && (
                        <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] font-mono text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                          {scope}
                        </span>
                      )}
                      {i === 0 && (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                          latest
                        </span>
                      )}
                      <span className="ml-auto text-[10px] text-zinc-400 dark:text-zinc-600">{formatRelative(date)}</span>
                    </div>

                    <p className="mt-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">{desc}</p>

                    <div className="mt-1.5 flex items-center gap-2">
                      <a href={authorUrl} target="_blank" rel="noopener noreferrer"
                        className="text-[11px] text-zinc-500 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300">
                        @{authorLogin}
                      </a>
                      <span className="text-zinc-200 dark:text-zinc-700">·</span>
                      <a href={commit.html_url} target="_blank" rel="noopener noreferrer"
                        className="font-mono text-[11px] text-zinc-400 hover:text-zinc-600 dark:text-zinc-600 dark:hover:text-zinc-400">
                        {sha}
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
