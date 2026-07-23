import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { createSessionToken, hashSessionToken, verifyPassword } from "./security.js";
import { insertMember, listMembers, removeMember, updateMember } from "./members.js";

const COOKIE_NAME = "zlab_admin_session";
const SESSION_HOURS = 12;
const MAX_BODY_BYTES = 2 * 1024 * 1024;
const loginAttempts = new Map();

function json(response, status, value, headers = {}) {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers });
  response.end(JSON.stringify(value));
}

function parseCookies(request) {
  return Object.fromEntries(String(request.headers.cookie || "").split(";").map(value => value.trim()).filter(Boolean).map(value => {
    const index = value.indexOf("=");
    return index < 0 ? [value, ""] : [value.slice(0, index), decodeURIComponent(value.slice(index + 1))];
  }));
}

async function readJson(request) {
  let size = 0;
  const chunks = [];
  for await (const chunk of request) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw new Error("BODY_TOO_LARGE");
    chunks.push(chunk);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"); }
  catch { throw new Error("INVALID_JSON"); }
}

function cookie(token, secure) {
  const parts = [`${COOKIE_NAME}=${encodeURIComponent(token)}`, "Path=/", "HttpOnly", "SameSite=Lax", `Max-Age=${SESSION_HOURS * 3600}`];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

function clearCookie(secure) {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure ? "; Secure" : ""}`;
}

function currentAdmin(request, database) {
  const token = parseCookies(request)[COOKIE_NAME];
  if (!token) return null;
  return database.prepare(`
    SELECT admins.id, admins.username
    FROM admin_sessions JOIN admins ON admins.id = admin_sessions.admin_id
    WHERE admin_sessions.token_hash = ? AND admin_sessions.expires_at > ?
  `).get(hashSessionToken(token), new Date().toISOString()) || null;
}

function clientKey(request) {
  return String(request.headers["x-forwarded-for"] || request.socket.remoteAddress || "unknown").split(",")[0].trim();
}

function rateLimited(request) {
  const key = clientKey(request);
  const now = Date.now();
  const recent = (loginAttempts.get(key) || []).filter(time => now - time < 15 * 60 * 1000);
  loginAttempts.set(key, recent);
  return recent.length >= 5;
}

function recordFailedLogin(request) {
  const key = clientKey(request);
  loginAttempts.set(key, [...(loginAttempts.get(key) || []), Date.now()]);
}

function resetLoginLimit(request) {
  loginAttempts.delete(clientKey(request));
}

const contentTypes = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".png": "image/png", ".webp": "image/webp", ".pdf": "application/pdf"
};

async function serveStatic(request, response, publicDir) {
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname); }
  catch { pathname = "/"; }
  const key = pathname === "/" ? "/index.html" : pathname;
  let absolute = path.resolve(publicDir, `.${key}`);
  if (!absolute.startsWith(`${publicDir}${path.sep}`)) return json(response, 403, { error: "Forbidden" });
  try {
    if (!(await stat(absolute)).isFile()) throw new Error("NOT_FOUND");
  } catch {
    if (pathname.startsWith("/papers/")) return json(response, 404, { error: "Not found" });
    absolute = path.join(publicDir, "index.html");
  }
  try {
    const body = await readFile(absolute);
    const extension = path.extname(absolute).toLowerCase();
    const headers = { "content-type": contentTypes[extension] || "application/octet-stream" };
    if (extension === ".html") headers["cache-control"] = "no-cache";
    if (extension === ".pdf") headers["content-disposition"] = `attachment; filename*=UTF-8''${encodeURIComponent(path.basename(absolute))}`;
    response.writeHead(200, headers);
    response.end(body);
  } catch {
    json(response, 404, { error: "Not found" });
  }
}

export function createRequestHandler({ database, publicDir, secureCookies = process.env.COOKIE_SECURE === "true" }) {
  return async function handler(request, response) {
    database.prepare("DELETE FROM admin_sessions WHERE expires_at <= ?").run(new Date().toISOString());
    const url = new URL(request.url, "http://localhost");

    if (request.method === "GET" && url.pathname === "/api/health") {
      return json(response, 200, { ok: true });
    }
    if (request.method === "GET" && url.pathname === "/api/auth/status") {
      const admin = currentAdmin(request, database);
      return json(response, 200, { authenticated: Boolean(admin), username: admin?.username || null });
    }
    if (request.method === "GET" && url.pathname === "/api/members") {
      return json(response, 200, { members: listMembers(database) });
    }
    if (request.method === "POST" && url.pathname === "/api/auth/login") {
      if (rateLimited(request)) return json(response, 429, { error: "尝试次数过多，请稍后再试" });
      const configured = database.prepare("SELECT id, username, password_hash FROM admins WHERE id = 1").get();
      if (!configured) return json(response, 503, { error: "管理员账号尚未初始化" });
      let body;
      try { body = await readJson(request); }
      catch { return json(response, 400, { error: "请求格式不正确" }); }
      if (body.username !== configured.username || !verifyPassword(body.password, configured.password_hash)) {
        recordFailedLogin(request);
        return json(response, 401, { error: "账号或密码不正确" });
      }
      resetLoginLimit(request);
      const token = createSessionToken();
      const now = new Date();
      const expires = new Date(now.getTime() + SESSION_HOURS * 3600 * 1000);
      database.prepare("INSERT INTO admin_sessions (token_hash, admin_id, created_at, expires_at) VALUES (?, 1, ?, ?)")
        .run(hashSessionToken(token), now.toISOString(), expires.toISOString());
      return json(response, 200, { authenticated: true, username: configured.username }, { "set-cookie": cookie(token, secureCookies) });
    }
    if (request.method === "POST" && url.pathname === "/api/auth/logout") {
      const token = parseCookies(request)[COOKIE_NAME];
      if (token) database.prepare("DELETE FROM admin_sessions WHERE token_hash = ?").run(hashSessionToken(token));
      return json(response, 200, { authenticated: false }, { "set-cookie": clearCookie(secureCookies) });
    }
    if (url.pathname.startsWith("/api/admin/")) {
      const admin = currentAdmin(request, database);
      if (!admin) return json(response, 401, { error: "请先登录管理员账号" });
      if (request.method === "GET" && url.pathname === "/api/admin/status") {
        return json(response, 200, { ok: true, username: admin.username });
      }
      if (request.method === "GET" && url.pathname === "/api/admin/members") {
        return json(response, 200, { members: listMembers(database) });
      }
      if (request.method === "POST" && url.pathname === "/api/admin/members") {
        try {
          const member = insertMember(database, await readJson(request));
          return json(response, 201, { member });
        } catch (error) {
          const message = String(error.message || "");
          return json(response, message.includes("UNIQUE constraint") ? 409 : 400, { error: message.includes("UNIQUE constraint") ? "主页地址已被其他成员使用" : message || "成员信息不正确" });
        }
      }
      const memberRoute = url.pathname.match(/^\/api\/admin\/members\/([^/]+)$/);
      if (memberRoute && request.method === "PUT") {
        try {
          const member = updateMember(database, decodeURIComponent(memberRoute[1]), await readJson(request));
          return member ? json(response, 200, { member }) : json(response, 404, { error: "成员不存在" });
        } catch (error) {
          const message = String(error.message || "");
          return json(response, message.includes("UNIQUE constraint") ? 409 : 400, { error: message.includes("UNIQUE constraint") ? "主页地址已被其他成员使用" : message || "成员信息不正确" });
        }
      }
      if (memberRoute && request.method === "DELETE") {
        return removeMember(database, decodeURIComponent(memberRoute[1])) ? json(response, 200, { deleted: true }) : json(response, 404, { error: "成员不存在" });
      }
      return json(response, 404, { error: "Not found" });
    }
    if (url.pathname.startsWith("/api/")) return json(response, 404, { error: "Not found" });
    return serveStatic(request, response, publicDir);
  };
}
