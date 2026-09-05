/**
 * 纯函数助手:解析 / 树构建 / 时间与容量格式化(base64 解码)。
 * 独立成模块便于 node:test 单测(不触 DOM / fetch)。
 */

/** GitHub 仓库坐标。 */
export interface GhRef {
  owner: string;
  repo: string;
}

export function ghRefKey(ref: GhRef): string {
  return `${ref.owner}/${ref.repo}`;
}

/** 从 .git/config 文本解析第一个 GitHub remote(origin 优先)。 */
export function parseGithubRemote(configText: string): GhRef | null {
  const re = /url\s*=\s*(?:https?:\/\/|git@|ssh:\/\/git@)(?:www\.)?github\.com[/:]([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+?)(?:\.git)?(?:\s|$)/g;
  let fallback: GhRef | null = null;
  for (const m of configText.matchAll(re)) {
    const ref = { owner: m[1], repo: m[2] };
    if (!fallback) fallback = ref;
    // 含 "origin" 的 section 优先:向前找最近的 [remote "..."]
    const before = configText.slice(0, m.index ?? 0);
    const sec = before.lastIndexOf('[remote');
    if (sec >= 0 && /\[remote\s+"origin"\]/.test(before.slice(sec))) return ref;
  }
  return fallback;
}

/** 解析用户输入:owner/repo、https://github.com/o/r(.git)、git@github.com:o/r.git。 */
export function parseRepoInput(input: string): GhRef | null {
  const raw = input.trim();
  if (!raw) return null;
  let m = /^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)$/.exec(raw);
  if (m) return { owner: m[1], repo: m[2].replace(/\.git$/, '') };
  m = /github\.com[/:]([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+?)(?:\.git)?(?:[/?#]|$)/.exec(raw);
  if (m) return { owner: m[1], repo: m[2] };
  return null;
}

/** 查询串构造(跳过空值)。 */
export function qs(params: Record<string, string | number | undefined>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== '') sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : '';
}

/** 解析 GitHub `Link` 响应头里的 rel=next(没有下一页则 null)。 */
export function parseLinkNext(link: string | null | undefined): string | null {
  if (!link) return null;
  for (const part of link.split(',')) {
    const m = /<([^>]+)>\s*;\s*rel="?next"?/i.exec(part);
    if (m) return m[1];
  }
  return null;
}

// ---------- git trees → 树 ----------

export interface TreeItem {
  path: string;
  type: 'blob' | 'tree';
  size?: number;
}

export interface TreeNode {
  name: string;
  path: string;
  type: 'blob' | 'tree';
  size?: number;
  children?: TreeNode[];
}

/** 平铺 tree 列表 → 排序嵌套树(目录在前,同型按名排序)。 */
export function buildTree(items: readonly TreeItem[]): TreeNode[] {
  const roots: TreeNode[] = [];
  const dirs = new Map<string, TreeNode>();
  const parentOf = (path: string): string =>
    path.includes('/') ? path.slice(0, path.lastIndexOf('/')) : '';
  const ensureDir = (path: string): TreeNode => {
    const hit = dirs.get(path);
    if (hit) return hit;
    const node: TreeNode = { name: path.split('/').pop() ?? path, path, type: 'tree', children: [] };
    dirs.set(path, node);
    const parent = parentOf(path);
    if (parent) ensureDir(parent).children!.push(node);
    else roots.push(node);
    return node;
  };
  for (const item of items) {
    if (item.type === 'tree') { ensureDir(item.path); continue; }
    const node: TreeNode = {
      name: item.path.split('/').pop() ?? item.path,
      path: item.path, type: 'blob', size: item.size,
    };
    const parent = parentOf(item.path);
    if (parent) ensureDir(parent).children!.push(node);
    else roots.push(node);
  }
  const sortRec = (nodes: TreeNode[]): void => {
    nodes.sort((a, b) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'tree' ? -1 : 1));
    for (const n of nodes) if (n.children) sortRec(n.children);
  };
  sortRec(roots);
  return roots;
}

/** 收集某目录下所有直接子路径的展开集(懒展开用)。 */
export function collectDirPaths(nodes: readonly TreeNode[], out: string[] = []): string[] {
  for (const n of nodes) {
    if (n.type === 'tree') { out.push(n.path); collectDirPaths(n.children ?? [], out); }
  }
  return out;
}

/** 从任意 GitHub URL 提取坐标与深链目标(非 github 域返回 null)。 */
export function parseGithubUrl(href: string): {
  ref: GhRef; kind?: 'issues' | 'pulls' | 'actions'; number?: number;
} | null {
  try {
    const u = new URL(href);
    if (!/(^|\.)github\.com$/.test(u.hostname)) return null;
    const seg = u.pathname.split('/').filter(Boolean);
    if (seg.length < 2) return null;
    const ref: GhRef = { owner: seg[0], repo: seg[1].replace(/\.git$/, '') };
    const out: ReturnType<typeof parseGithubUrl> = { ref };
    if (seg[2] === 'issues' && /^\d+$/.test(seg[3] ?? '')) { out.kind = 'issues'; out.number = Number(seg[3]); }
    else if (seg[2] === 'pull' && /^\d+$/.test(seg[3] ?? '')) { out.kind = 'pulls'; out.number = Number(seg[3]); }
    else if (seg[2] === 'actions') { out.kind = 'actions'; }
    return out;
  } catch { return null; }
}

// ---------- 格式化 ----------

/** 中文相对时间(<1min → 刚刚;超一年 → 具体日期)。 */
export function timeAgo(iso: string, now: number = Date.now()): string {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return iso;
  const diff = Math.max(0, now - t);
  const min = Math.floor(diff / 60_000);
  if (min < 1) return '刚刚';
  if (min < 60) return `${min} 分钟前`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} 小时前`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} 天前`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo} 个月前`;
  return new Date(t).toISOString().slice(0, 10);
}

/** 运行时长(ms)。 */
export function fmtDuration(ms: number): string {
  const s = Math.max(0, Math.round(ms / 1000));
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

export function fmtSize(bytes?: number): string {
  if (bytes === undefined || bytes === null) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/**
 * 把 repo:owner/name OR … 切成不超过 maxLen 的若干组(Search q 长度限制)。
 * 返回每组的 fullName 列表,空输入返回 [].
 */
export function chunkRepoQualifiers(fullNames: readonly string[], maxLen = 220): string[][] {
  const chunks: string[][] = [];
  let cur: string[] = [];
  let len = 0;
  for (const name of fullNames) {
    if (!name) continue;
    const piece = `repo:${name}`;
    const extra = cur.length === 0 ? piece.length : piece.length + 4; // ' OR '
    if (cur.length > 0 && len + extra > maxLen) {
      chunks.push(cur);
      cur = [name];
      len = piece.length;
    } else {
      cur.push(name);
      len += extra;
    }
  }
  if (cur.length) chunks.push(cur);
  return chunks;
}

/** 收件箱条目稳定键:owner/repo#n */
export function inboxItemKey(owner: string, repo: string, n: number): string {
  return `${owner}/${repo}#${n}`;
}

/** GitHub contents API 的 base64(可能带换行)→ UTF-8 文本。 */
export function decodeBase64Utf8(b64: string): string {
  const bin = atob(b64.replace(/\s+/g, ''));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder('utf-8', { fatal: false }).decode(bytes);
}

/** label 色值(#rgb/#rrggbb)上的人眼对比文字色。 */
export function labelTextColor(hex: string): string {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h.padEnd(6, '0');
  const r = parseInt(full.slice(0, 2), 16), g = parseInt(full.slice(2, 4), 16), b = parseInt(full.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 >= 140 ? '#000000cc' : '#ffffffee';
}
