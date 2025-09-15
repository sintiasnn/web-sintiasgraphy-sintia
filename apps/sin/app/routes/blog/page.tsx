import { useEffect, useMemo, useState } from "react";
import { useNavigation, useSearchParams } from "react-router";
import { Link } from "#/components/link";
import type { Route } from "./+types/page";

export function meta(_props: Route.MetaArgs) {
	return [
		{ title: "Blog – sinsin" },
		{ name: "description", content: "Posts and notes" },
	];
}

type MediumItem = {
	title: string;
	link: string;
	pubDate?: string;
	image?: string;
	snippet?: string;
};

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
	const url = new URL(request.url);
	const page = url.searchParams.get("page") ?? "1";
	const limit = url.searchParams.get("limit") ?? "12";
	try {
		const r = await fetch(
			`/api/medium?limit=${encodeURIComponent(limit)}&page=${encodeURIComponent(page)}`,
		);
		if (!r.ok) return { items: [] as MediumItem[] };
		return (await r.json()) as {
			items: MediumItem[];
			total?: number;
			page?: number;
			pageCount?: number;
			limit?: number;
		};
	} catch {
		return { items: [] as MediumItem[] };
	}
}

export default function BlogPage({ loaderData }: Route.ComponentProps) {
	const data = (loaderData as {
		items: MediumItem[];
		total?: number;
		page?: number;
		pageCount?: number;
		limit?: number;
	}) ?? { items: [] };
	const { items, total, page, pageCount, limit } = data;
	const hasPrev = (page ?? 1) > 1;
	const hasNext = (pageCount ?? 1) > (page ?? 1);
	const navigation = useNavigation();
	const isLoading = navigation.state !== "idle";
	const [params] = useSearchParams();
	const currentLimit = Number(params.get("limit") || (limit ?? 12)) || 12;
	const skeletonCount = Math.min(currentLimit, 12);
	const [showRefreshed, setShowRefreshed] = useState(false);
	useEffect(() => {
		if (params.get("refresh") === "1") {
			setShowRefreshed(true);
			const t = setTimeout(() => setShowRefreshed(false), 1800);
			return () => clearTimeout(t);
		}
	}, [params]);
	return (
		<main className="mx-auto max-w-3xl px-4 py-10">
			{showRefreshed && (
				<div className="mb-3 rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800 dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-300">
					Feed refreshed
				</div>
			)}
			<div className="mb-4 flex items-center justify-between gap-3">
				<h1 className="text-2xl font-semibold tracking-tight">Blog</h1>
				<Link
					href={`/blog?refresh=1&page=${page ?? 1}&limit=${limit ?? 12}`}
					className="rounded border px-3 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
				>
					Refresh
				</Link>
			</div>
			<ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
				{isLoading
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
										View on Medium ↗
									</a>
								</div>
							</li>
						))}
				{items.length === 0 && (
					<li className="flex flex-col items-center justify-center gap-3 rounded border p-6 text-gray-600 dark:border-gray-800 dark:text-gray-400">
						<span>No posts yet.</span>
						<Link
							href="/blog?refresh=1"
							className="rounded border px-3 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
						>
							Retry
						</Link>
					</li>
				)}
			</ul>
			{pageCount && pageCount > 1 && (
				<div className="mt-8 flex items-center justify-between text-sm">
					{hasPrev ? (
						<Link
							href={`/blog?page=${(page ?? 2) - 1}&limit=${limit ?? 12}`}
							className="rounded border px-3 py-1 hover:bg-gray-50 dark:hover:bg-gray-800"
						>
							← Newer
						</Link>
					) : (
						<span />
					)}
					<span className="text-gray-600 dark:text-gray-400">
						Page {page ?? 1}
						{total ? ` of ${pageCount}` : ""}
					</span>
					{hasNext ? (
						<Link
							href={`/blog?page=${(page ?? 1) + 1}&limit=${limit ?? 12}`}
							className="rounded border px-3 py-1 hover:bg-gray-50 dark:hover:bg-gray-800"
						>
							Older ↗
						</Link>
					) : (
						<span />
					)}
				</div>
			)}
		</main>
	);
}

export async function loader({ request }: Route.LoaderArgs) {
	try {
		const reqUrl = new URL(request.url);
		const page = reqUrl.searchParams.get("page") ?? "1";
		const limit = reqUrl.searchParams.get("limit") ?? "12";
		const refresh = reqUrl.searchParams.get("refresh");
		const apiUrl = new URL(
			`/api/medium?limit=${encodeURIComponent(limit)}&page=${encodeURIComponent(page)}${refresh ? "&noCache=1" : ""}`,
			request.url,
		);
		const r = await fetch(apiUrl.toString());
		if (!r.ok) return { items: [] as MediumItem[] };
		return (await r.json()) as {
			items: MediumItem[];
			total?: number;
			page?: number;
			pageCount?: number;
			limit?: number;
		};
	} catch {
		return { items: [] as MediumItem[] };
	}
}
