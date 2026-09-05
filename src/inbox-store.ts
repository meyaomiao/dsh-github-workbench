/**
 * 收件箱模块级 store:跨仓公开仓新建 Issue。
 * 轮询不绑 Workbench visible(侧栏切走仍慢刷角标)。
 * 纯合并/切批可单测;fetch 经 deps 注入。
 */

import { inboxItemKey } from './lib.ts';
import * as api from './api.ts';
import * as cfg from './config.ts';
import type { InboxSearchHit, RepoLite } from './api.ts';

export interface InboxItem {
  key: string;
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
  searchIssuesCreatedSince(
    repos: readonly string[],
    createdSinceIso: string,
    viewer: string | null,
  ): Promise<{ hits: InboxSearchHit[]; queryTruncated: boolean }>;
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
    key: inboxItemKey(hit.owner, hit.repo, hit.number),
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
  const items = [...map.values()]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, MAX_ITEMS);
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

function parseItems(raw: string | null): InboxItem[] {
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return [];
    return arr.filter((x): x is InboxItem =>
      x && typeof x === 'object' && typeof (x as InboxItem).key === 'string'
      && typeof (x as InboxItem).number === 'number');
  } catch { return []; }
}

function parseRead(raw: string | null): Set<string> {
  if (!raw) return new Set();
  try {
    const arr = JSON.parse(raw) as unknown;
    return Array.isArray(arr)
      ? new Set(arr.filter((x): x is string => typeof x === 'string').slice(0, MAX_READ))
      : new Set();
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
    if (names.length === 0) {
      lastError = null;
      return [];
    }
    const viewer = await deps.getViewerLogin();
    const allowed = new Set(names);
    const { hits, queryTruncated } = await deps.searchIssuesCreatedSince(names, watermark, viewer);
    if (queryTruncated) truncatedWatch = true;
    const incoming = hits
      .filter((h) => allowed.has(`${h.owner}/${h.repo}`))
      .map((h) => hitToItem(h, true));
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

  function markAllRead(): void {
    readKeys = new Set([...readKeys, ...items.map((it) => it.key)]);
    items = items.map((it) => (it.unread ? { ...it, unread: false } : it));
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
    searchIssuesCreatedSince: api.searchIssuesCreatedSince,
  };
}
