/**
 * Pure helpers for parsing, tree construction, time and size formatting, and
 * base64 decoding. Kept DOM-free for focused node:test coverage.
 */

/** GitHub repository coordinates. */
export interface GhRef {
  owner: string;
  repo: string;
}

export function ghRefKey(ref: GhRef): string {
  return `${ref.owner}/${ref.repo}`;
}

/** Parse the first GitHub remote from .git/config, preferring origin. */
export function parseGithubRemote(configText: string): GhRef | null {
  const re = /url\s*=\s*(?:https?:\/\/|git@|ssh:\/\/git@)(?:www\.)?github\.com[/:]([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+?)(?:\.git)?(?:\s|$)/g;
  let fallback: GhRef | null = null;
  for (const m of configText.matchAll(re)) {
    const ref = { owner: m[1], repo: m[2] };
    if (!fallback) fallback = ref;
    // Prefer a section containing "origin" by finding the nearest remote header.
    const before = configText.slice(0, m.index ?? 0);
    const sec = before.lastIndexOf('[remote');
    if (sec >= 0 && /\[remote\s+"origin"\]/.test(before.slice(sec))) return ref;
  }
  return fallback;
}

/** Parse owner/repo, GitHub URLs, and SSH repository inputs. */
export function parseRepoInput(input: string): GhRef | null {
  const raw = input.trim();
  if (!raw) return null;
  let m = /^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)$/.exec(raw);
  if (m) return { owner: m[1], repo: m[2].replace(/\.git$/, '') };
  m = /github\.com[/:]([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+?)(?:\.git)?(?:[/?#]|$)/.exec(raw);
  if (m) return { owner: m[1], repo: m[2] };
  return null;
}

/** Build a query string while skipping empty values. */
export function qs(params: Record<string, string | number | undefined>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== '') sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : '';
}

/** Read rel=next from a GitHub Link header, or return null. */
export function parseLinkNext(link: string | null | undefined): string | null {
  if (!link) return null;
  for (const part of link.split(',')) {
    const m = /<([^>]+)>\s*;\s*rel="?next"?/i.exec(part);
    if (m) return m[1];
  }
  return null;
}

// ---------- Git trees to nested nodes ----------

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

/** Sort a flat tree list into nested directories-first nodes. */
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

/** Collect direct child paths for lazy expansion. */
export function collectDirPaths(nodes: readonly TreeNode[], out: string[] = []): string[] {
  for (const n of nodes) {
    if (n.type === 'tree') { out.push(n.path); collectDirPaths(n.children ?? [], out); }
  }
  return out;
}

/** Extract repository coordinates and deep-link targets from a GitHub URL. */
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

// ---------- Formatting ----------

import { t } from './locales.ts';

/** Relative time (<1min → just now; over a year → specific date). */
export function timeAgo(iso: string, now: number = Date.now()): string {
  const ts = Date.parse(iso);
  if (!Number.isFinite(ts)) return iso;
  const diff = Math.max(0, now - ts);
  const min = Math.floor(diff / 60_000);
  if (min < 1) return t('time.justNow');
  if (min < 60) return t('time.minutesAgo', { n: min });
  const h = Math.floor(min / 60);
  if (h < 24) return t('time.hoursAgo', { n: h });
  const d = Math.floor(h / 24);
  if (d < 30) return t('time.daysAgo', { n: d });
  const mo = Math.floor(d / 30);
  if (mo < 12) return t('time.monthsAgo', { n: mo });
  return new Date(ts).toISOString().slice(0, 10);
}

/** Format a duration in milliseconds. */
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
 * Split repo:owner/name OR terms into groups within maxLen for Search queries.
 * Return full-name groups, or an empty list for empty input.
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

export type InboxKind = 'issue' | 'pr' | 'actions';

/** Stable inbox item key: kind:owner/repo#n. */
export function inboxItemKey(kind: InboxKind, owner: string, repo: string, n: number): string {
  return `${kind}:${owner}/${repo}#${n}`;
}

/** Decode GitHub contents API base64, including line breaks, to UTF-8. */
export function decodeBase64Utf8(b64: string): string {
  const bin = atob(b64.replace(/\s+/g, ''));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder('utf-8', { fatal: false }).decode(bytes);
}

/** Choose a readable text color for a #rgb or #rrggbb label color. */
export function labelTextColor(hex: string): string {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h.padEnd(6, '0');
  const r = parseInt(full.slice(0, 2), 16), g = parseInt(full.slice(2, 4), 16), b = parseInt(full.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 >= 140 ? '#000000cc' : '#ffffffee';
}
