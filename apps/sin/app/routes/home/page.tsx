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

type Involvement = {
  title: string;
  org?: string;
  orgUrl?: string;
  start?: string;
  end?: string | null;
  tags?: string[];
};

export function meta(_props: Route.MetaArgs) {
  return [
    { title: "sinsin — Home" },
    { name: "description", content: "Personal site of Ni Putu Sintia Wati: photos, projects, and notes." },
  ];
}

export async function clientLoader() {
  try {
    const [exRes, comRes] = await Promise.all([
      fetch('/api/experience'),
      fetch('/api/community'),
    ]);
    const items = exRes.ok ? ((await exRes.json()) as { items: Experience[] }).items : [];
    const community = comRes.ok ? ((await comRes.json()) as { items: Involvement[] }).items : [];
    return { items, community } as { items: Experience[]; community: Involvement[] };
  } catch {
    return { items: [] as Experience[], community: [] as Involvement[] };
  }
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { items, community } = (loaderData as { items: Experience[]; community: Involvement[] }) ?? { items: [], community: [] };
  return (
    <>
      <Welcome />
      {(items.length > 0 || community.length > 0) && (
        <section id="experience" className="mx-auto max-w-5xl px-4 min-h-[calc(100dvh-56px)] flex flex-col justify-center py-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {items.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold tracking-tight">Experience</h2>
                <ul className="mt-4 space-y-4">
                  {items.map((ex, idx) => {
                    const start = ex.start || '';
                    const end = ex.end || 'Present';
                    return (
                      <li key={idx} className="rounded border p-3 sm:p-4 dark:border-gray-800">
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
              </div>
            )}
            {community.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold tracking-tight">Community Involvement</h2>
                <ul className="mt-4 space-y-4">
                  {community.map((co, idx) => {
                    const start = co.start || '';
                    const end = co.end || 'Present';
                    return (
                      <li key={idx} className="rounded border p-3 sm:p-4 dark:border-gray-800">
                        <div className="flex items-baseline justify-between gap-3">
                          <div>
                            <div className="font-medium">
                              {co.title} {co.org && (
                                <>
                                  <span className="text-gray-500"> · </span>
                                  {co.orgUrl ? (
                                    <a href={co.orgUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">{co.org}</a>
                                  ) : (
                                    <span>{co.org}</span>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                          {(start || end) && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{start} – {end}</div>
                          )}
                        </div>
                        {co.tags && co.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {co.tags.map((t, i) => (
                              <span key={t + i} className="rounded bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-800">{t}</span>
                            ))}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
