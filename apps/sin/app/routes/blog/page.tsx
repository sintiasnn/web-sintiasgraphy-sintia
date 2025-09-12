import type { Route } from "./+types/page";
import { useState } from "react";

export function meta(_props: Route.MetaArgs) {
  return [
    { title: "Blog – sintiasgraphy" },
    { name: "description", content: "Posts and notes" },
  ];
}

type MediumItem = { title: string; link: string; pubDate?: string; image?: string; snippet?: string };

export async function clientLoader() {
  async function fetchPage(q: string) {
    try {
      const r = await fetch(`/api/medium${q}`);
      if (!r.ok) return { items: [] as MediumItem[] };
      return (await r.json()) as { items: MediumItem[] };
    } catch {
      return { items: [] as MediumItem[] };
    }
  }

  // Probe a few combinations, including the one you tested manually
  const queries = [
    "?limit=6&page=1",
    "?limit=6&page=2",
    "?limit=6&page=3",
    "?limit=12&page=1",
    "?limit=12&page=2",
    "", // no pagination
  ];

  for (const q of queries) {
    const data = await fetchPage(q);
    if (data.items && data.items.length > 0) return data;
  }
  return { items: [] as MediumItem[] };
}

export default function BlogPage({ loaderData }: Route.ComponentProps) {
  const { items } = (loaderData as { items: MediumItem[] }) ?? { items: [] };
  const [visible, setVisible] = useState(6);
  const list = items.slice(0, Math.max(6, visible));
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Blog</h1>
      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {list.map((it) => (
          <li key={it.link} className="rounded border p-4 dark:border-gray-800">
            {it.image && (
              <img src={it.image} alt="" loading="lazy" className="mb-3 h-40 w-full rounded object-cover" />
            )}
            <a href={it.link} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">
              {it.title}
            </a>
            {it.pubDate && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{new Date(it.pubDate).toDateString()}</p>
            )}
            {it.snippet && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{it.snippet}</p>
            )}
            <div className="mt-3">
              <a
                href={it.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded border px-2 py-1 text-xs hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                View on Medium →
              </a>
            </div>
          </li>
        ))}
        {items.length === 0 && (
          <li className="text-gray-600 dark:text-gray-400">No posts yet.</li>
        )}
      </ul>
      {visible < items.length && (
        <div className="mt-6 text-center">
          <button
            className="rounded border px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
            onClick={() => setVisible((v) => v + 6)}
          >
            Load more
          </button>
        </div>
      )}
    </main>
  );
}
