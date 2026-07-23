import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequestHandler } from "./app.js";
import { openDatabase } from "./database.js";

const serverDir = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(process.env.PUBLIC_DIR || path.join(serverDir, "..", "public"));
const database = openDatabase();
const handler = createRequestHandler({ database, publicDir });
const port = Number(process.env.PORT || 3000);

createServer((request, response) => {
  Promise.resolve(handler(request, response)).catch(error => {
    console.error(error);
    if (!response.headersSent) response.writeHead(500, { "content-type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ error: "Internal server error" }));
  });
}).listen(port, "127.0.0.1", () => console.log(`ZlabScholar API listening on ${port}`));
