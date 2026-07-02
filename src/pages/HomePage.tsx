import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Download } from 'lucide-react'

/**
 * Home / landing page for the API Playground
 */
export default function HomePage() {
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
          คู่มืออ้างอิง REST API endpoints สำหรับเรียนรู้และทดสอบ
          ดู endpoint, parameters, headers แล้วเอาไปใช้ใน Postman ได้เลย
        </p>
        <Link
          to="/endpoints"
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          เริ่มต้นใช้งาน
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </section>

      {/* Postman Download Card */}
      <section aria-label="Download Postman">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#FF6C37] to-[#FF8C5A] p-8 shadow-lg">
          {/* decorative circles */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-white/10" />

          <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:items-center">
            {/* Postman logo */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white shadow-md">
              <svg viewBox="0 0 200 200" className="h-12 w-12" aria-hidden="true">
                <circle cx="100" cy="100" r="100" fill="#FF6C37"/>
                <path d="M110.7 80.3l-22.4 22.4 9.9 9.9 22.4-22.4c2.7-2.7 2.7-7.2 0-9.9s-7.2-2.7-9.9 0z" fill="white"/>
                <path d="M98.2 92.8L75.8 70.4c-2.7-2.7-7.2-2.7-9.9 0s-2.7 7.2 0 9.9l22.4 22.4 9.9-9.9z" fill="white" opacity="0.7"/>
                <path d="M88.3 102.7l9.9 9.9-22.4 22.4c-2.7 2.7-7.2 2.7-9.9 0s-2.7-7.2 0-9.9l22.4-22.4z" fill="white" opacity="0.5"/>
                <circle cx="118.5" cy="76.2" r="7" fill="white"/>
              </svg>
            </div>

            {/* Text */}
            <div className="flex-1 text-center sm:text-left">
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-white/70">
                จำเป็นต้องมี
              </p>
              <h2 className="text-2xl font-bold text-white">Postman</h2>
              <p className="mt-2 text-sm text-white/80">
                ไซต์นี้เป็นแค่คู่มืออ้างอิง ไม่มีปุ่มกด test — ต้องโหลด Postman
                แล้วเอา URL, headers, body ไปใส่เองนะ
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-3 sm:justify-start">
                <div className="flex items-center gap-1.5 text-xs text-white/70">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/50" />
                  Windows / macOS / Linux
                </div>
                <div className="flex items-center gap-1.5 text-xs text-white/70">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/50" />
                  ฟรี 100%
                </div>
                <div className="flex items-center gap-1.5 text-xs text-white/70">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/50" />
                  ไม่ต้อง credit card
                </div>
              </div>
            </div>

            {/* Download button */}
            <a
              href="https://www.postman.com/downloads/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#FF6C37] shadow-md transition-all hover:scale-105 hover:shadow-lg active:scale-100"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Download Postman
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
