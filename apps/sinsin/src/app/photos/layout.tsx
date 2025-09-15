import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = { title: "Photos" };

export default function PhotosLayout({ children }: { children: ReactNode }) {
  return children;
}

