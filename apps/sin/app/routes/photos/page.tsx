import { useEffect, useRef, useState } from "react";
import type { Route } from "./+types/page";

type Photo = { src: string; alt?: string; caption?: string; w?: number; h?: number };

export function meta(_props: Route.MetaArgs) {
	return [
		{ title: "Photos – sinsin" },
		{ name: "description", content: "Photo gallery" },
	];
}

// Load list from public JSON so it’s editable without rebuild
export async function clientLoader() {
	const res = await fetch("/api/photos");
	if (!res.ok) return { photos: [] as Photo[] };
	return (await res.json()) as { photos: Photo[] };
}

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const apiUrl = new URL("/api/photos", request.url);
    const res = await fetch(apiUrl.toString());
    if (!res.ok) return { photos: [] as Photo[] };
    return (await res.json()) as { photos: Photo[] };
  } catch {
    return { photos: [] as Photo[] };
  }
}

export default function PhotosPage({ loaderData }: Route.ComponentProps) {
  const { photos } = (loaderData as { photos: Photo[] }) ?? { photos: [] };
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const active = activeIndex != null ? photos[activeIndex] : null;
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (activeIndex == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowRight") setActiveIndex((i) => (i == null ? i : Math.min(i + 1, photos.length - 1)));
      if (e.key === "ArrowLeft") setActiveIndex((i) => (i == null ? i : Math.max(i - 1, 0)));
      if (e.key === "Tab") {
        // basic focus trap among prev, next, close
        const order = [prevRef.current, nextRef.current, closeRef.current].filter(Boolean) as HTMLButtonElement[];
        if (order.length === 0) return;
        const current = document.activeElement as HTMLElement | null;
        const idx = order.findIndex((el) => el === current);
        e.preventDefault();
        if (e.shiftKey) {
          const target = order[(idx - 1 + order.length) % order.length];
          target?.focus();
        } else {
          const target = order[(idx + 1) % order.length];
          target?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    // focus close button initially
    setTimeout(() => closeRef.current?.focus(), 0);
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
			<h1 className="fluid-title font-semibold tracking-tight">Photos</h1>
			<p className="mt-2 text-gray-600 dark:text-gray-400">
				Click a photo to view larger.
			</p>
      <section className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-1">
        {photos.map((p, i) => (
          <button
            key={p.src + i}
            className=""
            onClick={() => setActiveIndex(i)}
            aria-label="Open photo"
          >
            <img
              src={p.src}
              alt={p.alt ?? ""}
              loading="lazy"
              className="block w-full h-auto"
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
          aria-label={active.caption || active.alt || "Photo viewer"}
        >
          <div className="relative" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onClick={(e) => e.stopPropagation()}>
            <button
              ref={closeRef}
              className="absolute right-2 top-2 z-10 rounded bg-white/80 px-2 py-1 text-sm text-gray-900 hover:bg-white focus:outline-none focus:ring-2 focus:ring-white dark:bg-gray-800/80 dark:text-gray-100"
              onClick={() => setActiveIndex(null)}
              aria-label="Close"
            >
              ✕
            </button>
            <img
              src={active.src}
              alt={active.alt ?? ""}
              className="max-h-[90vh] max-w-[90vw] rounded shadow-2xl"
            />
            <div className="absolute inset-x-0 bottom-2 mx-auto w-full max-w-[90vw] text-center">
              {(active.caption || active.alt) && (
                <div className="mx-auto inline-block rounded bg-black/60 px-3 py-1 text-sm text-white backdrop-blur">
                  {active.caption || active.alt}
                  <span className="ml-2 text-xs opacity-70">
                    ({(activeIndex ?? 0) + 1} / {photos.length})
                  </span>
                </div>
              )}
            </div>
            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 pointer-events-none">
              <button
                ref={prevRef}
                className="pointer-events-auto rounded bg-white/80 p-2 text-gray-900 hover:bg-white focus:outline-none focus:ring-2 focus:ring-white dark:bg-gray-800/80 dark:text-gray-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex((i) => (i == null ? i : Math.max(i - 1, 0)));
                }}
                aria-label="Previous"
              >
                ‹
              </button>
              <button
                ref={nextRef}
                className="pointer-events-auto rounded bg-white/80 p-2 text-gray-900 hover:bg-white focus:outline-none focus:ring-2 focus:ring-white dark:bg-gray-800/80 dark:text-gray-100"
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
