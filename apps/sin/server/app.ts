import "react-router";
import { createRequestHandler } from "@react-router/express";
import type { Request, Response } from "express";
import express from "express";
import helmet from "helmet";
import { generateCspDirectives } from "./helmet";

declare module "react-router" {
	interface AppLoadContext {
		VALUE_FROM_EXPRESS: string;
	}
}

export const app = express();

app.use(
	helmet({
		xPoweredBy: false,
		contentSecurityPolicy: {
			directives: generateCspDirectives(),
		},
	}),
);

// Silence Chrome DevTools probe path to avoid noisy 404 logs in dev
app.all("/.well-known/appspecific/com.chrome.devtools.json", (_req, res) => {
    res.status(204).end();
});

// Serve photos manifest from public reliably (avoids any dev static quirks)
import { readFile } from "node:fs/promises";
import { resolve as resolvePath } from "node:path";
import { fileURLToPath } from "node:url";
app.get("/api/photos", async (_req: Request, res: Response) => {
    try {
        // Resolve relative to this module's file location to avoid cwd issues
        const here = fileURLToPath(import.meta.url);
        const base = resolvePath(here, "../");
        const p = resolvePath(base, "../public/photos.json");
        const raw = await readFile(p, "utf8");
        res.setHeader("Content-Type", "application/json");
        return res.send(raw);
    } catch (e) {
        if (process.env.NODE_ENV !== "production") console.error("/api/photos error:", e);
        return res.json({ photos: [] });
    }
});

// Serve experience list from public
app.get("/api/experience", async (_req: Request, res: Response) => {
    try {
        const here = fileURLToPath(import.meta.url);
        const base = resolvePath(here, "../");
        const p = resolvePath(base, "../public/experience.json");
        const raw = await readFile(p, "utf8");
        res.setHeader("Content-Type", "application/json");
        return res.send(raw);
    } catch (e) {
        if (process.env.NODE_ENV !== "production") console.error("/api/experience error:", e);
        return res.json({ items: [] });
    }
});

// GitHub projects proxy (lists user repos)
type GhRepo = {
    name: string;
    full_name?: string;
    description?: string | null;
    html_url: string;
    homepage?: string | null;
    topics?: string[];
    language?: string | null;
    fork?: boolean;
    pushed_at?: string | null;
    updated_at?: string | null;
};
const ghCache: Record<string, { at: number; items: Array<{ title: string; description?: string; link?: string; tags?: string[]; updated?: string; image?: string }> }> = {};
const GH_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

app.get("/api/projects", async (req: Request, res: Response) => {
    const username = process.env.GITHUB_USERNAME?.trim() || "sintiasnn";
    const token = process.env.GITHUB_TOKEN?.trim();
    const limitParam = Number.parseInt((req.query.limit as string) || "");
    const includeForks = (req.query.includeForks as string) === "1";
    const noCache = (req.query.noCache as string) === "1" || (req.query.refresh as string) === "1";
    const namesParam = (req.query.names as string) || "";
    const envFeatured = (process.env.GITHUB_FEATURED_REPOS || "").trim();
    const featuredNames = (namesParam || envFeatured)
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
    const limit = Number.isFinite(limitParam) && limitParam > 0 ? limitParam : undefined;

    const key = `${username}`;
    const now = Date.now();
    const cached = ghCache[key];

    try {
        let items: Array<{ title: string; description?: string; link?: string; tags?: string[]; updated?: string; image?: string }> = [];

        if (!noCache && cached && now - cached.at < GH_CACHE_TTL_MS) {
            items = cached.items;
        } else {
            const url = new URL(`https://api.github.com/users/${encodeURIComponent(username)}/repos`);
            url.searchParams.set("type", "owner");
            url.searchParams.set("sort", "updated");
            url.searchParams.set("per_page", "100");
            const r = await fetch(url.toString(), {
                headers: {
                    "User-Agent": "sinsin/1.0",
                    Accept: "application/vnd.github+json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    "X-GitHub-Api-Version": "2022-11-28",
                },
            });
            if (!r.ok) {
                if (process.env.NODE_ENV !== "production") console.error("/api/projects GitHub response:", r.status, await r.text());
                return res.json({ items: [] });
            }
            const repos = (await r.json()) as GhRepo[];
            let filtered = (repos || []).filter((repo) => includeForks ? true : !repo.fork);
            if (featuredNames.length > 0) {
                const set = new Set(featuredNames);
                filtered = filtered.filter((repo) => set.has(repo.name.toLowerCase()) || (repo.full_name && set.has(repo.full_name.toLowerCase())));
                // preserve order according to featuredNames
                filtered.sort((a, b) => {
                    const ia = featuredNames.indexOf((a.full_name || a.name).toLowerCase());
                    const ib = featuredNames.indexOf((b.full_name || b.name).toLowerCase());
                    return ia - ib;
                });
            }
            items = filtered.map((repo) => {
                    const title = repo.name;
                    const description = repo.description ?? undefined;
                    const link = (repo.homepage && repo.homepage.trim()) || repo.html_url;
                    const stack = [
                        ...(repo.language ? [repo.language] : []),
                        ...((repo.topics && repo.topics.length ? repo.topics : []) as string[]),
                    ]
                        .map((s) => (s || "").toString().trim())
                        .filter(Boolean);
                    const uniq = Array.from(new Set(stack));
                    const tags = uniq.length ? uniq : undefined;
                    const updated = (repo.pushed_at || repo.updated_at || undefined) ?? undefined;
                    return { title, description, link, tags, updated };
                });
            ghCache[key] = { at: now, items };
        }

        if (limit) return res.json({ items: items.slice(0, limit) });
        return res.json({ items });
    } catch (e) {
        if (process.env.NODE_ENV !== "production") console.error("/api/projects error:", e);
        return res.json({ items: [] });
    }
});

