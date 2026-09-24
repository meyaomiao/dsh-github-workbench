/**
 * Runtime configuration backed by localStorage as the single source of truth
 * for repository, branch, token, and related settings shared by both mounts.
 * Host plugin toggles provide a fallback token for the sidebar tab mode.
 */

import type { ClientCtx, SidebarRegistry } from './types.ts';
import { parseGithubRemote, parseRepoInput, clamp, type GhRef } from './lib.ts';

const K = {
  token: 'gw.token',
  repo: 'gw.repo',
  branch: 'gw.branch',
  autoSec: 'gw.autoSec',
  recent: 'gw.recent',
  subtab: 'gw.subtab',
  panelWidth: 'gw.panelWidth',
} as const;

function lsGet(key: string): string {
  try { return localStorage.getItem(key) ?? ''; } catch { return ''; }
}
function lsSet(key: string, value: string): void {
  try {
    if (value) localStorage.setItem(key, value);
    else localStorage.removeItem(key);
  } catch { /* Ignore private-mode storage errors. */ }
}

export function loadToken(): string { return lsGet(K.token); }
export function saveToken(t: string): void { lsSet(K.token, t); }

export function loadRepo(): string { return lsGet(K.repo); }
export function saveRepo(fullName: string): void { lsSet(K.repo, fullName); }

export function loadBranch(): string { return lsGet(K.branch); }
export function saveBranch(b: string): void { lsSet(K.branch, b); }

const HIDDEN_KEY = 'gw.hiddenRepos';
export function loadHiddenRepos(): string[] {
  try {
    const arr = JSON.parse(lsGet(HIDDEN_KEY)) as unknown;
    return Array.isArray(arr) ? arr.filter((x): x is string => typeof x === 'string') : [];
  } catch { return []; }
}
function saveHidden(list: string[]): void { lsSet(HIDDEN_KEY, JSON.stringify(list.slice(0, 300))); }
export function hideRepo(fullName: string): void {
  saveHidden([fullName, ...loadHiddenRepos().filter((x) => x !== fullName)]);
}
export function unhideRepo(fullName: string): void {
  saveHidden(loadHiddenRepos().filter((x) => x !== fullName));
}

export type FontSizePref = 'dsh' | '13' | '14';
const FONT_KEY = 'gw.fontSize';
export function loadFontSize(): FontSizePref {
  const v = lsGet(FONT_KEY);
  return v === '13' || v === '14' ? v : 'dsh';
}
export function saveFontSize(v: FontSizePref): void { lsSet(FONT_KEY, v === 'dsh' ? '' : v); }

export function loadSubtab(): string { return lsGet(K.subtab); }
export function saveSubtab(s: string): void { lsSet(K.subtab, s); }

export function loadAutoRefreshSec(): number {
  const n = Number(lsGet(K.autoSec));
  return Number.isFinite(n) && n > 0 ? clamp(Math.round(n), 0, 120) : 0;
}
export function saveAutoRefreshSec(sec: number): void { lsSet(K.autoSec, String(clamp(Math.round(sec), 0, 120))); }

export function loadRecentRepos(): string[] {
  try {
    const arr = JSON.parse(lsGet(K.recent)) as unknown;
    return Array.isArray(arr) ? arr.filter((x): x is string => typeof x === 'string').slice(0, 5) : [];
  } catch { return []; }
}
export function pushRecentRepo(fullName: string): string[] {
  const next = [fullName, ...loadRecentRepos().filter((r) => r !== fullName)].slice(0, 5);
  try { lsSet(K.recent, JSON.stringify(next)); } catch { /* Ignore storage errors. */ }
  return next;
}

export function removeRecentRepo(fullName: string): string[] {
  const next = loadRecentRepos().filter((x) => x !== fullName);
  lsSet(K.recent, JSON.stringify(next));
  return next;
}

export function loadPanelWidth(): number {
  const n = Number(lsGet(K.panelWidth));
  return Number.isFinite(n) && n >= 320 ? clamp(n, 320, 720) : 470;
}
export function savePanelWidth(w: number): void { lsSet(K.panelWidth, String(clamp(Math.round(w), 320, 720))); }

/**
 * In tab mode, use the host pluginToggles token as a fallback.
 * If the host has a token and local storage does not, copy it once.
 */
export function absorbHostToken(ctx: ClientCtx): void {
  let svc: SidebarRegistry & {
    getSnapshot?: () => { prefs?: { pluginSettings?: Record<string, Record<string, unknown>> } };
  } | undefined;
  try { svc = (ctx as { betterSidebar?: typeof svc }).betterSidebar; } catch { svc = undefined; }
  try {
    const blob = svc?.getSnapshot?.().prefs?.pluginSettings?.['github-workbench:repo'];
    const hostToken = typeof blob?.token === 'string' ? blob.token : '';
    if (hostToken && !loadToken()) saveToken(hostToken);
    const hostAuto = typeof blob?.autoRefreshSec === 'number' ? blob.autoRefreshSec : -1;
    if (hostAuto >= 0 && !lsGet(K.autoSec)) saveAutoRefreshSec(hostAuto);
  } catch { /* Silently ignore unavailable host services. */ }
}

/** Detect a repository from the session workspace's .git/config. */
export async function detectWorkspaceRepo(sessionId: string): Promise<GhRef | null> {
  for (const path of ['.git/config', '../.git/config']) {
    try {
      const res = await fetch('/sidebar/api/fs.read', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ sessionId, path }),
      });
      const json = await res.json().catch(() => null) as
        { value?: { kind?: string; content?: string } | string } | null;
      const v = json?.value;
      const text = typeof v === 'string' ? v : v?.kind === 'text' ? v.content ?? '' : '';
      if (!text) continue;
      const ref = parseGithubRemote(text);
      if (ref) return ref;
    } catch { /* Try the next candidate path. */ }
  }
  // Final fallback for GitHub directory names embedded in the session cwd.
  return null;
}

export { parseRepoInput };
