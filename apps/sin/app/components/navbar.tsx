import { Link } from "#/components/link";
import { useLocation } from "react-router";
import * as React from "react";

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

  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    // close menu on route change
    setOpen(false);
  }, [location.pathname]);

  return (
    <nav className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-900/70">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-6 px-4">
        <Link href="/" className="font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          sintiasgraphy
        </Link>
        {/* Desktop nav */}
        <div className="hidden items-center gap-4 text-sm text-gray-700 md:flex dark:text-gray-300">
          {nav.map((n) => {
            const active = isActive(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={(active ? "text-gray-900 dark:text-white font-medium" : "text-gray-700 dark:text-gray-300") + " hover:text-gray-900 dark:hover:text-white"}
              >
                {n.name}
              </Link>
            );
          })}
        </div>
        {/* Mobile toggle */}
        <button
          className="inline-flex items-center justify-center rounded border px-2 py-1 text-sm text-gray-700 md:hidden dark:border-gray-800 dark:text-gray-300"
          aria-controls="mobile-nav"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          Menu
        </button>
      </div>
      {/* Mobile panel */}
      <div
        id="mobile-nav"
        className={(open ? "max-h-96 opacity-100" : "max-h-0 opacity-0") + " overflow-hidden transition-all duration-300 md:hidden"}
      >
        <div className="mx-auto grid max-w-5xl gap-2 px-4 pb-4 pt-2 text-sm">
          {nav.map((n) => {
            const active = isActive(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={(active ? "text-gray-900 dark:text-white font-medium" : "text-gray-700 dark:text-gray-300") + " rounded px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-800"}
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
