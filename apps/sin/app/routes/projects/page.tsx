import type { Route } from "./+types/page";

type Project = {
  title: string;
  description?: string;
  link?: string;
  tags?: string[];
  updated?: string;
  image?: string;
};

export function meta(_props: Route.MetaArgs) {
  return [
    { title: "Projects – sintiasgraphy" },
    { name: "description", content: "Selected projects and experiments" },
  ];
}

export async function clientLoader() {
  const res = await fetch("/projects.json");
  if (!res.ok) return { items: [] as Project[] };
  return (await res.json()) as { items: Project[] };
}

export default function ProjectsPage({ loaderData }: Route.ComponentProps) {
  const { items } = (loaderData as { items: Project[] }) ?? { items: [] };
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((p) => (
          <li key={p.title} className="rounded border p-4 dark:border-gray-800">
            {p.image && (
              <img src={p.image} alt="" loading="lazy" className="mb-3 h-40 w-full rounded object-cover" />
            )}
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-medium text-lg">{p.title}</h2>
              {p.updated && (
                <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(p.updated).toDateString()}</span>
              )}
            </div>
            {p.description && (
              <p className="mt-2 text-gray-600 dark:text-gray-300">{p.description}</p>
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
                className="mt-3 inline-block text-blue-600 underline dark:text-blue-400"
              >
                View project
              </a>
            )}
          </li>
        ))}
        {items.length === 0 && (
          <li className="text-gray-600 dark:text-gray-400">No projects yet.</li>
        )}
      </ul>
    </main>
  );
}
