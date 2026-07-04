import { Link, useLocation } from 'react-router-dom'
import { ArrowLeft, SearchX } from 'lucide-react'

export default function NotFoundPage() {
  const { pathname } = useLocation()

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4 py-16">
      {/* Glow effect */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="h-[400px] w-[400px] rounded-full bg-zinc-200/40 blur-3xl dark:bg-zinc-800/30" />
      </div>

      <div className="relative flex flex-col items-center text-center">
        {/* Icon */}
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <SearchX className="h-9 w-9 text-zinc-400 dark:text-zinc-500" />
        </div>

        {/* 404 number */}
        <p className="mb-2 font-mono text-8xl font-black tracking-tighter text-zinc-900/10 dark:text-zinc-100/10 select-none">
          404
        </p>

        {/* Message */}
        <h1 className="-mt-6 mb-3 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          ไม่พบหน้าที่ต้องการ
        </h1>
        <p className="mb-2 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
          ไม่พบ <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">{decodeURIComponent(pathname)}</code>
        </p>
        <p className="mb-8 text-sm text-zinc-400 dark:text-zinc-500">
          หน้านี้ถูกย้าย ลบ หรือไม่เคยมีอยู่
        </p>

        {/* Actions */}
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <ArrowLeft className="h-4 w-4" />
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  )
}
