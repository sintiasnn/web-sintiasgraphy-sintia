export function Welcome() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Hi, I’m Sintia.</h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-gray-700 dark:text-gray-300">
          I build for the web and take simple snaps. This site hosts
          my photos, notes, and a reading log.
        </p>
      </header>

      <section className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <a href="/photos" className="rounded border p-4 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/40">
          <h2 className="font-medium">Photos</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">A growing gallery with a simple lightbox.</p>
        </a>
        <a href="/books" className="rounded border p-4 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/40">
          <h2 className="font-medium">Books</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Recent reads from Goodreads RSS.</p>
        </a>
      </section>
    </main>
  );
}
