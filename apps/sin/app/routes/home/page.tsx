import type { Route } from "./+types/page";
import { Welcome } from "./welcome";

type Experience = {
  title: string;
  company: string;
  companyUrl?: string;
  start: string; // month-year string
  end?: string | null; // month-year string or null
  type?: string; // employment type e.g., Full-time, Freelance
  stack?: string[];
};

export function meta(_props: Route.MetaArgs) {
  return [
    { title: "sinsin — Home" },
    { name: "description", content: "Personal site of Ni Putu Sintia Wati: photos, projects, and notes." },
  ];
}

export async function clientLoader() {
  try {
    const res = await fetch('/api/experience');
    if (!res.ok) return { items: [] as Experience[] };
    return (await res.json()) as { items: Experience[] };
  } catch {
    return { items: [] as Experience[] };
  }
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { items } = (loaderData as { items: Experience[] }) ?? { items: [] };
  return (
    <>
      <Welcome />
      {items && items.length > 0 && (
        <section id="experience" className="mx-auto max-w-4xl px-4 min-h-[calc(100dvh-56px)] flex flex-col justify-center py-10">
          <h2 className="text-lg font-semibold tracking-tight">Experience</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 mx-auto max-w-4xl">
            {items.map((ex, idx) => {
              const start = ex.start || '';
              const end = ex.end || 'Present';
              return (
                <li key={idx} className="rounded border p-3 sm:p-4 h-full dark:border-gray-800">
                  <div className="flex items-baseline justify-between gap-3">
                    <div>
                      <div className="font-medium">
                        {ex.title} {ex.company && (
                          <>
                            <span className="text-gray-500"> · </span>
                            {ex.companyUrl ? (
                              <a href={ex.companyUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">{ex.company}</a>
                            ) : (
                              <span>{ex.company}</span>
                            )}
                          </>
                        )}
                      </div>
                      {ex.type && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">{ex.type}</div>
                      )}
                    </div>
                    {(start || end) && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{start} – {end}</div>
                    )}
                  </div>
                  {ex.stack && ex.stack.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {ex.stack.map((t, i) => (
                        <span key={t + i} className="rounded bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-800">{t}</span>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </>
  );
}
