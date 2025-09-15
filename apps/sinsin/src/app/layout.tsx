import "../styles/global.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type * as React from "react";
import { clx } from "#/libs/utils";
import Navbar from "./navbar";
import Footer from "./footer";

// Load the optimized fonts from Google Fonts
const fontSans = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "sinsin — Home",
    template: "sinsin — %s",
  },
  description: "Personal site of Ni Putu Sintia Wati: photos, projects, and notes.",
};

export default function RootLayout({ children }: React.PropsWithChildren) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				{/* Initialize theme early to avoid flash */}
				<script
					dangerouslySetInnerHTML={{
						__html:
							"(() => { try { const t = localStorage.getItem('theme'); const m = window.matchMedia('(prefers-color-scheme: dark)').matches; const isDark = t ? t === 'dark' : m; const root = document.documentElement; if (isDark) root.setAttribute('data-theme','dark'); else root.removeAttribute('data-theme'); } catch(_) {} })();",
					}}
				/>
			</head>
			<body suppressHydrationWarning className={clx(fontSans.variable, "antialiased min-h-dvh flex flex-col")}> 
				<Navbar />
				<main id="content" role="main" className="flex-1">{children}</main>
				<Footer />
			</body>
		</html>
	);
}
