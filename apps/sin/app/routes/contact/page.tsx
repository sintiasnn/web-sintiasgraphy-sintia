import type { Route } from "./+types/page";

export function meta(_props: Route.MetaArgs) {
  return [
    { title: "Contact – sintiasgraphy" },
    { name: "description", content: "Get in touch" },
  ];
}

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Contact</h1>
      <div className="mt-4 space-y-2 text-gray-700 dark:text-gray-300">
        <p>Email: <a className="underline" href="mailto:sintia@example.com">sintia@example.com</a></p>
        <p>Instagram: <a className="underline" href="https://instagram.com/" target="_blank" rel="noreferrer noopener">@yourhandle</a></p>
      </div>
    </main>
  );
}

