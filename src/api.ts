/**
 * GitHub REST v3 客户端:浏览器直连 api.github.com(CORS 开放),
 * Bearer PAT 鉴权、限流/错误归一为中文可操作提示,全部端点类型化。
 */

import { qs, decodeBase64Utf8, parseLinkNext, parseGithubUrl, chunkRepoQualifiers, type GhRef, ghRefKey } from './lib.ts';

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

interface GhResponse {
  status: number;
  json: unknown;
  link: string | null;
}

async function ghRequest(path: string, opts: GhOpts = {}): Promise<GhResponse> {
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
  const resource = res.headers.get('x-ratelimit-resource');
  const remainNum = remain != null ? Number(remain) : null;
  // Search 有独立配额,不要覆盖页脚展示的 core 剩余
  if (remainNum != null && resource !== 'search') lastRemaining = remainNum;
  const link = res.headers.get('link');

  if (res.ok) {
    if (res.status === 204) return { status: 204, json: undefined, link };
    return { status: res.status, json: await res.json(), link };
  }

  let upstream = '';
  try { upstream = (await res.json() as { message?: string }).message ?? ''; } catch { /* 忽略 */ }
  if (res.status === 401) throw new GhError('Token 无效或已过期(HTTP 401)。请在 ⚙ 设置里检查 Personal Access Token。', 401);
  if (res.status === 403) {
    const isSearch = resource === 'search' || /\/search\//.test(path);
    if (remainNum === 0 || /rate limit/i.test(upstream)) {
      throw new GhError(isSearch
        ? 'GitHub Search API 限流(HTTP 403):已登录约 30 次/分钟。稍后再点「加载更多」,或改用 PAT。'
        : 'GitHub API 限流(HTTP 403):匿名额度仅 60 次/小时。在 ⚙ 设置填入 PAT 即提升到 5000 次/小时。', 403);
    }
  }
  if (res.status === 403) throw new GhError(`权限不足(HTTP 403)${upstream ? `:${upstream}` : ''}。写操作需要对应 RW 权限的 Token。`, 403);
  if (res.status === 404) throw new GhError(`资源不存在(HTTP 404):确认 owner/repo、分支或编号正确;私有仓需 Token 具备读取权限。 ${upstream}`, 404);
  if (res.status === 422) throw new GhError(`请求被 GitHub 拒绝(HTTP 422):${upstream || '参数校验失败'}`, 422);
  throw new GhError(`GitHub API 错误(HTTP ${res.status})${upstream ? `:${upstream}` : ''}`, res.status);
}

async function gh<T>(path: string, opts: GhOpts = {}): Promise<T> {
  const r = await ghRequest(path, opts);
  return r.json as T;
}

async function ghList<T>(path: string, opts: GhOpts = {}): Promise<{ data: T; nextUrl: string | null }> {
  const r = await ghRequest(path, opts);
  return { data: r.json as T, nextUrl: parseLinkNext(r.link) };
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
  merged_at?: string | null;
  additions?: number; deletions?: number; changed_files?: number;
  mergeable?: boolean | null; mergeable_state?: string;
}

export type ListSort = 'created' | 'updated';
export type IssueState = 'open' | 'closed';
export type PullFilter = 'open' | 'closed' | 'merged';

