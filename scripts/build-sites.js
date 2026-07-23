import { build } from "vite";
import react from "@vitejs/plugin-react";
import { cp, rm } from "node:fs/promises";
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
await cp(path.join(root, "server"), path.join(dist, "server"), {
  recursive: true,
  filter: source => !source.endsWith(".test.js")
});
