"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "#/app/link";

type MediumItem = {
	title: string;
	link: string;
	pubDate?: string;
	image?: string;
	snippet?: string;
};

export default function BlogPage() {
	const [items, setItems] = useState<MediumItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [pageCount, setPageCount] = useState<number | undefined>(undefined);
	const [limit] = useState(12);
	const [showRefreshed, setShowRefreshed] = useState(false);

	async function load(p = 1, refresh?: boolean) {
		setLoading(true);
		try {
			const url = `/api/medium?limit=${encodeURIComponent(String(limit))}&page=${encodeURIComponent(String(p))}${refresh ? "&noCache=1" : ""}`;
			const r = await fetch(url);
			const data = r.ok ? await r.json() : { items: [] };
			setItems(data.items || []);
			setPage(data.page || p);
			setPageCount(data.pageCount);
		} catch {
			setItems([]);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		load(1);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const skeletonCount = useMemo(() => Math.min(limit, 12), [limit]);
	const hasPrev = page > 1;
	const hasNext = (pageCount ?? 1) > page;

	return (
		<main className="mx-auto max-w-3xl px-4 py-10">
			{showRefreshed && (
				<div className="mb-3 rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800 dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-300">
					Feed refreshed
				</div>
			)}
			<div className="mb-4 flex items-center justify-between gap-3">
				<h1 className="text-2xl font-semibold tracking-tight">Blogs</h1>
				<button
					onClick={async () => {
						await load(page, true);
						setShowRefreshed(true);
						setTimeout(() => setShowRefreshed(false), 1800);
					}}
					className="rounded border px-3 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
				>
					Refresh
				</button>
			</div>
			<ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
				{loading
					? Array.from({ length: skeletonCount }).map((_, i) => (
							<li
								key={`s-${i}`}
								className="rounded border p-4 dark:border-gray-800"
							>
								<div className="mb-3 h-40 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
								<div className="h-4 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
								<div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
								<div className="mt-2 h-16 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
							</li>
						))
					: items.map((it) => (
							<li
								key={it.link}
								className="rounded border p-4 dark:border-gray-800"
							>
								{it.image && (
									// eslint-disable-next-line @next/next/no-img-element
									<img
										src={it.image}
										alt=""
										loading="lazy"
										className="mb-3 h-40 w-full rounded object-cover"
									/>
								)}
								<a
									href={it.link}
									target="_blank"
									rel="noopener noreferrer"
									className="font-medium hover:underline"
								>
									{it.title}
								</a>
								{it.pubDate && (
									<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
										{new Date(it.pubDate).toDateString()}
									</p>
								)}
								{it.snippet && (
									<p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
										{it.snippet}
									</p>
								)}
								<div className="mt-3">
									<a
										href={it.link}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center rounded border px-2 py-1 text-xs hover:bg-gray-50 dark:hover:bg-gray-800"
									>
										<svg
											aria-hidden="true"
											viewBox="0 0 24 24"
											width="14"
											height="14"
											className="mr-1 inline-block"
											fill="currentColor"
										>
											<circle cx="6" cy="12" r="4" />
											<rect x="10" y="8" width="6" height="8" rx="1" />
											<circle cx="19" cy="12" r="2" />
										</svg>
										View on Medium ↗
									</a>
								</div>
							</li>
						))}
				{items.length === 0 && !loading && (
					<li className="flex flex-col items-center justify-center gap-3 rounded border p-6 text-gray-600 dark:border-gray-800 dark:text-gray-400">
						<span>No posts yet.</span>
						<button
							onClick={() => load(page, true)}
							className="rounded border px-3 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
						>
							Retry
						</button>
					</li>
				)}
			</ul>
			{pageCount && pageCount > 1 && (
				<div className="mt-8 flex items-center justify-between text-sm">
					{hasPrev ? (
						<button
							onClick={() => load(page - 1)}
							className="rounded border px-3 py-1 hover:bg-gray-50 dark:hover:bg-gray-800"
						>
							← Newer
						</button>
					) : (
						<span />
					)}
					<span className="text-gray-600 dark:text-gray-400">
						Page {page}
						{pageCount ? ` of ${pageCount}` : ""}
					</span>
					{hasNext ? (
						<button
							onClick={() => load(page + 1)}
							className="rounded border px-3 py-1 hover:bg-gray-50 dark:hover:bg-gray-800"
						>
							Older ↗
						</button>
					) : (
						<span />
					)}
				</div>
			)}
			<div className="mt-10">
				<Link
					href="/"
					className="rounded border px-3 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
				>
					← Back to Home
				</Link>
			</div>
		</main>
	);
}