/** 一页列表:items 是本页,nextUrl 有值就能「加载更多」,totalCount 是仓库真实总数(Search 或并行计数)。 */
export interface ListPage<T> {
  items: T[];
  nextUrl: string | null;
  totalCount: number | null;
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

const PAGE = 30;

function searchQ(parts: string[]): string {
  return parts.filter(Boolean).join(' ');
}

function searchIssueToGh(it: SearchIssue): GhIssue {
  return {
    number: it.number,
    title: it.title,
    state: it.state,
    html_url: it.html_url,
    user: it.user,
    created_at: it.created_at,
    updated_at: it.updated_at,
    closed_at: it.closed_at,
    comments: it.comments ?? 0,
    labels: it.labels ?? [],
    body: it.body,
    pull_request: it.pull_request,
  };
}

function searchIssueToPull(it: SearchIssue): GhPull {
  const pr = it.pull_request;
  return {
    number: it.number,
    title: it.title,
    state: it.state,
    html_url: it.html_url.replace('/issues/', '/pull/'),
    draft: it.draft === true,
    user: it.user,
    created_at: it.created_at,
    updated_at: it.updated_at,
    head: { ref: '', label: '', sha: '' },
    base: { ref: '', label: '' },
    body: it.body,
    merged_at: pr && typeof pr === 'object' && pr !== null && 'merged_at' in pr
      ? (pr as { merged_at?: string | null }).merged_at ?? null
      : null,
  };
}

interface SearchIssue {
  number: number; title: string; state: 'open' | 'closed'; html_url: string;
  user: GhUser | null; created_at: string; updated_at: string; closed_at: string | null;
  comments: number; labels: GhLabel[]; body: string | null; pull_request?: { url?: string; merged_at?: string | null } | unknown;
  draft?: boolean;
}

interface SearchPayload { total_count: number; incomplete_results?: boolean; items: SearchIssue[] }

function pageFromUrl(url: string | undefined, fallback = 1): number {
  if (!url) return fallback;
  try {
    const n = Number(new URL(url, API).searchParams.get('page') ?? String(fallback));
    return Number.isFinite(n) && n > 0 ? n : fallback;
  } catch {
    return fallback;
  }
}

async function searchPage(q: string, sort: ListSort, pageUrl?: string): Promise<{ items: SearchIssue[]; nextUrl: string | null; totalCount: number }> {
  const pageNum = pageFromUrl(pageUrl, 1);
  const path = `/search/issues${qs({ q, sort, order: 'desc', per_page: PAGE, page: pageNum })}`;
  const { data } = await ghList<SearchPayload>(path);
  const items = data.items ?? [];
  const total = data.total_count ?? 0;
  const cap = Math.min(total, 1000);
  const nextUrl = items.length > 0 && pageNum * PAGE < cap
    ? `/search/issues${qs({ q, sort, order: 'desc', per_page: PAGE, page: pageNum + 1 })}`
    : null;
  return { items, nextUrl, totalCount: total };
}

/** Issues 列表:Search API `is:issue`,不被 PR 占坑;默认按创建时间(网页 Newest)。 */
export async function listIssues(
  ref: GhRef,
  state: IssueState = 'open',
  sort: ListSort = 'created',
  pageUrl?: string,
): Promise<ListPage<GhIssue>> {
  const q = searchQ([`repo:${ghRefKey(ref)}`, 'is:issue', `is:${state}`]);
  const page = await searchPage(q, sort, pageUrl);
  return { items: page.items.map(searchIssueToGh), nextUrl: page.nextUrl, totalCount: page.totalCount };
}

export async function getIssue(ref: GhRef, n: number): Promise<GhIssue> {
  return gh<GhIssue>(`/repos/${ghRefKey(ref)}/issues/${n}`);
}

export async function listComments(ref: GhRef, n: number, pageUrl?: string): Promise<ListPage<GhComment>> {
  const pageNum = pageFromUrl(pageUrl, 1);
  const path = `/repos/${ghRefKey(ref)}/issues/${n}/comments${qs({ per_page: 60, page: pageNum })}`;
  const { data, nextUrl } = await ghList<GhComment[]>(path);
  const computed = data.length >= 60
    ? `/repos/${ghRefKey(ref)}/issues/${n}/comments${qs({ per_page: 60, page: pageNum + 1 })}`
    : null;
  return { items: data, nextUrl: data.length === 0 ? null : (nextUrl ?? computed), totalCount: null };
}

/** PR 列表:Search `is:pr`(+ is:unmerged / is:merged),closed 与 merged 分开;默认 Newest。 */
export async function listPulls(
  ref: GhRef,
  filter: PullFilter = 'open',
  sort: ListSort = 'created',
  pageUrl?: string,
): Promise<ListPage<GhPull>> {
  const extra = filter === 'merged' ? 'is:merged' : filter === 'closed' ? 'is:closed is:unmerged' : 'is:open';
  const q = searchQ([`repo:${ghRefKey(ref)}`, 'is:pr', extra]);
  const page = await searchPage(q, sort, pageUrl);
  return { items: page.items.map(searchIssueToPull), nextUrl: page.nextUrl, totalCount: page.totalCount };
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

let repoCache: { at: number; data: RepoLite[]; truncated: boolean } | null = null;
const REPO_CACHE_TTL = 5 * 60_000;
const REPO_PAGE_CAP = 3;
const REPO_HARD_CAP = 300;

/** 当前 Token 可见的全部仓库(owner + 协作 + 组织成员),按最近推送排序;5 分钟缓存。跟分页,硬顶 300。 */
export async function getMyRepos(force = false): Promise<RepoLite[]> {
  if (!force && repoCache && Date.now() - repoCache.at < REPO_CACHE_TTL) return repoCache.data;
  const data: RepoLite[] = [];
  let path: string | null = '/user/repos?per_page=100&sort=pushed&affiliation=owner,collaborator,organization_member';
  let pages = 0;
  let truncated = false;
  while (path && pages < REPO_PAGE_CAP) {
    const page: { data: RawUserRepo[]; nextUrl: string | null } = await ghList<RawUserRepo[]>(path);
    pages += 1;
    for (const r of page.data) {
      if (r.archived) continue;
      data.push({
        fullName: r.full_name, isPrivate: r.private, pushedAt: r.pushed_at,
        description: r.description, ownerLogin: r.owner?.login ?? '',
      });
    }
    path = page.nextUrl;
    if (path && pages >= REPO_PAGE_CAP) truncated = true;
  }
  data.sort((a, b) => b.pushedAt.localeCompare(a.pushedAt));
  if (data.length > REPO_HARD_CAP) {
    data.length = REPO_HARD_CAP;
    truncated = true;
  }
  repoCache = { at: Date.now(), data, truncated };
  return data;
}

/** 最近一次 getMyRepos 是否因 300 顶而截断。 */
export function myReposTruncated(): boolean {
  return repoCache?.truncated ?? false;
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

// ---------- 收件箱:跨仓新建 Issue(Search,只看 created) ----------

export interface InboxSearchHit {
  owner: string;
  repo: string;
  number: number;
  title: string;
  htmlUrl: string;
  user: string;
  createdAt: string;
}

const INBOX_SEARCH_MAX_Q = 6;

function inboxSearchPrefix(createdSinceIso: string, viewer: string | null): string[] {
  const iso = createdSinceIso.replace(/\.\d{3}Z$/, 'Z');
  const parts = ['is:issue', 'is:public', 'is:open', `created:>=${iso}`];
  if (viewer) parts.push(`-author:${viewer}`);
  return parts;
}

/**
 * 监视集里 created>=watermark 的公开 Issue。
 * 优先 user:/org: 少打 Search,剩余 repo: OR 切批;每轮最多 6 次查询。
 */
export async function searchIssuesCreatedSince(
  repos: readonly string[],
  createdSinceIso: string,
  viewer: string | null,
): Promise<{ hits: InboxSearchHit[]; queryTruncated: boolean }> {
  const prefix = inboxSearchPrefix(createdSinceIso, viewer);
  const leftover = new Set(repos.filter(Boolean));
  const queries: string[] = [];

  if (viewer) {
    queries.push(searchQ([...prefix, `user:${viewer}`]));
    for (const r of leftover) {
      if (r.startsWith(`${viewer}/`)) leftover.delete(r);
    }
  }

  const otherOwners = new Map<string, string[]>();
  for (const r of leftover) {
    const owner = r.split('/')[0] ?? '';
    const list = otherOwners.get(owner) ?? [];
    list.push(r);
    otherOwners.set(owner, list);
  }
  const orgOwners = [...otherOwners.entries()]
    .filter(([, list]) => list.length >= 2)
    .map(([owner]) => owner);

  for (const org of orgOwners) {
    if (queries.length >= INBOX_SEARCH_MAX_Q) break;
    queries.push(searchQ([...prefix, `org:${org}`]));
    for (const r of otherOwners.get(org) ?? []) leftover.delete(r);
  }

  for (const chunk of chunkRepoQualifiers([...leftover], 220)) {
    if (queries.length >= INBOX_SEARCH_MAX_Q) break;
    const orPart = chunk.map((n) => `repo:${n}`).join(' OR ');
    queries.push(searchQ([...prefix, `(${orPart})`]));
    for (const n of chunk) leftover.delete(n);
  }

  const hits: InboxSearchHit[] = [];
  const seen = new Set<string>();
  for (const q of queries) {
    const page = await searchPage(q, 'created');
    for (const it of page.items) {
      if (it.pull_request) continue;
      if (it.created_at < createdSinceIso) continue;
      const parsed = parseGithubUrl(it.html_url);
      if (!parsed) continue;
      const key = `${parsed.ref.owner}/${parsed.ref.repo}#${it.number}`;
      if (seen.has(key)) continue;
      seen.add(key);
      hits.push({
        owner: parsed.ref.owner,
        repo: parsed.ref.repo,
        number: it.number,
        title: it.title,
        htmlUrl: it.html_url,
        user: it.user?.login ?? 'ghost',
        createdAt: it.created_at,
      });
    }
  }
  return { hits, queryTruncated: leftover.size > 0 };
}

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
