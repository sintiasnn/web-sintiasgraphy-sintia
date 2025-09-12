import type { Route } from "./+types/page";

type Book = {
	title: string;
	link: string;
	pubDate?: string;
	image?: string;
};

export function meta(_props: Route.MetaArgs) {
	return [
		{ title: "Books – sinsin" },
		{ name: "description", content: "Recently read on Goodreads" },
	];
}

export async function clientLoader() {
	try {
		const res = await fetch("/api/books");
		if (!res.ok) throw new Error("Bad response");
		const data = (await res.json()) as { items: Book[] };
		return data;
	} catch {
		return { items: [] as Book[] };
	}
}

export default function BooksPage({ loaderData }: Route.ComponentProps) {
	const { items } = (loaderData as { items: Book[] }) ?? { items: [] };

	return (
		<main className="mx-auto max-w-5xl px-4 py-10">
			<h1 className="text-2xl font-semibold tracking-tight">Books</h1>
			<p className="mt-2 text-gray-600 dark:text-gray-400">
				Pulled from Goodreads RSS. Set GOODREADS_RSS_URL to customize.
			</p>
			<ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{items.map((b) => (
					<li
						key={b.link}
						className="flex gap-3 rounded border p-3 dark:border-gray-800"
					>
						{b.image ? (
							<img
								src={b.image}
								alt="cover"
								loading="lazy"
								className="h-20 w-16 flex-none rounded object-cover"
							/>
						) : (
							<div className="h-20 w-16 flex-none rounded bg-gray-200 dark:bg-gray-800" />
						)}
						<div className="min-w-0">
							<a
								href={b.link}
								target="_blank"
								rel="noopener noreferrer"
								className="line-clamp-2 font-medium hover:underline"
							>
								{b.title}
							</a>
							{b.pubDate && (
								<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
									{new Date(b.pubDate).toDateString()}
								</p>
							)}
						</div>
					</li>
				))}
			</ul>
		</main>
	);
}
