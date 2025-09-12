import type { Route } from "./+types/page";

export function meta(_props: Route.MetaArgs) {
  return [
    { title: "About – sintiasgraphy" },
    { name: "description", content: "About Sintia Wati" },
  ];
}

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">About</h1>
      <p className="mt-4 leading-relaxed text-gray-700 dark:text-gray-300">
        Hi! I’m Ni Putu Sintia Wati. I enjoy building for the web and taking
        simple snaps in my spare time. This site is a home for notes, photos,
        and the books I’m reading.
      </p>
    </main>
  );
}

