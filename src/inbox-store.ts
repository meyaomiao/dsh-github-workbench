/**
 * 收件箱模块级 store:跨仓公开仓新建 Issue / PR,以及少量仓的新 Actions run。
 * 轮询不绑 Workbench visible(侧栏切走仍慢刷角标)。
 * 纯合并/切批可单测;fetch 经 deps 注入。
 */

import { inboxItemKey, parseRepoInput, type InboxKind } from './lib.ts';
import * as api from './api.ts';
import * as cfg from './config.ts';
import type { InboxSearchHit, RepoLite, GhRun } from './api.ts';

export type { InboxKind };

export interface InboxItem {
  key: string;
  kind: InboxKind;
  owner: string;
  repo: string;
  number: number;
  title: string;
  htmlUrl: string;
  user: string;
  createdAt: string;
  unread: boolean;
}

export interface InboxSnapshot {
  items: InboxItem[];
  unreadCount: number;
  unreadByKind: Record<InboxKind, number>;
  truncatedWatch: boolean;
  lastError: string | null;
  hasToken: boolean;
}

export interface InboxStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export interface InboxDeps {
  getToken(): string;
  getMyRepos(force?: boolean): Promise<RepoLite[]>;
  myReposTruncated(): boolean;
  loadHiddenRepos(): string[];
  getViewerLogin(): Promise<string | null>;
  searchInboxCreatedSince(
    repos: readonly string[],
    createdSinceIso: string,
    viewer: string | null,
  ): Promise<{ hits: InboxSearchHit[]; queryTruncated: boolean }>;
  listRunsCreatedSince(ref: { owner: string; repo: string }, sinceIso: string): Promise<GhRun[]>;
  loadRecentRepos(): string[];
  now?(): number;
  storage?: InboxStorage;
}

const LS_ITEMS = 'gw.inbox.items';
const LS_READ = 'gw.inbox.read';
const LS_WATER = 'gw.inbox.watermark';
const MAX_ITEMS = 100;
const MAX_READ = 500;
const WEEK_MS = 7 * 24 * 60 * 60_000;
const VISIBLE_MS = 15_000;
const HIDDEN_MS = 45_000;
const BACKOFF_MS = 60_000;

export function hitToItem(hit: InboxSearchHit, unread: boolean): InboxItem {
  return {
    key: inboxItemKey(hit.kind, hit.owner, hit.repo, hit.number),
    kind: hit.kind,
    owner: hit.owner,
    repo: hit.repo,
    number: hit.number,
    title: hit.title,
    htmlUrl: hit.htmlUrl,
    user: hit.user,
    createdAt: hit.createdAt,
    unread,
  };
}

export function runToItem(owner: string, repo: string, run: GhRun, unread: boolean): InboxItem {
  return {
    key: inboxItemKey('actions', owner, repo, run.id),
    kind: 'actions',
    owner,
    repo,
    number: run.id,
    title: run.display_title || run.name || `run #${run.id}`,
    htmlUrl: run.html_url,
    user: run.actor?.login ?? 'ghost',
    createdAt: run.created_at,
    unread,
  };
}

