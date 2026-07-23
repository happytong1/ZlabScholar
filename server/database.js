import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { hashPassword } from "./security.js";
import { memberSeed } from "./member-seed.js";
import { insertMember } from "./members.js";

export function openDatabase(options = {}) {
  const dataDir = path.resolve(options.dataDir || process.env.DATA_DIR || path.join(process.cwd(), "data"));
  mkdirSync(dataDir, { recursive: true });
  const database = new DatabaseSync(path.join(dataDir, "zlabscholar.sqlite"));
  database.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");
  database.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS admin_sessions (
      token_hash TEXT PRIMARY KEY,
      admin_id INTEGER NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS admin_sessions_expires_at ON admin_sessions(expires_at);
    CREATE TABLE IF NOT EXISTS members (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      chinese_name TEXT NOT NULL DEFAULT '',
      group_key TEXT NOT NULL CHECK (group_key IN ('faculty', 'phd', 'graduate')),
      sort_order INTEGER NOT NULL DEFAULT 0,
      affiliation TEXT NOT NULL DEFAULT '',
      affiliation_url TEXT NOT NULL DEFAULT '',
      role TEXT NOT NULL DEFAULT '',
      role_cn TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL DEFAULT '',
      email_note TEXT NOT NULL DEFAULT '',
      homepage TEXT NOT NULL DEFAULT '',
      orcid TEXT NOT NULL DEFAULT '',
      verified INTEGER NOT NULL DEFAULT 0,
      research_json TEXT NOT NULL DEFAULT '[]',
      avatar_data TEXT NOT NULL DEFAULT '',
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  if (!database.prepare("PRAGMA table_info(members)").all().some(column => column.name === "avatar_data")) {
    database.exec("ALTER TABLE members ADD COLUMN avatar_data TEXT NOT NULL DEFAULT ''");
  }

  const avatarUpgradeTime = new Date().toISOString();
  database.prepare("UPDATE members SET avatar_data = replace(avatar_data, '.jpg', '.webp'), updated_at = ? WHERE avatar_data GLOB '/profile-photos/*.jpg'")
    .run(avatarUpgradeTime);
  database.prepare("UPDATE members SET avatar_data = replace(avatar_data, '.png', '.webp'), updated_at = ? WHERE avatar_data GLOB '/profile-photos/*.png'")
    .run(avatarUpgradeTime);
  database.prepare("UPDATE members SET avatar_data = '/profile-photos/lizhuohang-v2.webp', updated_at = ? WHERE id = 'zhuohang' AND avatar_data = '/profile-photos/lizhuohang.webp'")
    .run(avatarUpgradeTime);

  const adminCount = database.prepare("SELECT COUNT(*) AS count FROM admins").get().count;
  const username = options.adminUsername || process.env.ADMIN_USERNAME;
  const password = options.adminPassword || process.env.ADMIN_PASSWORD;
  if (adminCount === 0 && username && password) {
    const now = new Date().toISOString();
    database.prepare("INSERT INTO admins (id, username, password_hash, created_at, updated_at) VALUES (1, ?, ?, ?, ?)")
      .run(username.trim(), hashPassword(password), now, now);
  }

  if (database.prepare("SELECT COUNT(*) AS count FROM members").get().count === 0) {
    database.exec("BEGIN");
    try {
      memberSeed.forEach(member => insertMember(database, member));
      database.exec("COMMIT");
    } catch (error) {
      database.exec("ROLLBACK");
      throw error;
    }
  }

  return database;
}
