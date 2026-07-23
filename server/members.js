import { randomUUID } from "node:crypto";

const GROUPS = new Set(["faculty", "phd", "graduate"]);

function text(value, maximum = 500) {
  return String(value ?? "").trim().slice(0, maximum);
}

function optionalUrl(value) {
  const result = text(value, 1000);
  if (!result) return "";
  try {
    const parsed = new URL(result);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new Error();
    return result;
  } catch {
    throw new Error("链接必须是有效的 http 或 https 地址");
  }
}

function avatarData(value) {
  const result = String(value ?? "");
  if (!result) return "";
  const localAsset = /^\/profile-photos\/[a-z0-9][a-z0-9._-]*\.(?:jpg|jpeg|png|webp)$/i.test(result);
  const uploadedImage = result.length <= 1_500_000 && /^data:image\/(?:webp|png|jpeg);base64,[A-Za-z0-9+/=_-]+$/.test(result);
  if (!localAsset && !uploadedImage) {
    throw new Error("头像数据格式不正确或文件过大");
  }
  return result;
}

export function validateMember(input) {
  const name = text(input.name, 120);
  const chineseName = text(input.chineseName, 80);
  const slug = text(input.slug, 120).toLowerCase();
  const group = text(input.group, 20);
  if (!name) throw new Error("英文名不能为空");
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error("主页地址只能使用小写字母、数字和连字符");
  if (!GROUPS.has(group)) throw new Error("成员分组不正确");
  const research = Array.isArray(input.research) ? input.research.map(item => text(item, 100)).filter(Boolean).slice(0, 20) : [];
  return {
    id: text(input.id, 80) || randomUUID(), slug, name, chineseName, group,
    sortOrder: Math.max(0, Math.min(9999, Number(input.sortOrder) || 0)),
    affiliation: text(input.affiliation, 500), affiliationUrl: optionalUrl(input.affiliationUrl),
    role: text(input.role, 160), roleCn: text(input.roleCn, 160), email: text(input.email, 200),
    emailNote: text(input.emailNote, 200), homepage: optionalUrl(input.homepage), orcid: optionalUrl(input.orcid),
    verified: Boolean(input.verified), research, avatar: avatarData(input.avatar)
  };
}

export function memberFromRow(row) {
  return {
    id: row.id, slug: row.slug, name: row.name, chineseName: row.chinese_name, group: row.group_key,
    sortOrder: row.sort_order, affiliation: row.affiliation, affiliationUrl: row.affiliation_url,
    role: row.role, roleCn: row.role_cn, email: row.email, emailNote: row.email_note,
    homepage: row.homepage, orcid: row.orcid, verified: Boolean(row.verified),
    research: JSON.parse(row.research_json || "[]"), avatar: row.avatar_data || ""
  };
}

export function listMembers(database) {
  return database.prepare("SELECT * FROM members WHERE active = 1 ORDER BY CASE group_key WHEN 'faculty' THEN 1 WHEN 'phd' THEN 2 ELSE 3 END, sort_order, chinese_name, name").all().map(memberFromRow);
}

export function insertMember(database, input) {
  const member = validateMember(input);
  const now = new Date().toISOString();
  database.prepare(`INSERT INTO members (id, slug, name, chinese_name, group_key, sort_order, affiliation, affiliation_url, role, role_cn, email, email_note, homepage, orcid, verified, research_json, avatar_data, active, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`)
    .run(member.id, member.slug, member.name, member.chineseName, member.group, member.sortOrder, member.affiliation, member.affiliationUrl, member.role, member.roleCn, member.email, member.emailNote, member.homepage, member.orcid, member.verified ? 1 : 0, JSON.stringify(member.research), member.avatar, now, now);
  return member;
}

export function updateMember(database, id, input) {
  const existing = database.prepare("SELECT id FROM members WHERE id = ? AND active = 1").get(id);
  if (!existing) return null;
  const member = validateMember({ ...input, id });
  database.prepare(`UPDATE members SET slug = ?, name = ?, chinese_name = ?, group_key = ?, sort_order = ?, affiliation = ?, affiliation_url = ?, role = ?, role_cn = ?, email = ?, email_note = ?, homepage = ?, orcid = ?, verified = ?, research_json = ?, avatar_data = ?, updated_at = ? WHERE id = ?`)
    .run(member.slug, member.name, member.chineseName, member.group, member.sortOrder, member.affiliation, member.affiliationUrl, member.role, member.roleCn, member.email, member.emailNote, member.homepage, member.orcid, member.verified ? 1 : 0, JSON.stringify(member.research), member.avatar, new Date().toISOString(), id);
  return member;
}

export function removeMember(database, id) {
  return database.prepare("UPDATE members SET active = 0, updated_at = ? WHERE id = ? AND active = 1").run(new Date().toISOString(), id).changes > 0;
}
