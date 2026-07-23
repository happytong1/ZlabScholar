import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;

export function hashPassword(password) {
  if (typeof password !== "string" || password.length < 12) {
    throw new Error("管理员密码至少需要 12 个字符");
  }
  const salt = randomBytes(16);
  const derived = scryptSync(password, salt, KEY_LENGTH);
  return `scrypt$${salt.toString("base64url")}$${derived.toString("base64url")}`;
}

export function verifyPassword(password, stored) {
  try {
    const [algorithm, saltText, hashText] = String(stored).split("$");
    if (algorithm !== "scrypt" || !saltText || !hashText) return false;
    const expected = Buffer.from(hashText, "base64url");
    const actual = scryptSync(String(password), Buffer.from(saltText, "base64url"), expected.length);
    return expected.length === actual.length && timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

export function createSessionToken() {
  return randomBytes(32).toString("base64url");
}

export function hashSessionToken(token) {
  return createHash("sha256").update(token).digest("hex");
}
