import assert from "node:assert/strict";
import { once } from "node:events";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { createRequestHandler } from "./app.js";
import { openDatabase } from "./database.js";
import { memberSeed } from "./member-seed.js";
import { hashPassword, verifyPassword } from "./security.js";

test("password hashes are salted and verifiable", () => {
  const first = hashPassword("a-secure-test-password");
  const second = hashPassword("a-secure-test-password");
  assert.notEqual(first, second);
  assert.equal(verifyPassword("a-secure-test-password", first), true);
  assert.equal(verifyPassword("wrong-password", first), false);
});

test("legacy local avatars are upgraded to WebP paths", async t => {
  const testRoot = await mkdtemp(path.join(tmpdir(), "zlabscholar-avatar-"));
  const dataDir = path.join(testRoot, "data");
  let database = openDatabase({ dataDir });
  database.prepare("UPDATE members SET avatar_data = '/profile-photos/legacy.jpg' WHERE id = 'xinyao'").run();
  database.close();

  database = openDatabase({ dataDir });
  assert.equal(database.prepare("SELECT avatar_data FROM members WHERE id = 'xinyao'").get().avatar_data, "/profile-photos/legacy.webp");

  t.after(async () => {
    database.close();
    await rm(testRoot, { recursive: true, force: true });
  });
});

test("single admin login protects admin APIs", async t => {
  const testRoot = await mkdtemp(path.join(tmpdir(), "zlabscholar-auth-"));
  const publicDir = path.join(testRoot, "public");
  await mkdir(publicDir);
  await writeFile(path.join(publicDir, "index.html"), "<!doctype html><title>test</title>");
  await writeFile(path.join(publicDir, "avatar.webp"), "avatar");
  const database = openDatabase({ dataDir: path.join(testRoot, "data"), adminUsername: "admin", adminPassword: "a-secure-test-password" });
  const server = createServer(createRequestHandler({ database, publicDir, secureCookies: false }));
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;

  t.after(async () => {
    server.close();
    await once(server, "close");
    database.close();
    await rm(testRoot, { recursive: true, force: true });
  });

  let response = await fetch(`${baseUrl}/api/auth/status`);
  assert.deepEqual(await response.json(), { authenticated: false, username: null });

  response = await fetch(`${baseUrl}/avatar.webp`);
  assert.equal(response.headers.get("cache-control"), "public, max-age=604800, stale-while-revalidate=86400");
  assert.equal(response.headers.get("content-length"), "6");

  response = await fetch(`${baseUrl}/api/admin/status`);
  assert.equal(response.status, 401);

  response = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ username: "admin", password: "wrong-password" })
  });
  assert.equal(response.status, 401);

  response = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ username: "admin", password: "a-secure-test-password" })
  });
  assert.equal(response.status, 200);
  const sessionCookie = response.headers.get("set-cookie").split(";")[0];

  response = await fetch(`${baseUrl}/api/admin/status`, { headers: { cookie: sessionCookie } });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, username: "admin" });

  response = await fetch(`${baseUrl}/api/members`);
  assert.equal((await response.json()).members.length, memberSeed.length);

  response = await fetch(`${baseUrl}/api/admin/members`, {
    method: "POST",
    headers: { cookie: sessionCookie, "content-type": "application/json" },
    body: JSON.stringify({ name: "Test Member", chineseName: "测试成员", slug: "test-member", group: "graduate", role: "Student", roleCn: "研究生", research: ["Testing"] })
  });
  assert.equal(response.status, 201);
  const createdMember = (await response.json()).member;

  response = await fetch(`${baseUrl}/api/admin/members/${createdMember.id}`, {
    method: "PUT",
    headers: { cookie: sessionCookie, "content-type": "application/json" },
    body: JSON.stringify({ ...createdMember, chineseName: "测试成员已更新" })
  });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).member.chineseName, "测试成员已更新");

  response = await fetch(`${baseUrl}/api/admin/members/${createdMember.id}`, { method: "DELETE", headers: { cookie: sessionCookie } });
  assert.equal(response.status, 200);

  response = await fetch(`${baseUrl}/api/members`);
  assert.equal((await response.json()).members.length, memberSeed.length);

  response = await fetch(`${baseUrl}/api/auth/logout`, { method: "POST", headers: { cookie: sessionCookie } });
  assert.equal(response.status, 200);

  response = await fetch(`${baseUrl}/api/admin/status`, { headers: { cookie: sessionCookie } });
  assert.equal(response.status, 401);
});
