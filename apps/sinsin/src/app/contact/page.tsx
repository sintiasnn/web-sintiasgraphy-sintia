import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact – sinsin',
  description: 'Get in touch',
}

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="fluid-title font-semibold tracking-tight">Contact</h1>
      <div className="mt-4 space-y-2 text-gray-700 dark:text-gray-300">
        <p>
          Email: <a className="underline" href="mailto:sintia@example.com">sintia@example.com</a>
        </p>
        <p>
          Instagram: <a className="underline" href="https://instagram.com/" target="_blank" rel="noreferrer noopener">@yourhandle</a>
        </p>
      </div>
    </main>
  )
}