// Medium feed to JSON (via medium-article-api with RSS fallback)
// Env: MEDIUM_USERNAME (e.g. wahyuivan) or MEDIUM_FEED_URL (e.g. https://medium.com/feed/@wahyuivan)
// Simple in-memory cache for Medium results
const mediumCache: Record<string, { at: number; items: Array<{ title: string; link: string; pubDate?: string; image?: string; snippet?: string }> }> = {};
const MEDIUM_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

app.get("/api/medium", async (req: Request, res: Response) => {
    const username = process.env.MEDIUM_USERNAME?.trim();
    const feedUrlEnv = process.env.MEDIUM_FEED_URL?.trim();
    const feedUrl = feedUrlEnv || (username ? `https://medium.com/feed/@${username}` : undefined);
    if (!feedUrl) return res.json({ items: [] });

    // pagination params
    const limitParam = Number.parseInt((req.query.limit as string) || "");
    const pageParam = Number.parseInt((req.query.page as string) || "1");
    const noCache = (req.query.noCache as string) === "1" || (req.query.refresh as string) === "1";
    const limit = Number.isFinite(limitParam) && limitParam > 0 ? limitParam : undefined;
    const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

    const key = feedUrl;
    const now = Date.now();
    const cached = mediumCache[key];

    try {
        let items: Array<{ title: string; link: string; pubDate?: string; image?: string; snippet?: string }>; 

        if (!noCache && cached && now - cached.at < MEDIUM_CACHE_TTL_MS) {
            items = cached.items;
        } else {
            // try medium-article-api first
            try {
                const mod: any = await import("medium-article-api");
                const getArticles = mod?.default || mod;
                const posts: any[] = await getArticles(username);
                items = (posts || [])
                    .map((p: any) => {
                        const title = (p.title || p.name || "").toString();
                        const link = (p.link || p.url || p.guid || "").toString();
                        const pubDate = (p.pubDate || p.date || p.createdAt || p.publishedAt || "").toString();
                        const image = (p.thumbnail || p.image || p.coverImage || (p.enclosure && p.enclosure.url) || "").toString();
                        const snippet = (p.subtitle || p.description || p.contentSnippet || "").toString();
                        return { title, link, pubDate, image, snippet };
                    })
                    .filter((x: any) => x.title && x.link);
            } catch (_err) {
                // fallback: fetch RSS
                const r = await fetch(feedUrl, {
                    headers: {
                        "User-Agent": "sinsin/1.0",
                        Accept: "application/rss+xml, application/xml;q=0.9, */*;q=0.8",
                    },
                });
                const xml = await r.text();
                const itemRegex = /<item[\s\S]*?<\/item>/g;
                const titleRegex = /<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/i;
                const linkRegex = /<link>(.*?)<\/link>/i;
                const dateRegex = /<pubDate>(.*?)<\/pubDate>/i;
                const contentRegex = /<content:encoded>([\s\S]*?)<\/content:encoded>/i;
                items = [];
                for (const block of xml.match(itemRegex) ?? []) {
                    const t = block.match(titleRegex);
                    const l = block.match(linkRegex);
                    const d = block.match(dateRegex);
                    const c = block.match(contentRegex)?.[1] ?? "";
                    const imgMatch = c.match(/<img[^>]*src=(?:\"|&quot;|')([^\"'&<>]+)(?:\"|&quot;|')/i);
                    const title = (t?.[1] || t?.[2] || "").trim();
                    const link = (l?.[1] || "").trim();
                    const pubDate = d?.[1]?.trim();
                    const image = imgMatch?.[1]?.replace(/&amp;/g, "&");
                    const snippet = c.replace(/<[^>]+>/g, " ").slice(0, 180).trim();
                    if (title && link) (items as any).push({ title, link, pubDate, image, snippet });
                }
            }
            mediumCache[key] = { at: now, items };
        }

        if (limit) {
            const total = items.length;
            const pageCount = Math.max(1, Math.ceil(total / limit));
            const current = Math.min(page, pageCount);
            const start = (current - 1) * limit;
            const slice = items.slice(start, start + limit);
            return res.json({ items: slice, total, page: current, pageCount, limit });
        }

        res.json({ items });
    } catch (e) {
        if (process.env.NODE_ENV !== "production") console.error("/api/medium error:", e);
        res.status(200).json({ items: [] });
    }
});

app.use(
	createRequestHandler({
		build: () => import("virtual:react-router/server-build"),
		getLoadContext() {
			return {
				VALUE_FROM_EXPRESS: "Hello from Express",
			};
		},
	}),
);
