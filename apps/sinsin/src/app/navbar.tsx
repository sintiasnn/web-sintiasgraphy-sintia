'use client'

import * as React from 'react'
import Link from './link'
import { usePathname } from 'next/navigation'

const nav = [
  { name: 'Home', href: '/' },
  { name: 'Projects', href: '/projects' },
  { name: 'Blogs', href: '/blogs' },
  { name: 'Photos', href: '/photos' },
  { name: 'About', href: '/about' },
]

export default function Navbar() {
  const pathname = usePathname()
  const isActive = (href: string) => (href === '/' ? pathname === '/' : (pathname || '').startsWith(href))

  const [open, setOpen] = React.useState(false)
  React.useEffect(() => {
    setOpen(false)
  }, [pathname])

  const [theme, setTheme] = React.useState<'light' | 'dark'>('light')
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light')
    }
  }, [])
  const toggleTheme = React.useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    if (typeof document !== 'undefined') {
      const root = document.documentElement
      if (next === 'dark') root.setAttribute('data-theme', 'dark')
      else root.removeAttribute('data-theme')
    }
    try {
      localStorage.setItem('theme', next)
    } catch {}
  }, [theme])

  return (
    <nav className="sticky top-0 z-20 bg-background">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-6 px-4">
        <div className="hidden flex-1 lg:block" />

        <div className="hidden flex-none items-center gap-10 text-sm lg:flex dark:text-gray-300">
          {nav.map((n) => {
            const active = isActive(n.href)
            return (
              <Link
                key={n.href}
                href={n.href}
                className={(active ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-700 dark:text-gray-300') + ' hover:text-gray-900 dark:hover:text-white'}
              >
                {n.name}
              </Link>
            )
          })}
        </div>

        <div className="ml-auto flex flex-1 items-center justify-end gap-2">
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="inline-flex items-center justify-center rounded border p-2 text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
            title={theme === 'dark' ? 'Light' : 'Dark'}
          >
            {theme === 'dark' ? (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          <button
            className="inline-flex items-center justify-center rounded border p-2 text-gray-700 lg:hidden dark:border-gray-800 dark:text-gray-300"
            aria-controls="mobile-nav"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>
      </div>

      <div id="mobile-nav" className={(open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0') + ' overflow-hidden transition-all duration-300 lg:hidden'}>
        <div className="mx-auto grid max-w-5xl gap-2 px-4 pb-4 pt-2 text-sm">
          {nav.map((n) => {
            const active = isActive(n.href)
            return (
              <Link
                key={n.href}
                href={n.href}
                className={(active ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-700 dark:text-gray-300') + ' rounded px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-800'}
              >
                {n.name}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
