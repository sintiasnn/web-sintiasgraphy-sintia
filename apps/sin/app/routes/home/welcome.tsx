export function Welcome() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-10 min-h-[calc(100dvh-56px)] flex flex-col justify-center gap-8 md:gap-10 lg:gap-12">
      <header className="w-full">
        <h1 className="text-2xl font-semibold tracking-tight">Hi, I’m Sintia.</h1>
        <p className="fluid-subtitle mt-3 max-w-2xl leading-relaxed text-gray-700 dark:text-gray-300">
          I build for the web and take simple snaps. This site hosts
          my photos, notes, and a reading log.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <a href="/photos" className="rounded border p-4 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/40">
          <h2 className="font-medium">Photos</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">A growing gallery with a simple lightbox.</p>
        </a>
        <a href="/projects" className="rounded border p-4 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/40">
          <h2 className="font-medium">Projects</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Selected work and small experiments.</p>
        </a>
      </section>
    </section>
  );
}
