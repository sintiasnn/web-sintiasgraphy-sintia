import { useEffect, useState } from "react";
import type { Route } from "./+types/page";

type Photo = { src: string; alt?: string; w?: number; h?: number };

export function meta(_props: Route.MetaArgs) {
	return [
		{ title: "Photos – sinsin" },
		{ name: "description", content: "Photo gallery" },
	];
}

// Load list from public JSON so it’s editable without rebuild
export async function clientLoader() {
	const res = await fetch("/photos.json");
	if (!res.ok) return { photos: [] as Photo[] };
	return (await res.json()) as { photos: Photo[] };
}

export default function PhotosPage({ loaderData }: Route.ComponentProps) {
  const { photos } = (loaderData as { photos: Photo[] }) ?? { photos: [] };
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const active = activeIndex != null ? photos[activeIndex] : null;

  useEffect(() => {
    if (activeIndex == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowRight") setActiveIndex((i) => (i == null ? i : Math.min(i + 1, photos.length - 1)));
      if (e.key === "ArrowLeft") setActiveIndex((i) => (i == null ? i : Math.max(i - 1, 0)));
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [activeIndex, photos.length]);

  // simple swipe support
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => setTouchStartX(e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX == null || activeIndex == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const threshold = 40;
    if (dx > threshold) setActiveIndex(Math.max(0, activeIndex - 1));
    if (dx < -threshold) setActiveIndex(Math.min(photos.length - 1, activeIndex + 1));
    setTouchStartX(null);
  };

  return (
		<main className="mx-auto max-w-6xl px-4 py-10">
			<h1 className="text-2xl font-semibold tracking-tight">Photos</h1>
			<p className="mt-2 text-gray-600 dark:text-gray-400">
				Click a photo to view larger.
			</p>
			<section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {photos.map((p, i) => (
          <button
            key={p.src + i}
            className="group overflow-hidden rounded bg-gray-100 dark:bg-gray-800"
            onClick={() => setActiveIndex(i)}
            aria-label="Open photo"
          >
						<img
							src={p.src}
							alt={p.alt ?? ""}
							loading="lazy"
							className="aspect-square w-full object-cover transition duration-300 group-hover:scale-105"
						/>
					</button>
				))}
			</section>

      {active && (
        <div
          className="fixed inset-0 z-40 grid place-items-center bg-black/70 p-4"
          onClick={() => setActiveIndex(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <img
              src={active.src}
              alt={active.alt ?? ""}
              className="max-h-[90vh] max-w-[90vw] rounded shadow-2xl"
            />
            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2">
              <button
                className="rounded bg-white/70 p-2 text-gray-900 hover:bg-white dark:bg-gray-800/70 dark:text-gray-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex((i) => (i == null ? i : Math.max(i - 1, 0)));
                }}
                aria-label="Previous"
              >
                ‹
              </button>
              <button
                className="rounded bg-white/70 p-2 text-gray-900 hover:bg-white dark:bg-gray-800/70 dark:text-gray-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex((i) => (i == null ? i : Math.min(i + 1, photos.length - 1)));
                }}
                aria-label="Next"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      )}
		</main>
	);
}
