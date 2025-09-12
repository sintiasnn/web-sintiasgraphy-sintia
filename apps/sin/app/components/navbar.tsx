import { Link } from "#/components/link";

const nav = [
	{ name: "Home", href: "/" },
	{ name: "About", href: "/about" },
	{ name: "Blog", href: "/blog" },
	{ name: "Photos", href: "/photos" },
	{ name: "Books", href: "/books" },
	{ name: "Contact", href: "/contact" },
];

export function Navbar() {
	return (
		<nav className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-900/70">
			<div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-6 px-4">
				<Link
					href="/"
					className="font-semibold tracking-tight text-gray-900 dark:text-gray-100"
				>
					sinsin
				</Link>
				<div className="flex flex-wrap items-center gap-4 text-sm text-gray-700 dark:text-gray-300">
					{nav.map((n) => (
						<Link
							key={n.href}
							href={n.href}
							className="hover:text-gray-900 dark:hover:text-white"
						>
							{n.name}
						</Link>
					))}
				</div>
			</div>
		</nav>
	);
}
