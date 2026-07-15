import { build } from "vite";
import react from "@vitejs/plugin-react";
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const publicDir = path.join(dist, "public");

await rm(dist, { recursive: true, force: true });
await build({
  root,
  plugins: [react()],
  build: { outDir: publicDir, emptyOutDir: true }
});

async function collect(directory, base = directory, files = {}) {
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, item.name);
    if (item.isDirectory()) await collect(absolute, base, files);
    else files[`/${path.relative(base, absolute).replaceAll(path.sep, "/")}`] = await readFile(absolute, "utf8");
  }
  return files;
}

const assets = await collect(publicDir);
const server = `
import { createServer } from "node:http";
import { pathToFileURL } from "node:url";

const assets = ${JSON.stringify(assets)};
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml" };

function pathnameOf(value) {
  try { return new URL(value, "http://localhost").pathname; } catch { return "/"; }
}

function assetFor(pathname) {
  const key = pathname === "/" ? "/index.html" : pathname;
  return { key: assets[key] === undefined ? "/index.html" : key, body: assets[key] ?? assets["/index.html"] };
}

function contentType(key) {
  const dot = key.slice(key.lastIndexOf("."));
  return types[dot] || "text/plain; charset=utf-8";
}

export async function fetch(request) {
  const { key, body } = assetFor(pathnameOf(request.url));
  return new Response(body, { status: 200, headers: { "content-type": contentType(key), "cache-control": key === "/index.html" ? "no-cache" : "public, max-age=31536000, immutable" } });
}

export default { fetch };

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PORT || 3000);
  createServer((req, res) => {
    const { key, body } = assetFor(pathnameOf(req.url));
    res.writeHead(200, { "content-type": contentType(key), "cache-control": key === "/index.html" ? "no-cache" : "public, max-age=31536000, immutable" });
    res.end(body);
  }).listen(port, "0.0.0.0", () => console.log("ZlabScholar listening on " + port));
}
`;

await mkdir(path.join(dist, "server"), { recursive: true });
await writeFile(path.join(dist, "server", "index.js"), server);
