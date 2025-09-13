#!/usr/bin/env node --no-warnings

import os from "node:os";
import compression from "compression";
import consola from "consola";
import express from "express";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";

// Ensure .env from the app directory is loaded regardless of where the command is run
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
loadEnv({ path: resolve(__dirname, ".env") });
// Optional fallback: also try repo root .env without overriding existing values
loadEnv({ path: resolve(__dirname, "../../.env"), override: false });

// Short-circuit the type-checking of the built output.
const BUILD_PATH = resolve("build/server/index.js");
const PORT = Number.parseInt(process.env.PORT || "3000");

const app = express();

app.use(compression({ level: 6, threshold: 0 }));
app.disable("x-powered-by");

if (process.env.ENABLE_RATE_LIMIT === "true") {
	app.use(
		rateLimit({
			windowMs: 60 * 1000 * 15, // 15 minutes
			max: 1000, // limit request for each IP per window
		}),
	);
}

if (process.env.NODE_ENV !== "production") {
	consola.withTag("server").log("Starting development server");
	const viteDevServer = await import("vite").then((vite) =>
		vite.createServer({
			server: { middlewareMode: true },
		}),
	);
	app.use(viteDevServer.middlewares);
	app.use(async (req, res, next) => {
		try {
			const source = await viteDevServer.ssrLoadModule("./server/app.ts");
			return await source.app(req, res, next);
		} catch (error) {
			if (typeof error === "object" && error instanceof Error) {
				viteDevServer.ssrFixStacktrace(error);
			}
			next(error);
		}
	});
} else {
	consola.withTag("server").log("Starting production server");

	app.use(
		"/assets",
		express.static("build/client/assets", {
			immutable: true,
			maxAge: "1y",
			setHeaders: (res, path) => {
				if (path.endsWith(".html")) {
					res.set("Cache-Control", "public, max-age=0, must-revalidate");
				}
			},
		}),
	);
	app.use(express.static("build/client", { maxAge: "1h" }));
	app.use(await import(BUILD_PATH).then((mod) => mod.app));
}

app.use(
	morgan("short", {
		skip: (req) => req.method === "HEAD",
		stream: {
			write: (message) => consola.withTag("server").log(message.trim()),
		},
	}),
);

function getLocalIpAddress() {
	return Object.values(os.networkInterfaces())
		.flat()
		.find((ip) => ip?.family === "IPv4" && !ip.internal)?.address;
}

const onListen = () => {
	const address = getLocalIpAddress();
	const localUrl = `http://localhost:${PORT}`;
	const networkUrl = address ? `http://${address}:${PORT}` : null;
	if (networkUrl) {
		consola.withTag("server").log(`Host: ${localUrl} (${networkUrl})`);
	} else {
		consola.withTag("server").log(localUrl);
	}
};

app.listen(PORT, () => onListen());
