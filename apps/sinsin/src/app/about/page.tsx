import type { Metadata } from "next";
import Link from "#/app/link";

export const metadata: Metadata = {
	title: "About – sinsin",
	description: "About Sintia Wati",
};

export default function AboutPage() {
	const linktreeUrl = process.env.NEXT_PUBLIC_LINKTREE_URL || "/contact";
	const githubUrl =
		process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/sintiasnn";
	const instagramUrl =
		process.env.NEXT_PUBLIC_INSTAGRAM_URL ||
		"https://www.instagram.com/ininininini/";
	const mediumUrl = process.env.NEXT_PUBLIC_MEDIUM_URL || "https://medium.com/";
	const linkedinUrl =
		process.env.NEXT_PUBLIC_LINKEDIN_URL ||
		"https://www.linkedin.com/in/your-handle/";
	return (
		<main className="mx-auto max-w-5xl px-4 py-10">
			<h1 className="text-2xl font-semibold tracking-tight">About</h1>
			<p
				className="mt-4 leading-relaxed text-gray-700 dark:text-gray-300"
				style={{ textAlign: "justify" }}
			>
				Hi! I’m Ni Putu Sintia Wati, an Infrastructure Engineer with over a year
				of experience in cloud infrastructure, automation, and observability. I
				focus on building scalable systems, optimizing developer workflows, and
				ensuring reliability through Infrastructure as Code, monitoring, and
				CI/CD. Beyond work, I enjoy improving old projects, reading, writing
				blogs based on my experiences, and capturing everyday moments through
				simple photography. This site is where I share my projects, thoughts,
				and snapshots. I’m committed to deepening my expertise in cloud
				infrastructure and observability, while continuing to explore new
				technologies.
			</p>

			{/* Blurb above the links */}
			<p className="mt-6 text-gray-700 dark:text-gray-300">
				For more details, feel free to visit the links below.
			</p>

			<section className="mt-4">
				<div className="flex flex-wrap gap-2">
					<Link
						href={githubUrl}
						newTab
						className="inline-flex items-center gap-1 rounded border px-3 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
					>
						<svg
							aria-hidden="true"
							viewBox="0 0 16 16"
							width="14"
							height="14"
							fill="currentColor"
						>
							<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-2.09 2.2-2.09.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.45.55.38C13.71 14.53 16 11.54 16 8c0-4.42-3.58-8-8-8z" />
						</svg>
						GitHub ↗
					</Link>
					<Link
						href={instagramUrl}
						newTab
						className="inline-flex items-center gap-1 rounded border px-3 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
					>
						<svg
							aria-hidden="true"
							viewBox="0 0 24 24"
							width="14"
							height="14"
							fill="currentColor"
						>
							<path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3a6 6 0 1 1 0 12 6 6 0 0 1 0-12zm0 2.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM18 6.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
						</svg>
						Instagram ↗
					</Link>
					<Link
						href={mediumUrl}
						newTab
						className="inline-flex items-center gap-1 rounded border px-3 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
					>
						<svg
							aria-hidden="true"
							viewBox="0 0 24 24"
							width="14"
							height="14"
							fill="currentColor"
						>
							<circle cx="6" cy="12" r="4" />
							<rect x="10" y="8" width="6" height="8" rx="1" />
							<circle cx="19" cy="12" r="2" />
						</svg>
						Medium ↗
					</Link>
					<Link
						href={linkedinUrl}
						newTab
						className="inline-flex items-center gap-1 rounded border px-3 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
					>
						<svg
							aria-hidden="true"
							viewBox="0 0 24 24"
							width="14"
							height="14"
							fill="currentColor"
						>
							<path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V23h-4V8.5zM8.5 8.5h3.8v2h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V23h-4v-5.9c0-1.4-.02-3.2-1.95-3.2-1.95 0-2.25 1.52-2.25 3.1V23h-4V8.5z" />
						</svg>
						LinkedIn ↗
					</Link>
					<Link
						href={linktreeUrl}
						newTab={/^https?:/i.test(linktreeUrl)}
						className="inline-flex items-center gap-1 rounded border px-3 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
					>
						<svg
							aria-hidden="true"
							viewBox="0 0 24 24"
							width="14"
							height="14"
							fill="currentColor"
						>
							<path d="M7 11h10v2H7zM4 7h16v2H4zM10 15h4v2h-4z" />
						</svg>
						Linktree ↗
					</Link>
				</div>
			</section>

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
