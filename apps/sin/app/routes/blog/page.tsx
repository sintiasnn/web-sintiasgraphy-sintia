import type { Route } from "./+types/page";

export function meta(_props: Route.MetaArgs) {
	return [
		{ title: "Blog – sinsin" },
		{ name: "description", content: "Posts and notes" },
	];
}

export default function BlogPage() {
	return (
		<main className="mx-auto max-w-5xl px-4 py-10">
			<h1 className="text-2xl font-semibold tracking-tight">Blog</h1>
			<p className="mt-4 text-gray-600 dark:text-gray-300">Coming soon.</p>
		</main>
	);
}