function capByKind(items: InboxItem[]): InboxItem[] {
  const buckets: Record<InboxKind, InboxItem[]> = { issue: [], pr: [], actions: [] };
  for (const it of items) buckets[it.kind].push(it);
  return [
    ...buckets.issue.slice(0, 50),
    ...buckets.pr.slice(0, 50),
    ...buckets.actions.slice(0, 30),
  ].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function unreadByKind(items: readonly InboxItem[]): Record<InboxKind, number> {
  const out: Record<InboxKind, number> = { issue: 0, pr: 0, actions: 0 };
  for (const it of items) if (it.unread) out[it.kind] += 1;
  return out;
}

/** 合并新命中:已有 key 不改(保留已读);selfKeys 进箱但 unread=false。 */
export function mergeIncoming(
  prev: InboxItem[],
  incoming: InboxItem[],
  readKeys: ReadonlySet<string>,
  selfKeys: ReadonlySet<string>,
): { items: InboxItem[]; fresh: InboxItem[] } {
  const map = new Map(prev.map((it) => [it.key, it]));
  const fresh: InboxItem[] = [];
  for (const it of incoming) {
    if (map.has(it.key)) continue;
    const unread = !readKeys.has(it.key) && !selfKeys.has(it.key);
    const next = { ...it, unread };
    map.set(it.key, next);
    if (unread) fresh.push(next);
  }
  const items = capByKind([...map.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  return { items, fresh };
}

export function unreadCountOf(items: readonly InboxItem[]): number {
  return items.reduce((n, it) => n + (it.unread ? 1 : 0), 0);
}

function memoryStorage(): InboxStorage {
  const m = new Map<string, string>();
  return {
    getItem: (k) => m.get(k) ?? null,
    setItem: (k, v) => { m.set(k, v); },
  };
}

function browserStorage(): InboxStorage {
  return {
    getItem(key) {
      try { return localStorage.getItem(key); } catch { return null; }
    },
    setItem(key, value) {
      try { localStorage.setItem(key, value); } catch { /* 隐私模式 */ }
    },
  };
}

function parseKind(v: unknown): InboxKind {
  return v === 'pr' || v === 'actions' || v === 'issue' ? v : 'issue';
}

function parseItems(raw: string | null): InboxItem[] {
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return [];
    const out: InboxItem[] = [];
    for (const x of arr) {
      if (!x || typeof x !== 'object') continue;
      const o = x as Record<string, unknown>;
      if (typeof o.key !== 'string' || typeof o.number !== 'number') continue;
      let kind = parseKind(o.kind);
      let key = o.key;
      if (!key.startsWith('issue:') && !key.startsWith('pr:') && !key.startsWith('actions:')) {
        kind = 'issue';
        key = inboxItemKey('issue', String(o.owner ?? ''), String(o.repo ?? ''), o.number);
      }
      out.push({
        key,
        kind,
        owner: String(o.owner ?? ''),
        repo: String(o.repo ?? ''),
        number: o.number,
        title: String(o.title ?? ''),
        htmlUrl: String(o.htmlUrl ?? ''),
        user: String(o.user ?? 'ghost'),
        createdAt: String(o.createdAt ?? ''),
        unread: o.unread !== false,
      });
    }
    return out;
  } catch { return []; }
}

function parseRead(raw: string | null): Set<string> {
  if (!raw) return new Set();
  try {
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return new Set();
    const next = new Set<string>();
    for (const x of arr) {
      if (typeof x !== 'string') continue;
      next.add(x);
      if (!x.startsWith('issue:') && !x.startsWith('pr:') && !x.startsWith('actions:')) {
        next.add(`issue:${x}`);
      }
    }
    return next;
  } catch { return new Set(); }
}

export function createInboxStore(deps: InboxDeps) {
  const storage = deps.storage ?? (typeof localStorage === 'undefined' ? memoryStorage() : browserStorage());
  const now = () => deps.now?.() ?? Date.now();

  let items = parseItems(storage.getItem(LS_ITEMS));
  let readKeys = parseRead(storage.getItem(LS_READ));
  const selfKeys = new Set<string>();
  let watermark = storage.getItem(LS_WATER) || new Date(now() - WEEK_MS).toISOString();
  let truncatedWatch = false;
  let lastError: string | null = null;
  let extraWatch: string | null = null;
  let firstTick = true;
  const listeners = new Set<() => void>();
  let timer: ReturnType<typeof setTimeout> | null = null;
  let stopped = true;
  let inFlight = false;
  let onFresh: ((fresh: InboxItem[]) => void) | null = null;
  let snapCache: InboxSnapshot = {
    items,
    unreadCount: unreadCountOf(items),
    unreadByKind: unreadByKind(items),
    truncatedWatch,
    lastError,
    hasToken: Boolean(deps.getToken()),
  };

  function persist(): void {
    storage.setItem(LS_ITEMS, JSON.stringify(items.slice(0, MAX_ITEMS)));
    storage.setItem(LS_READ, JSON.stringify([...readKeys].slice(0, MAX_READ)));
    storage.setItem(LS_WATER, watermark);
  }

  function currentUnread(): number {
    return deps.getToken() ? unreadCountOf(items) : 0;
  }

  function emit(): void {
    snapCache = {
      items,
      unreadCount: currentUnread(),
      unreadByKind: deps.getToken() ? unreadByKind(items) : { issue: 0, pr: 0, actions: 0 },
      truncatedWatch,
      lastError,
      hasToken: Boolean(deps.getToken()),
    };
    for (const fn of listeners) {
      try { fn(); } catch { /* 订阅者抛错不影响 store */ }
    }
  }

  function snapshot(): InboxSnapshot {
    return snapCache;
  }

  async function tick(): Promise<InboxItem[]> {
    const token = deps.getToken();
    if (!token) {
      lastError = null;
      truncatedWatch = false;
      emit();
      return [];
    }
    const hidden = new Set(deps.loadHiddenRepos());
    const mine = await deps.getMyRepos();
    const names = mine
      .filter((r) => !r.isPrivate && !hidden.has(r.fullName))
      .map((r) => r.fullName);
    if (extraWatch && !names.includes(extraWatch) && !hidden.has(extraWatch)) names.push(extraWatch);
    truncatedWatch = deps.myReposTruncated();
    const incoming: InboxItem[] = [];
    if (names.length > 0) {
      const viewer = await deps.getViewerLogin();
      const allowed = new Set(names);
      const { hits, queryTruncated } = await deps.searchInboxCreatedSince(names, watermark, viewer);
      if (queryTruncated) truncatedWatch = true;
      for (const h of hits) {
        if (!allowed.has(`${h.owner}/${h.repo}`)) continue;
        incoming.push(hitToItem(h, true));
      }
    }
    const actionRepos: string[] = [];
    for (const n of [extraWatch, ...deps.loadRecentRepos()]) {
      if (!n || hidden.has(n) || actionRepos.includes(n)) continue;
      actionRepos.push(n);
      if (actionRepos.length >= 5) break;
    }
    for (const full of actionRepos) {
      const ref = parseRepoInput(full);
      if (!ref) continue;
      try {
        const runs = await deps.listRunsCreatedSince(ref, watermark);
        for (const run of runs) incoming.push(runToItem(ref.owner, ref.repo, run, true));
      } catch { /* 私有仓 / 无 Actions 权限:跳过 */ }
    }
    if (incoming.length === 0 && names.length === 0) {
      lastError = null;
      persist();
      emit();
      firstTick = false;
      return [];
    }
    const merged = mergeIncoming(items, incoming, readKeys, selfKeys);
    items = merged.items;
    const newest = incoming.reduce((acc, h) => (h.createdAt > acc ? h.createdAt : acc), watermark);
    // 成功一轮后把水位推到「现在 - 30s」,避免时钟回拨漏单,同时不再反复拉整周
    const floor = new Date(now() - 30_000).toISOString();
    watermark = newest > floor ? newest : floor;
    lastError = null;
    persist();
    emit();
    const skipToast = firstTick;
    firstTick = false;
    if (!skipToast && merged.fresh.length) {
      try { onFresh?.(merged.fresh); } catch { /* toast 失败不影响轮询 */ }
    }
    return skipToast ? [] : merged.fresh;
  }

  async function pollOnce(): Promise<InboxItem[]> {
    if (inFlight) return [];
    inFlight = true;
    try {
      return await tick();
    } catch (e) {
      lastError = e instanceof Error ? e.message : String(e);
      emit();
      return [];
    } finally {
      inFlight = false;
    }
  }

  function delayMs(): number {
    if (!deps.getToken()) return HIDDEN_MS;
    if (lastError) return BACKOFF_MS;
    const hidden = typeof document !== 'undefined' && document.hidden;
    return hidden ? HIDDEN_MS : VISIBLE_MS;
  }

  function schedule(): void {
    if (stopped) return;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      void pollOnce().finally(() => schedule());
    }, delayMs());
  }

  function start(): () => void {
    stopped = false;
    void pollOnce().finally(() => schedule());
    const onVis = (): void => { if (!stopped) schedule(); };
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', onVis);
    }
    return () => {
      stopped = true;
      if (timer) { clearTimeout(timer); timer = null; }
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', onVis);
      }
    };
  }

  function markRead(key: string): void {
    readKeys = new Set(readKeys);
    readKeys.add(key);
    items = items.map((it) => (it.key === key ? { ...it, unread: false } : it));
    persist();
    emit();
  }

  function markAllRead(kind?: InboxKind): void {
    const keys = items.filter((it) => !kind || it.kind === kind).map((it) => it.key);
    readKeys = new Set([...readKeys, ...keys]);
    items = items.map((it) => ((!kind || it.kind === kind) && it.unread ? { ...it, unread: false } : it));
    persist();
    emit();
  }

  function markSelfCreated(key: string): void {
    selfKeys.add(key);
    readKeys = new Set(readKeys);
    readKeys.add(key);
    items = items.map((it) => (it.key === key ? { ...it, unread: false } : it));
    persist();
    emit();
  }

  function setExtraWatchRepo(fullName: string | null): void {
    extraWatch = fullName;
  }

  function subscribe(fn: () => void): () => void {
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }

  return {
    getSnapshot: snapshot,
    subscribe,
    start,
    pollOnce,
    markRead,
    markAllRead,
    markSelfCreated,
    setExtraWatchRepo,
    setOnFresh(fn: ((fresh: InboxItem[]) => void) | null): void { onFresh = fn; },
    unreadCount: currentUnread,
  };
}

export type InboxStore = ReturnType<typeof createInboxStore>;

let singleton: InboxStore | null = null;

/** 浏览器运行时单例。测试请用 createInboxStore。 */
export function getInboxStore(factory?: () => InboxDeps): InboxStore {
  if (!singleton) singleton = createInboxStore((factory ?? liveInboxDeps)());
  return singleton;
}

export function resetInboxStoreForTest(): void {
  singleton = null;
}

export function liveInboxDeps(): InboxDeps {
  return {
    getToken: api.getToken,
    getMyRepos: api.getMyRepos,
    myReposTruncated: api.myReposTruncated,
    loadHiddenRepos: cfg.loadHiddenRepos,
    getViewerLogin: api.getViewerLogin,
    searchInboxCreatedSince: api.searchInboxCreatedSince,
    listRunsCreatedSince: api.listRunsCreatedSince,
    loadRecentRepos: cfg.loadRecentRepos,
  };
}
