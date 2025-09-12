import "react-router";
import { createRequestHandler } from "@react-router/express";
import express from "express";
import helmet from "helmet";
import { generateCspDirectives } from "./helmet";
import type { Request, Response } from "express";

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

// Minimal proxy + parser for Goodreads RSS
// Set GOODREADS_RSS_URL in .env to override default public feed
app.get("/api/books", async (_req: Request, res: Response) => {
    const rssUrl = process.env.GOODREADS_RSS_URL?.trim();
    if (!rssUrl) {
        return res.json({ items: [] });
    }
    try {
        const r = await fetch(rssUrl, { headers: { "User-Agent": "sintiasgraphy/1.0" } });
        if (!r.ok) throw new Error(`Bad status ${r.status}`);
        const xml = await r.text();

        // Naive XML parsing for <item> blocks
        const items: Array<{ title: string; link: string; pubDate?: string; image?: string }> = [];
        const itemRegex = /<item[\s\S]*?<\/item>/g;
        const titleRegex = /<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/i;
        const linkRegex = /<link>(.*?)<\/link>/i;
        const dateRegex = /<pubDate>(.*?)<\/pubDate>/i;
        const descImgRegex = /<description>[\s\S]*?<img[^>]*src=\"([^\"]+)\"/i;

        const blocks = xml.match(itemRegex) ?? [];
        for (const block of blocks) {
            const t = block.match(titleRegex);
            const l = block.match(linkRegex);
            const d = block.match(dateRegex);
            const di = block.match(descImgRegex);
            const title = (t?.[1] || t?.[2] || "").trim();
            const link = (l?.[1] || "").trim();
            const pubDate = d?.[1]?.trim();
            const image = di?.[1]?.trim();
            if (title && link) items.push({ title, link, pubDate, image });
        }
        res.json({ items });
    } catch (e) {
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
