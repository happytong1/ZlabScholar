import { createReadStream, statSync } from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const papersRoot = path.resolve(process.cwd(), "papers");

function localPapers() {
  return {
    name: "local-papers",
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        let pathname;
        try {
          pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
        } catch {
          next();
          return;
        }
        if (!pathname.startsWith("/papers/")) {
          next();
          return;
        }
        const relativePath = pathname.slice("/papers/".length);
        const absolutePath = path.resolve(papersRoot, relativePath);
        if (!absolutePath.startsWith(`${papersRoot}${path.sep}`)) {
          response.statusCode = 403;
          response.end("Forbidden");
          return;
        }
        try {
          if (!statSync(absolutePath).isFile()) throw new Error("Not a file");
          response.setHeader("Content-Type", "application/pdf");
          response.setHeader("Content-Disposition", `attachment; filename*=UTF-8''${encodeURIComponent(path.basename(absolutePath))}`);
          createReadStream(absolutePath).pipe(response);
        } catch {
          next();
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), localPapers()],
  server: {
    proxy: {
      "/api": "http://127.0.0.1:3000"
    }
  }
});
