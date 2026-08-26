/**
 * GitHub REST v3 客户端:浏览器直连 api.github.com(CORS 开放),
 * Bearer PAT 鉴权、限流/错误归一为中文可操作提示,全部端点类型化。
 */

import { qs, decodeBase64Utf8, type GhRef, ghRefKey } from './lib.ts';

const API = 'https://api.github.com';
const TOKEN_KEY = 'gw.token';

export function getToken(): string {
  try { return localStorage.getItem(TOKEN_KEY) ?? ''; } catch { return ''; }
}
export function setToken(token: string): void {
  repoCache = null;
  viewerCache = undefined; // 身份变了,/user 结果作废
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch { /* 隐私模式等:忽略 */ }
}

let lastRemaining: number | null = null;
/** 最近一次响应的 core 限额剩余(页脚展示)。 */
export function rateRemaining(): number | null { return lastRemaining; }

export class GhError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'GhError';
    this.status = status;
  }
}

interface GhOpts {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  /** 覆盖 Accept(如 check-runs 的预览头)。 */
  accept?: string;
}

async function gh<T>(path: string, opts: GhOpts = {}): Promise<T> {
  const headers: Record<string, string> = {
    accept: opts.accept ?? 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  const token = getToken();
  if (token) headers.authorization = `Bearer ${token}`;
  if (opts.body !== undefined) headers['content-type'] = 'application/json';

  const res = await fetch(path.startsWith('http') ? path : `${API}${path}`, {
    method: opts.method ?? 'GET',
    headers,
    body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
  });
  const remain = res.headers.get('x-ratelimit-remaining');
  if (remain != null) lastRemaining = Number(remain);

  if (res.ok) {
    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
  }

  let upstream = '';
  try { upstream = (await res.json() as { message?: string }).message ?? ''; } catch { /* 忽略 */ }
  if (res.status === 401) throw new GhError('Token 无效或已过期(HTTP 401)。请在 ⚙ 设置里检查 Personal Access Token。', 401);
  if (res.status === 403 && lastRemaining === 0) {
    throw new GhError('GitHub API 限流(HTTP 403):匿名额度仅 60 次/小时。在 ⚙ 设置填入 PAT 即提升到 5000 次/小时。', 403);
  }
  if (res.status === 403) throw new GhError(`权限不足(HTTP 403)${upstream ? `:${upstream}` : ''}。写操作需要对应 RW 权限的 Token。`, 403);
  if (res.status === 404) throw new GhError(`资源不存在(HTTP 404):确认 owner/repo、分支或编号正确;私有仓需 Token 具备读取权限。 ${upstream}`, 404);
  if (res.status === 422) throw new GhError(`请求被 GitHub 拒绝(HTTP 422):${upstream || '参数校验失败'}`, 422);
  throw new GhError(`GitHub API 错误(HTTP ${res.status})${upstream ? `:${upstream}` : ''}`, res.status);
}

// ---------- 公共类型 ----------

export interface GhUser { login: string }
export interface GhLabel { name: string; color: string }
export interface GhIssue {
  number: number; title: string; state: 'open' | 'closed'; html_url: string;
  user: GhUser | null; created_at: string; updated_at: string; closed_at: string | null;
  comments: number; labels: GhLabel[]; body: string | null; pull_url?: string;
  pull_request?: unknown;
}
export interface GhComment {
  id: number; user: GhUser | null; body: string; created_at: string; html_url: string;
}
export interface GhPull {
  number: number; title: string; state: 'open' | 'closed'; html_url: string; draft: boolean;
  user: GhUser | null; created_at: string; updated_at: string;
  head: { ref: string; label: string; sha: string };
  base: { ref: string; label: string }; body: string | null;
  additions?: number; deletions?: number; changed_files?: number;
  mergeable?: boolean | null; mergeable_state?: string;
}
export interface GhCheckRun {
  id: number; name: string | null; status: string; conclusion: string | null; html_url: string;
}
export interface GhRun {
  id: number; name: string | null; display_title: string; status: string; conclusion: string | null;
  event: string; head_branch: string; html_url: string;
  created_at: string; updated_at: string; run_attempt: number;
  actor: GhUser | null;
}
export interface RepoMeta {
  fullName: string; description: string | null; defaultBranch: string;
  isPrivate: boolean; stars: number; htmlUrl: string;
}
export interface BranchLite { name: string }

// ---------- 读 ----------

interface RawRepo { full_name: string; description: string | null; default_branch: string; private: boolean; stargazers_count: number; html_url: string }

export async function getRepoMeta(ref: GhRef): Promise<RepoMeta> {
  const r = await gh<RawRepo>(`/repos/${ghRefKey(ref)}`);
  return {
    fullName: r.full_name, description: r.description, defaultBranch: r.default_branch,
    isPrivate: r.private, stars: r.stargazers_count, htmlUrl: r.html_url,
  };
}

export async function getBranches(ref: GhRef): Promise<BranchLite[]> {
  const arr = await gh<{ name: string }[]>(`/repos/${ghRefKey(ref)}/branches${qs({ per_page: 50 })}`);
  return arr.map((b) => ({ name: b.name }));
}

interface RawTree { tree: { path: string; type: 'blob' | 'tree'; size?: number }[]; truncated: boolean }

export async function getTree(ref: GhRef, branch: string): Promise<{ items: { path: string; type: 'blob' | 'tree'; size?: number }[]; truncated: boolean }> {
  const r = await gh<RawTree>(`/repos/${ghRefKey(ref)}/git/trees/${encodeURIComponent(branch)}?recursive=1`);
  return { items: r.tree.filter((t) => t.type === 'blob' || t.type === 'tree'), truncated: r.truncated };
}

export interface ContentResult {
  kind: 'text' | 'binary' | 'too-big';
  text?: string; size: number; truncatedLines?: boolean; htmlUrl: string;
}

const MAX_INLINE = 900_000;
const MAX_LINES = 3000;

export async function getFileContent(ref: GhRef, path: string, branch: string): Promise<ContentResult> {
  const raw = await gh<{ name: string; size: number; encoding?: string; content?: string; html_url: string }>(
    `/repos/${ghRefKey(ref)}/contents/${path.split('/').map(encodeURIComponent).join('/')}${qs({ ref: branch })}`);
  if (raw.size > MAX_INLINE || raw.encoding !== 'base64' || typeof raw.content !== 'string') {
    return { kind: raw.size > MAX_INLINE ? 'too-big' : 'binary', size: raw.size, htmlUrl: raw.html_url };
  }
  const full = decodeBase64Utf8(raw.content);
  const lines = full.split('\n');
  return {
    kind: 'text', size: raw.size, htmlUrl: raw.html_url,
    text: lines.length > MAX_LINES ? lines.slice(0, MAX_LINES).join('\n') : full,
    truncatedLines: lines.length > MAX_LINES,
  };
}

export async function listIssues(ref: GhRef): Promise<GhIssue[]> {
  const arr = await gh<GhIssue[]>(`/repos/${ghRefKey(ref)}/issues${qs({ state: 'open', sort: 'updated', per_page: 30 })}`);
  return arr.filter((i) => !i.pull_request);
}

export async function getIssue(ref: GhRef, n: number): Promise<GhIssue> {
  return gh<GhIssue>(`/repos/${ghRefKey(ref)}/issues/${n}`);
}

export async function listComments(ref: GhRef, n: number): Promise<GhComment[]> {
  return gh<GhComment[]>(`/repos/${ghRefKey(ref)}/issues/${n}/comments${qs({ per_page: 60 })}`);
}

export async function listPulls(ref: GhRef): Promise<GhPull[]> {
  return gh<GhPull[]>(`/repos/${ghRefKey(ref)}/pulls${qs({ state: 'open', per_page: 30 })}`);
}

export async function getPull(ref: GhRef, n: number): Promise<GhPull> {
  return gh<GhPull>(`/repos/${ghRefKey(ref)}/pulls/${n}`);
}

export async function listCheckRuns(ref: GhRef, sha: string): Promise<GhCheckRun[]> {
  const r = await gh<{ check_runs: GhCheckRun[] }>(`/repos/${ghRefKey(ref)}/commits/${sha}/check-runs?per_page=50`);
  return r.check_runs;
}

export async function listRuns(ref: GhRef): Promise<GhRun[]> {
  const r = await gh<{ workflow_runs: GhRun[] }>(`/repos/${ghRefKey(ref)}/actions/runs?per_page=20`);
  return r.workflow_runs;
}

// ---------- 自动拉取当前身份可见的仓库 ----------

export interface RepoLite {
  fullName: string;
  isPrivate: boolean;
  pushedAt: string;
  description: string | null;
  /** 仓库所有者登录名(判断"非本人的仓库"用)。 */
  ownerLogin: string;
}

interface RawUserRepo {
  full_name: string; private: boolean; pushed_at: string;
  description: string | null; fork: boolean; archived: boolean;
  owner: { login: string };
}

let repoCache: { at: number; data: RepoLite[] } | null = null;
const REPO_CACHE_TTL = 5 * 60_000;

/** 当前 Token 可见的全部仓库(owner + 协作 + 组织成员),按最近推送排序;5 分钟缓存。 */
export async function getMyRepos(force = false): Promise<RepoLite[]> {
  if (!force && repoCache && Date.now() - repoCache.at < REPO_CACHE_TTL) return repoCache.data;
  const arr = await gh<RawUserRepo[]>('/user/repos?per_page=100&sort=pushed&affiliation=owner,collaborator,organization_member');
  const data = arr
    .filter((r) => !r.archived)
    .map((r) => ({ fullName: r.full_name, isPrivate: r.private, pushedAt: r.pushed_at, description: r.description, ownerLogin: r.owner?.login ?? '' }))
    .sort((a, b) => b.pushedAt.localeCompare(a.pushedAt));
  repoCache = { at: Date.now(), data };
  return data;
}

export interface GhSearchRepo {
  fullName: string;
  stars: number;
  description: string | null;
}

let searchSeq = 0;

/** 按名称搜索任意公开仓库(search API,限流 30 次/分;带 450ms 去抖由 UI 层负责)。 */
export async function searchPublicRepos(q: string): Promise<GhSearchRepo[]> {
  const seq = ++searchSeq;
  const r = await gh<{ items: { full_name: string; stargazers_count: number; description: string | null }[] }>(
    `/search/repositories${qs({ q: `${q} in:name`, per_page: 8, sort: 'stars' })}`);
  if (seq !== searchSeq) return []; // 过期响应丢弃
  return r.items.map((i) => ({ fullName: i.full_name, stars: i.stargazers_count, description: i.description }));
}

/** 清空仓库列表缓存(token 变更后调用)。 */
export function invalidateRepoCache(): void { repoCache = null; }

// ---------- 写(v0.1;破坏性动作由 UI 层二次确认后调用) ----------

export async function createIssue(ref: GhRef, title: string, body: string): Promise<GhIssue> {
  return gh<GhIssue>(`/repos/${ghRefKey(ref)}/issues`, { method: 'POST', body: { title, body } });
}

export async function patchIssue(ref: GhRef, n: number, patch: { title?: string; body?: string; state?: 'open' | 'closed' }): Promise<void> {
  await gh(`/repos/${ghRefKey(ref)}/issues/${n}`, { method: 'PATCH', body: patch });
}

export async function addComment(ref: GhRef, n: number, body: string): Promise<void> {
  await gh(`/repos/${ghRefKey(ref)}/issues/${n}/comments`, { method: 'POST', body: { body } });
}

export async function editComment(ref: GhRef, commentId: number, body: string): Promise<void> {
  await gh(`/repos/${ghRefKey(ref)}/issues/comments/${commentId}`, { method: 'PATCH', body: { body } });
}

export async function deleteComment(ref: GhRef, commentId: number): Promise<void> {
  await gh(`/repos/${ghRefKey(ref)}/issues/comments/${commentId}`, { method: 'DELETE' });
}

export async function createPull(ref: GhRef, p: { title: string; body: string; head: string; base: string }): Promise<GhPull> {
  return gh<GhPull>(`/repos/${ghRefKey(ref)}/pulls`, { method: 'POST', body: p });
}

export async function mergePull(ref: GhRef, n: number, method: 'merge' | 'squash' | 'rebase'): Promise<void> {
  await gh(`/repos/${ghRefKey(ref)}/pulls/${n}/merge`, { method: 'PUT', body: { merge_method: method } });
}

export async function rerunRun(ref: GhRef, runId: number): Promise<void> {
  await gh(`/repos/${ghRefKey(ref)}/actions/runs/${runId}/rerun`, { method: 'POST' });
}

export async function cancelRun(ref: GhRef, runId: number): Promise<void> {
  await gh(`/repos/${ghRefKey(ref)}/actions/runs/${runId}/cancel`, { method: 'POST' });
}

/** 当前鉴权身份(评论删除按钮的归属判断用;结果缓存)。 */
let viewerCache: string | null | undefined;
export async function getViewerLogin(): Promise<string | null> {
  if (viewerCache !== undefined) return viewerCache;
  try {
    const u = await gh<GhUser>('/user');
    viewerCache = u.login;
  } catch {
    viewerCache = null;
  }
  return viewerCache;
}
