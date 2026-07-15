import { build } from "vite";
import react from "@vitejs/plugin-react";
import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const publicDir = path.join(dist, "public");

await rm(dist, { recursive: true, force: true });
await build({
  root,
  configFile: false,
  plugins: [react()],
  build: { outDir: publicDir, emptyOutDir: true }
});

await cp(path.join(root, "papers"), path.join(publicDir, "papers"), { recursive: true });

const server = `
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml", ".pdf": "application/pdf" };
const publicDir = path.resolve(fileURLToPath(new URL("../public/", import.meta.url)));

function pathnameOf(value) {
  try { return decodeURIComponent(new URL(value, "http://localhost").pathname); } catch { return "/"; }
}

function fileFor(pathname) {
  const key = pathname === "/" ? "/index.html" : pathname;
  const absolute = path.resolve(publicDir, "." + key);
  if (!absolute.startsWith(publicDir + path.sep)) return null;
  return { key, absolute };
}

async function assetFor(pathname) {
  const requested = fileFor(pathname);
  try {
    if (!requested || !(await stat(requested.absolute)).isFile()) throw new Error("Not found");
    return { ...requested, body: await readFile(requested.absolute), status: 200 };
  } catch {
    if (pathname.startsWith("/papers/")) return { key: pathname, body: Buffer.from("Not found"), status: 404 };
    const fallback = fileFor("/index.html");
    return { ...fallback, body: await readFile(fallback.absolute), status: 200 };
  }
}

function contentType(key) {
  const dot = key.slice(key.lastIndexOf("."));
  return types[dot] || "text/plain; charset=utf-8";
}

function headersFor(key) {
  const headers = { "content-type": contentType(key), "cache-control": key === "/index.html" ? "no-cache" : "public, max-age=31536000, immutable" };
  if (key.toLowerCase().endsWith(".pdf")) headers["content-disposition"] = "attachment; filename*=UTF-8''" + encodeURIComponent(path.basename(key));
  return headers;
}

export async function fetch(request) {
  const { key, body, status } = await assetFor(pathnameOf(request.url));
  return new Response(body, { status, headers: headersFor(key) });
}

export default { fetch };

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PORT || 3000);
  createServer(async (req, res) => {
    try {
      const { key, body, status } = await assetFor(pathnameOf(req.url));
      res.writeHead(status, headersFor(key));
      res.end(body);
    } catch {
      res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
      res.end("Internal server error");
    }
  }).listen(port, "0.0.0.0", () => console.log("ZlabScholar listening on " + port));
}
`;

await mkdir(path.join(dist, "server"), { recursive: true });
await writeFile(path.join(dist, "server", "index.js"), server);
