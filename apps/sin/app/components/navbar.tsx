import { Link } from "#/components/link";
import { useLocation } from "react-router";

const nav = [
	{ name: "Home", href: "/" },
	{ name: "About", href: "/about" },
	{ name: "Blog", href: "/blog" },
	{ name: "Photos", href: "/photos" },
  { name: "Projects", href: "/projects" },
	{ name: "Contact", href: "/contact" },
];

export function Navbar() {
  const location = useLocation();
  const isActive = (href: string) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);
	return (
		<nav className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-900/70">
			<div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-6 px-4">
				<Link
					href="/"
					className="font-semibold tracking-tight text-gray-900 dark:text-gray-100"
				>
					sintiasgraphy
				</Link>
				<div className="flex flex-wrap items-center gap-4 text-sm text-gray-700 dark:text-gray-300">
					{nav.map((n) => {
            const active = isActive(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={
                  (active
                    ? "text-gray-900 dark:text-white font-medium"
                    : "text-gray-700 dark:text-gray-300") +
                  " hover:text-gray-900 dark:hover:text-white"
                }
              >
                {n.name}
              </Link>
            );
          })}
				</div>
			</div>
		</nav>
	);
}
