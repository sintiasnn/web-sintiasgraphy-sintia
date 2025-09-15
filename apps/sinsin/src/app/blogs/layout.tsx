import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = { title: "Blogs" };

export default function BlogsLayout({ children }: { children: ReactNode }) {
  return children;
}

