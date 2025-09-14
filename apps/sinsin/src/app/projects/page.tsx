'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from "#/app/link"

type Project = {
  title: string
  description?: string
  link?: string
  tags?: string[]
  updated?: string
  image?: string
}

export default function ProjectsPage() {
  const [items, setItems] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showRefreshed, setShowRefreshed] = useState(false)

  async function load(refresh?: boolean) {
    setLoading(true)
    try {
      const url = `/api/projects${refresh ? '?refresh=1' : ''}`
      const res = await fetch(url)
      const data = res.ok ? ((await res.json()) as { items: Project[] }) : { items: [] }
      setItems(data.items || [])
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(false)
  }, [])

  const skeletonCount = useMemo(() => Math.min(items.length || 6, 6), [items.length])

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      {showRefreshed && (
        <div className="mb-3 rounded border border-green-2 00 bg-green-50 px-3 py-2 text-sm text-green-800 dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-300">
          Projects refreshed
        </div>
      )}
      <div className="mb-4 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
        <button
          onClick={async () => { await load(true); setShowRefreshed(true); setTimeout(() => setShowRefreshed(false), 1800) }}
          className="rounded border px-3 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          Refresh
        </button>
      </div>
      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {loading
          ? Array.from({ length: skeletonCount }).map((_, i) => (
              <li key={`s-${i}`} className="rounded border p-4 dark:border-gray-800">
                <div className="mb-3 h-40 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                <div className="mt-2 h-16 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              </li>
            ))
          : items.map((p) => (
          <li key={p.title} className="rounded border p-4 dark:border-gray-800">
            {p.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.image} alt="" loading="lazy" className="mb-3 h-40 w-full rounded object-cover" />
            )}
            {p.link ? (
              <a href={p.link} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">
                {p.title}
              </a>
            ) : (
              <span className="font-medium">{p.title}</span>
            )}
            {p.updated && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{new Date(p.updated).toDateString()}</p>
            )}
            {p.description && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{p.description}</p>
            )}
            {p.tags && p.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span key={t} className="rounded bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-800">
                    {t}
                  </span>
                ))}
              </div>
            )}
            {p.link && (
              <a
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center rounded border px-2 py-1 text-xs hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {p.link.includes('github.com') ? (
                  <>
                    <svg aria-hidden="true" viewBox="0 0 16 16" width="14" height="14" className="mr-1 inline-block" fill="currentColor">
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-2.09 2.2-2.09.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.45.55.38C13.71 14.53 16 11.54 16 8c0-4.42-3.58-8-8-8z" />
                    </svg>
                    View Repo
                  </>
                ) : (
                  <>Visit ↗</>
                )}
              </a>
            )}
          </li>
        ))}
      </ul>
    </main>
  )
}

