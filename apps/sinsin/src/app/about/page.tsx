import type { Metadata } from 'next'
import Link from "#/app/link"

export const metadata: Metadata = {
  title: 'About – sinsin',
  description: 'About Sintia Wati',
}

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="fluid-title font-semibold tracking-tight">About</h1>
      <p className="mt-4 leading-relaxed text-gray-700 dark:text-gray-300">
        Hi! I’m Ni Putu Sintia Wati. I enjoy building for the web and taking
        simple snaps in my spare time. This site is a home for notes, photos,
        and the books I’m reading.
      </p>
      <div className="mt-10">
        <Link href="/" className="rounded border px-3 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800">
          ← Back to Home
        </Link>
      </div>
    </main>
  )
}
