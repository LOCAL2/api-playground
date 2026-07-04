import { useState, useEffect, useCallback } from 'react'
import { Shield, LogOut, RefreshCw, Trash2, Activity, Database, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react'
import { cn } from '@/utils/cn'

const BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || ''

const TABLE_LABELS: Record<string, string> = {
  users: 'Users (ผู้ใช้)',
  products: 'Products (สินค้า)',
  posts: 'Posts (บทความ)',
  students: 'Students (นักศึกษา)',
  movies: 'Movies (ภาพยนตร์)',
  books: 'Books (หนังสือ)',
  countries: 'Countries (ประเทศ)',
  todos: 'Todos (งาน)',
  recipes: 'Recipes (สูตรอาหาร)',
  animals: 'Animals (สัตว์)',
}

const METHOD_COLORS: Record<string, string> = {
  GET:    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  POST:   'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  PUT:    'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  PATCH:  'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
  DELETE: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
}

function formatThaiTime(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'medium', timeZone: 'Asia/Bangkok' })
  } catch { return iso }
}

export default function AdminPage() {
  const [token, setToken] = useState(() => sessionStorage.getItem('admin_token') || '')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  const [stats, setStats] = useState<any>(null)
  const [logs, setLogs] = useState<any[]>([])
  const [logPage, setLogPage] = useState(1)
  const [logTotal, setLogTotal] = useState(0)
  const [logFilter, setLogFilter] = useState({ method: '', table: '' })
  const [logsLoading, setLogsLoading] = useState(false)
  const [expandedLog, setExpandedLog] = useState<number | null>(null)
  const [resetLoading, setResetLoading] = useState<string | null>(null)
  const [resetConfirm, setResetConfirm] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const authHeader = { Authorization: `Bearer ${token}` }

  const fetchStats = useCallback(async () => {
    if (!token) return
    const r = await fetch(`${BASE_URL}/api/admin/stats`, { headers: authHeader })
    if (r.ok) { const d = await r.json(); setStats(d.data) }
  }, [token])

  const fetchLogs = useCallback(async () => {
    if (!token) return
    setLogsLoading(true)
    const params = new URLSearchParams({ page: String(logPage), limit: '20' })
    if (logFilter.method) params.set('method', logFilter.method)
    if (logFilter.table)  params.set('table', logFilter.table)
    const r = await fetch(`${BASE_URL}/api/admin/logs?${params}`, { headers: authHeader })
    if (r.ok) {
      const d = await r.json()
      setLogs(d.data.data || [])
      setLogTotal(d.data.pagination?.total || 0)
    }
    setLogsLoading(false)
  }, [token, logPage, logFilter])

  useEffect(() => { if (token) { fetchStats(); fetchLogs() } }, [token, fetchStats, fetchLogs])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginLoading(true); setLoginError('')
    const r = await fetch(`${BASE_URL}/api/admin/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    const d = await r.json()
    if (r.ok) { sessionStorage.setItem('admin_token', d.data.token); setToken(d.data.token) }
    else setLoginError(d.error?.message || 'รหัสผ่านไม่ถูกต้อง')
    setLoginLoading(false)
  }

  async function handleClearLogs() {
    await fetch(`${BASE_URL}/api/admin/logs`, { method: 'DELETE', headers: authHeader })
    setLogs([]); setLogTotal(0)
    showToast('ล้าง log ทั้งหมดแล้ว')
    fetchStats()
  }

  async function handleReset(table: string) {
    setResetLoading(table)
    const r = await fetch(`${BASE_URL}/api/admin/reset/${table}`, { method: 'POST', headers: authHeader })
    const d = await r.json()
    if (r.ok) showToast(`Reset ${TABLE_LABELS[table]} สำเร็จแล้ว`)
    else showToast(d.error?.message || 'เกิดข้อผิดพลาด', 'error')
    setResetLoading(null); setResetConfirm(null); fetchStats()
  }

  function handleLogout() { sessionStorage.removeItem('admin_token'); setToken(''); setStats(null); setLogs([]) }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800">
              <Shield className="h-7 w-7 text-zinc-300" />
            </div>
            <h1 className="text-xl font-bold text-zinc-100">Admin Panel</h1>
            <p className="text-sm text-zinc-500">ป้อนรหัสผ่านเพื่อเข้าใช้งาน</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password" placeholder="รหัสผ่าน" value={password}
              onChange={e => setPassword(e.target.value)} autoFocus
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 placeholder-zinc-600 outline-none focus:border-zinc-500"
            />
            {loginError && <p className="text-sm text-red-400">{loginError}</p>}
            <button type="submit" disabled={loginLoading}
              className="w-full rounded-xl bg-zinc-100 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-white disabled:opacity-50">
              {loginLoading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Toast */}
      {toast && (
        <div className={cn('fixed right-4 top-4 z-50 rounded-xl px-4 py-3 text-sm font-medium shadow-lg transition-all', toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white')}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-zinc-500" />
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">Admin Panel</span>
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800">ลับ</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
            <LogOut className="h-4 w-4" /> ออกจากระบบ
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8">
        {/* Stats */}
        {stats && (
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-zinc-700 dark:text-zinc-300">
              <Database className="h-4 w-4" /> ข้อมูลในระบบ
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {Object.entries(stats.rowCounts || {}).map(([table, count]) => (
                <div key={table} className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                  <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{count as number}</p>
                  <p className="mt-0.5 text-xs text-zinc-500">{TABLE_LABELS[table] || table}</p>
                </div>
              ))}
              <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stats.totalLogs}</p>
                <p className="mt-0.5 text-xs text-zinc-500">Log ทั้งหมด</p>
              </div>
            </div>
          </section>
        )}

        {/* Reset per table */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-zinc-700 dark:text-zinc-300">
            <RefreshCw className="h-4 w-4" /> Reset ข้อมูลรายตาราง
          </h2>
          <p className="mb-4 text-sm text-zinc-500">คืนข้อมูลกลับเป็นค่าเริ่มต้น (seed data) สำหรับตารางที่เลือก</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {Object.entries(TABLE_LABELS).map(([table, label]) => (
              <div key={table} className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="mb-2 text-xs font-medium text-zinc-700 dark:text-zinc-300">{label}</p>
                {resetConfirm === table ? (
                  <div className="space-y-1.5">
                    <p className="text-xs text-red-500">ยืนยัน reset?</p>
                    <div className="flex gap-1">
                      <button onClick={() => handleReset(table)} disabled={resetLoading === table}
                        className="flex-1 rounded-lg bg-red-600 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50">
                        {resetLoading === table ? '...' : 'ใช่'}
                      </button>
                      <button onClick={() => setResetConfirm(null)} className="flex-1 rounded-lg bg-zinc-100 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300">
                        ไม่
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setResetConfirm(table)}
                    className="flex w-full items-center justify-center gap-1 rounded-lg border border-zinc-200 py-1.5 text-xs font-medium text-zinc-600 hover:border-red-300 hover:text-red-600 dark:border-zinc-700 dark:text-zinc-400 dark:hover:text-red-400">
                    <RefreshCw className="h-3 w-3" /> Reset
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Activity Log */}
        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-base font-semibold text-zinc-700 dark:text-zinc-300">
              <Activity className="h-4 w-4" /> บันทึกกิจกรรม
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-normal text-zinc-500 dark:bg-zinc-800">{logTotal} รายการ</span>
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <select value={logFilter.method} onChange={e => { setLogFilter(f => ({...f, method: e.target.value})); setLogPage(1) }}
                className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                <option value="">ทุก Method</option>
                {['POST','PUT','PATCH','DELETE'].map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select value={logFilter.table} onChange={e => { setLogFilter(f => ({...f, table: e.target.value})); setLogPage(1) }}
                className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                <option value="">ทุกตาราง</option>
                {Object.keys(TABLE_LABELS).map(t => <option key={t} value={t}>{TABLE_LABELS[t]}</option>)}
              </select>
              <button onClick={fetchLogs} className="rounded-lg border border-zinc-200 p-1.5 text-zinc-500 hover:text-zinc-900 dark:border-zinc-700 dark:hover:text-zinc-100">
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
              <button onClick={handleClearLogs} className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30">
                <Trash2 className="h-3 w-3" /> ล้าง log
              </button>
            </div>
          </div>

          {logsLoading ? (
            <div className="py-12 text-center text-sm text-zinc-400">กำลังโหลด...</div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-zinc-200 py-12 text-center dark:border-zinc-800">
              <AlertCircle className="h-8 w-8 text-zinc-300 dark:text-zinc-700" />
              <p className="text-sm text-zinc-400">ยังไม่มี log ที่ตรงกับเงื่อนไข</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">Method</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">Path</th>
                    <th className="hidden px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500 sm:table-cell">IP</th>
                    <th className="hidden px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500 md:table-cell">Status</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">เวลา</th>
                    <th className="px-4 py-2.5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {logs.map((log: any) => (
                    <>
                      <tr key={log.id} className="bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800/50">
                        <td className="px-4 py-3">
                          <span className={cn('rounded-md px-2 py-0.5 text-xs font-bold', METHOD_COLORS[log.method] || 'bg-zinc-100 text-zinc-600')}>
                            {log.method}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-zinc-700 dark:text-zinc-300">{log.path}</td>
                        <td className="hidden px-4 py-3 text-xs text-zinc-500 sm:table-cell">{log.ip}</td>
                        <td className="hidden px-4 py-3 md:table-cell">
                          <span className={cn('text-xs font-medium', (log.statusCode||200) < 300 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400')}>
                            {log.statusCode || 200}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-zinc-500">{formatThaiTime(log.timestamp)}</td>
                        <td className="px-4 py-3">
                          {log.body && (
                            <button onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                              {expandedLog === log.id ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                            </button>
                          )}
                        </td>
                      </tr>
                      {expandedLog === log.id && log.body && (
                        <tr key={`${log.id}-body`} className="bg-zinc-50 dark:bg-zinc-800/30">
                          <td colSpan={6} className="px-4 py-3">
                            <p className="mb-1 text-xs font-semibold text-zinc-500">Request Body:</p>
                            <pre className="overflow-x-auto rounded-lg bg-zinc-900 p-3 text-xs text-zinc-200">
                              {(() => { try { return JSON.stringify(JSON.parse(log.body), null, 2) } catch { return log.body } })()}
                            </pre>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {logTotal > 20 && (
            <div className="mt-4 flex items-center justify-between text-sm text-zinc-500">
              <span>แสดง {Math.min((logPage-1)*20+1, logTotal)}–{Math.min(logPage*20, logTotal)} จาก {logTotal} รายการ</span>
              <div className="flex gap-2">
                <button onClick={() => setLogPage(p => Math.max(1,p-1))} disabled={logPage===1}
                  className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-700 dark:hover:bg-zinc-800">
                  ก่อนหน้า
                </button>
                <button onClick={() => setLogPage(p => p+1)} disabled={logPage*20>=logTotal}
                  className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-700 dark:hover:bg-zinc-800">
                  ถัดไป
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
