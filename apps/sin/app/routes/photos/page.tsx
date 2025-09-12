import { useState } from "react";
import type { Route } from "./+types/page";

type Photo = { src: string; alt?: string; w?: number; h?: number };

export function meta(_props: Route.MetaArgs) {
	return [
		{ title: "Photos – sinsin" },
		{ name: "description", content: "Photo gallery" },
	];
}

// Load list from public JSON so it’s editable without rebuild
export async function clientLoader() {
	const res = await fetch("/photos.json");
	if (!res.ok) return { photos: [] as Photo[] };
	return (await res.json()) as { photos: Photo[] };
}

export default function PhotosPage({ loaderData }: Route.ComponentProps) {
	const { photos } = (loaderData as { photos: Photo[] }) ?? { photos: [] };
	const [active, setActive] = useState<Photo | null>(null);

	return (
		<main className="mx-auto max-w-6xl px-4 py-10">
			<h1 className="text-2xl font-semibold tracking-tight">Photos</h1>
			<p className="mt-2 text-gray-600 dark:text-gray-400">
				Click a photo to view larger.
			</p>
			<section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
				{photos.map((p, i) => (
					<button
						key={p.src + i}
						className="group overflow-hidden rounded bg-gray-100 dark:bg-gray-800"
						onClick={() => setActive(p)}
						aria-label="Open photo"
					>
						<img
							src={p.src}
							alt={p.alt ?? ""}
							loading="lazy"
							className="aspect-square w-full object-cover transition duration-300 group-hover:scale-105"
						/>
					</button>
				))}
			</section>

			{active && (
				<div
					className="fixed inset-0 z-40 grid place-items-center bg-black/70 p-4"
					onClick={() => setActive(null)}
					role="dialog"
					aria-modal="true"
				>
					<img
						src={active.src}
						alt={active.alt ?? ""}
						className="max-h-[90vh] max-w-[90vw] rounded shadow-2xl"
					/>
				</div>
			)}
		</main>
	);
}
