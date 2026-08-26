/**
 * 运行态配置存储:localStorage 单一事实源(repo/branch/token 等,双形态共享);
 * tab 形态下宿主 pluginToggles 里的 token 作为兜底回退(better-sidebar 原生齿轮设置)。
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
  } catch { /* 隐私模式忽略 */ }
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

const AUTO_FOLLOW_KEY = 'gw.autoFollow';
export function loadAutoFollow(): boolean { return lsGet(AUTO_FOLLOW_KEY) !== '0'; }
export function saveAutoFollow(v: boolean): void { lsSet(AUTO_FOLLOW_KEY, v ? '1' : '0'); }

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
  try { lsSet(K.recent, JSON.stringify(next)); } catch { /* 忽略 */ }
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
 * tab 形态下,宿主 pluginToggles 里保存的 token 兜底:
 * 本地无 token 而宿主有 → 回填本地(一次性合并,之后以本地为准)。
 */
export function absorbHostToken(ctx: ClientCtx): void {
  const svc = (ctx as { betterSidebar?: SidebarRegistry & {
    getSnapshot?: () => { prefs?: { pluginSettings?: Record<string, Record<string, unknown>> } };
  } }).betterSidebar;
  try {
    const blob = svc?.getSnapshot?.().prefs?.pluginSettings?.['github-workbench:repo'];
    const hostToken = typeof blob?.token === 'string' ? blob.token : '';
    if (hostToken && !loadToken()) saveToken(hostToken);
    const hostAuto = typeof blob?.autoRefreshSec === 'number' ? blob.autoRefreshSec : -1;
    if (hostAuto >= 0 && !lsGet(K.autoSec)) saveAutoRefreshSec(hostAuto);
  } catch { /* 服务不可用时静默 */ }
}

/** 从会话工作区自动识别仓库:读 .git/config 解析 GitHub origin。 */
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
    } catch { /* 下一个候选路径 */ }
  }
  // 最后兜底:会话 cwd 字符串里若带 owner/repo 形态的 GitHub 目录名
  return null;
}

export { parseRepoInput };
