import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "sinsin — Home",
	description:
		"Personal site of Ni Putu Sintia Wati: photos, projects, and notes.",
};

type Experience = {
	title: string;
	company: string;
	companyUrl?: string;
	start: string;
	end?: string | null;
	type?: string;
	stack?: string[];
};

type Involvement = {
	title: string;
	event?: string; // prefer event name
	org?: string; // backward compatibility
	orgUrl?: string;
	start?: string;
	end?: string | null;
	tags?: string[];
};

import { readFile } from "node:fs/promises";
import { resolve as resolvePath } from "node:path";

async function getData() {
	try {
		const base = process.cwd();
		const [exRaw, comRaw] = await Promise.all([
			readFile(resolvePath(base, "public/experience.json"), "utf8"),
			readFile(resolvePath(base, "public/community.json"), "utf8"),
		]);
		const items = (JSON.parse(exRaw)?.items ?? []) as Experience[];
		const community = (JSON.parse(comRaw)?.items ?? []) as Involvement[];
		return { items, community } as {
			items: Experience[];
			community: Involvement[];
		};
	} catch {
		return { items: [] as Experience[], community: [] as Involvement[] };
	}
}

function Welcome() {
	return (
		<section className="mx-auto max-w-3xl px-4 py-10 min-h-[calc(100dvh-56px)] flex flex-col justify-center gap-8 md:gap-10 lg:gap-12">
			<header className="w-full">
				<h1 className="text-2xl font-semibold tracking-tight">
					Hi, I’m Sintia.
				</h1>
				<p className="fluid-subtitle mt-3 max-w-2xl leading-relaxed text-gray-700 dark:text-gray-300">
					an Infrastructure Engineer passionate about cloud, automation, and
					observability. I build scalable systems, share some projects, and
					capture the moments through blogs and photos.
				</p>
			</header>

			<section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 justify-items-stretch auto-rows-fr">
				<a
					href="/projects"
					className="block h-full rounded border p-4 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/40"
				>
					<h2 className="font-medium">Projects</h2>
					<p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
						Selected small experiments.
					</p>
				</a>
				<a
					href="/blogs"
					className="block h-full rounded border p-4 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/40"
				>
					<h2 className="font-medium">Blogs</h2>
					<p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
						Notes, updates, and longer posts.
					</p>
				</a>
				<a
					href="/photos"
					className="block h-full rounded border p-4 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/40"
				>
					<h2 className="font-medium">Photos</h2>
					<p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
						A growing gallery with a simple lightbox.
					</p>
				</a>
			</section>
		</section>
	);
}

export default async function Page() {
	const { items, community } = await getData();
	return (
		<>
			<Welcome />
			{(items.length > 0 || community.length > 0) && (
				<section
					id="experience"
					className="mx-auto max-w-5xl px-4 min-h-[calc(100dvh-56px)] flex flex-col justify-center py-10"
				>
					<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
						{items.length > 0 && (
							<div>
								<h2 className="text-lg font-semibold tracking-tight">
									Work Experience
								</h2>
								<ul className="mt-4 space-y-4">
									{items.map((ex, idx) => {
										const start = ex.start || "";
										const end = ex.end || "Present";
										return (
											<li
												key={idx}
												className="rounded border p-3 sm:p-4 dark:border-gray-800"
											>
												<div className="flex items-baseline justify-between gap-3">
													<div>
														<div className="font-medium">
															{ex.title}{" "}
															{ex.company && (
																<>
																	<span className="text-gray-500"> · </span>
																	{ex.companyUrl ? (
																		<a
																			href={ex.companyUrl}
																			target="_blank"
																			rel="noopener noreferrer"
																			className="hover:underline"
																		>
																			{ex.company}
																		</a>
																	) : (
																		<span>{ex.company}</span>
																	)}
																</>
															)}
														</div>
														{ex.type && (
															<div className="text-xs text-gray-500 dark:text-gray-400">
																{ex.type}
															</div>
														)}
													</div>
													{(start || end) && (
														<div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
															{start} – {end}
														</div>
													)}
												</div>
												{ex.stack && ex.stack.length > 0 && (
													<div className="mt-3 flex flex-wrap gap-2">
														{ex.stack.map((t, i) => (
															<span
																key={t + i}
																className="rounded bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-800"
															>
																{t}
															</span>
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
								<h2 className="text-lg font-semibold tracking-tight">
									Community Involvement
								</h2>
								<ul className="mt-4 space-y-4">
									{community.map((co, idx) => {
										const start = (co.start || "").trim();
										const end = (co.end || "").trim();
										let dateLabel = "";
										if (start && end)
											dateLabel = start === end ? start : `${start} – ${end}`;
										else if (start) dateLabel = start;
										else if (end) dateLabel = end;
										return (
											<li
												key={idx}
												className="rounded border p-3 sm:p-4 dark:border-gray-800"
											>
												<div className="flex items-baseline justify-between gap-3">
													<div>
														<div className="font-medium">
															{co.title} {(() => {
																const name = co.event || co.org;
																if (!name) return null;
																return (
																	<>
																		<span className="text-gray-500"> · </span>
																		{co.orgUrl ? (
																			<a
																				href={co.orgUrl}
																				target="_blank"
																				rel="noopener noreferrer"
																				className="hover:underline"
																			>
																				{name}
																			</a>
																		) : (
																			<span>{name}</span>
																		)}
																	</>
																);
															})()}
														</div>
													</div>
													{dateLabel && (
														<div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
															{dateLabel}
														</div>
													)}
												</div>
												{co.tags && co.tags.length > 0 && (
													<div className="mt-3 flex flex-wrap gap-2">
														{co.tags.map((t, i) => (
															<span
																key={t + i}
																className="rounded bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-800"
															>
																{t}
															</span>
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
