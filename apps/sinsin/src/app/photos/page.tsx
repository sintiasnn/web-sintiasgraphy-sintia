'use client'

import { useEffect, useRef, useState } from 'react'
import Link from "#/app/link"

type Photo = { src: string; alt?: string; caption?: string }
type InstagramResponse = { posts?: string[]; profileName?: string; profileUrl?: string }
type PhotosResponse = { photos: Photo[]; hero?: string }

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [heroSrc, setHeroSrc] = useState<string | null>(null)
  const [igProfile, setIgProfile] = useState<{ name?: string; url?: string }>({})
  const active = activeIndex != null ? photos[activeIndex] : null
  const closeRef = useRef<HTMLButtonElement>(null)
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)
  const touchStartX = useRef<number | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const r = await fetch('/api/photos')
        const data: PhotosResponse = r.ok ? await r.json() : { photos: [] }
        setPhotos(data.photos || [])
        setHeroSrc(data.hero || data.photos?.[0]?.src || null)
      } catch {
        setPhotos([])
        setHeroSrc(null)
      }
      try {
        const r2 = await fetch('/api/instagram')
        const data2: InstagramResponse = r2.ok ? await r2.json() : { posts: [] }
        setIgProfile({ name: data2.profileName, url: data2.profileUrl })
      } catch {
        setIgProfile({})
      }
    }
    load()
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (activeIndex == null) return
      if (e.key === 'Escape') setActiveIndex(null)
      if (e.key === 'ArrowLeft') setActiveIndex((i) => (i == null ? i : Math.max(i - 1, 0)))
      if (e.key === 'ArrowRight') setActiveIndex((i) => (i == null ? i : Math.min(i + 1, photos.length - 1)))
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [activeIndex, photos.length])

  useEffect(() => {
    if (activeIndex == null) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        const focusables = [closeRef.current, prevRef.current, nextRef.current].filter(Boolean) as HTMLElement[]
        if (focusables.length === 0) return
        const current = document.activeElement as HTMLElement | null
        const idx = current ? focusables.indexOf(current) : -1
        const nextIdx = e.shiftKey ? (idx <= 0 ? focusables.length - 1 : idx - 1) : (idx === focusables.length - 1 ? 0 : idx + 1)
        focusables[nextIdx]?.focus()
        e.preventDefault()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activeIndex])

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartX.current
    const end = e.changedTouches[0]?.clientX ?? null
    if (start != null && end != null) {
      const delta = end - start
      if (delta > 40) setActiveIndex((i) => (i == null ? i : Math.max(i - 1, 0)))
      if (delta < -40) setActiveIndex((i) => (i == null ? i : Math.min(i + 1, photos.length - 1)))
    }
    touchStartX.current = null
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      

      {/* Hero section: big photo + horizontal thumbnails */}
      {photos.length > 0 && heroSrc && (
        <section className="mt-4">
          {(() => {
            const heroIndex = photos.findIndex(p => p.src === heroSrc)
            const hp = heroIndex >= 0 ? photos[heroIndex] : null
            const open = () => setActiveIndex(heroIndex >= 0 ? heroIndex : 0)
            return (
              <button
                onClick={open}
                className="relative block w-full overflow-hidden rounded border dark:border-gray-800"
                aria-label={(hp?.caption || hp?.alt || 'Open featured photo')}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroSrc}
                  alt={hp?.alt ?? ''}
                  className="block h-auto w-full object-cover md:h-96"
                  loading="lazy"
                />
                {/* gradient + title overlay */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent"
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-end p-4 sm:p-6 pr-24 sm:pr-20 md:pr-16 lg:pr-12 xl:pr-16">
                  <div className="pointer-events-auto text-left text-white ml-auto w-1/2 sm:w-1/2 md:w-5/12 lg:w-auto max-w-3xl">
                    <h1 className="text-2xl font-semibold tracking-tight">Photos</h1>
                    <p className="mt-3 text-sm sm:text-base opacity-95">A simple lightbox gallery. Click a photo to view.</p>
                    <div className="mt-4">
                      <Link
                        href="/"
                        className="inline-flex items-center rounded border px-3 py-1 text-xs sm:text-sm bg-white/90 text-gray-900 hover:bg-white dark:bg-gray-900/70 dark:text-gray-100 dark:hover:bg-gray-900"
                        onClick={(e) => { e.stopPropagation(); }}
                      >
                        ← Back to Home
                      </Link>
                    </div>
                  </div>
                </div>
              </button>
            )
          })()}
          <div className="mt-3 overflow-x-auto">
            <div className="flex gap-2">
              {photos.map((p, idx) => (
                <button
                  key={`thumb-${p.src}-${idx}`}
                  onClick={() => setActiveIndex(idx)}
                  className="group relative flex-shrink-0 overflow-hidden rounded border dark:border-gray-800"
                  aria-label={p.caption || p.alt || 'Open photo'}
                  title={p.caption || p.alt || ''}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.src} alt={p.alt ?? ''} className="block h-20 w-auto object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {active && (
        <div
          className="fixed inset-0 z-40 grid place-items-center bg-black/70 p-4"
          onClick={() => setActiveIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label={active.caption || active.alt || 'Photo viewer'}
        >
          <div className="relative" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onClick={(e) => e.stopPropagation()}>
            <button
              ref={closeRef}
              className="absolute right-2 top-2 z-10 rounded bg-white/80 px-2 py-1 text-sm text-gray-900 hover:bg-white focus:outline-none focus:ring-2 focus:ring-white dark:bg-gray-800/80 dark:text-gray-100"
              onClick={() => setActiveIndex(null)}
              aria-label="Close"
            >
              ✕
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={active.src} alt={active.alt ?? ''} className="max-h-[90vh] max-w-[90vw] rounded shadow-2xl" />
            <div className="absolute inset-x-0 bottom-2 mx-auto w-full max-w-[90vw] text-center">
              {(active.caption || active.alt) && (
                <div className="mx-auto inline-block rounded bg-black/60 px-3 py-1 text-sm text-white backdrop-blur">
                  {active.caption || active.alt}
                  <span className="ml-2 text-xs opacity-70">
                    ({(activeIndex ?? 0) + 1} / {photos.length})
                  </span>
                </div>
              )}
            </div>
            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 pointer-events-none">
              <button
                ref={prevRef}
                className="pointer-events-auto rounded bg-white/80 p-2 text-gray-900 hover:bg-white focus:outline-none focus:ring-2 focus:ring-white dark:bg-gray-800/80 dark:text-gray-100"
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveIndex((i) => (i == null ? i : Math.max(i - 1, 0)))
                }}
                aria-label="Previous"
              >
                ‹
              </button>
              <button
                ref={nextRef}
                className="pointer-events-auto rounded bg-white/80 p-2 text-gray-900 hover:bg-white focus:outline-none focus:ring-2 focus:ring-white dark:bg-gray-800/80 dark:text-gray-100"
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveIndex((i) => (i == null ? i : Math.min(i + 1, photos.length - 1)))
                }}
                aria-label="Next"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      )}
      {(igProfile.name || igProfile.url) && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold tracking-tight">From Instagram</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            I also keep a dedicated Instagram for these photos — check out{' '}
            {igProfile.url ? (
              <a href={igProfile.url} target="_blank" rel="noopener noreferrer" className="underline">
                @{igProfile.name || igProfile.url.replace(/^https?:\/\/+([^/]+)\//, '$1')}
              </a>
            ) : (
              <span className="font-medium">@ininininini</span>
            )}
            .
          </p>
        </section>
      )}
      {/* Bottom back button not needed; included in hero overlay */}
    </main>
  )
}
