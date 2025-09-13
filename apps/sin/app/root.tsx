import "./styles/global.css";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { isRouteErrorResponse } from "react-router";
import NotFound from "#/components/errors/404";
import InternalError from "#/components/errors/500";
import type { Route } from "./+types/root";
import { Navbar } from "#/components/navbar";
import { Footer } from "#/components/footer";

export const links: Route.LinksFunction = () => [
	{
		rel: "preconnect",
		href: "https://cdn.jsdelivr.net",
		crossOrigin: "anonymous",
	},
];

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
            <body suppressHydrationWarning={true}>
                <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:text-black dark:focus:bg-gray-800 dark:focus:text-white">Skip to content</a>
                <Navbar />
                <main id="content" role="main" className="mx-auto max-w-5xl px-4">
                    {children}
                </main>
                <Footer />
                <ScrollRestoration />
                <Scripts />
            </body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	const isError = isRouteErrorResponse(error);

	let message = "Oops!";
	let details = "An unexpected error occurred.";
	let stack: string | undefined;

	if (isError && error.status === 404) {
		return <NotFound />;
	}

	if (isError) {
		message = "Error";
		details = error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	return <InternalError message={message} details={details} stack={stack} />;
}
