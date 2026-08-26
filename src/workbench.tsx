/**
 * 「GitHub 工作台」主应用:头部(仓库切换 / 分支 / 刷新 / 设置)+ 四子页签路由 +
 * 确认气泡与 toast 基础设施。双形态(tab / 独立面板)共享本组件;
 * 根节点 .gw-root 以 absolute inset 0 撑满承载容器(挂载填充契约)。
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { GwIcon } from './icons.ts';
import * as api from './api.ts';
import * as cfg from './config.ts';
import { ghRefKey, parseRepoInput, timeAgo, type GhRef } from './lib.ts';
import { ensureStyles } from './styles.ts';
import { CodeView } from './code-view.tsx';
import { IssuesView } from './issues-view.tsx';
import { PullsView } from './pulls-view.tsx';
import { ActionsView } from './actions-view.tsx';

// ---------- 跨视图 UI 能力(确认气泡 / toast) ----------

export interface ConfirmOptions {
  title: string;
  body?: string;
  confirmText?: string;
  danger?: boolean;
}
export interface UICapability {
  confirm(opts: ConfirmOptions): Promise<boolean>;
  toast(msg: string, kind?: 'ok' | 'err'): void;
}

const UICtx = createContext<UICapability>({
  confirm: async () => false,
  toast: () => undefined,
});

export function useUI(): UICapability {
  return useContext(UICtx);
}

export function errText(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

type Subtab = 'code' | 'issues' | 'pulls' | 'actions';
const SUBTABS: readonly { id: Subtab; icon: Parameters<typeof GwIcon>[0]['name']; label: string }[] = [
  { id: 'code', icon: 'code', label: 'Code' },
  { id: 'issues', icon: 'issue', label: 'Issues' },
  { id: 'pulls', icon: 'pr', label: 'Pull requests' },
  { id: 'actions', icon: 'play', label: 'Actions' },
];

function isSubtab(v: string): v is Subtab {
  return SUBTABS.some((t) => t.id === v);
}

export interface WorkbenchAppProps {
  sessionId: string;
  cwd?: string;
  visible: boolean;
}

export function WorkbenchApp({ sessionId, visible }: WorkbenchAppProps): ReactNode {
  const [repoFull, setRepoFull] = useState(cfg.loadRepo());
  const ref = useMemo<GhRef | null>(() => parseRepoInput(repoFull), [repoFull]);
  const [branch, setBranch] = useState(cfg.loadBranch());
  const [subtab, setSubtab] = useState<Subtab>(() => {
    const saved = cfg.loadSubtab();
    return isSubtab(saved) ? saved : 'code';
  });
  const [meta, setMeta] = useState<api.RepoMeta | null>(null);
  const [branches, setBranches] = useState<api.BranchLite[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [detecting, setDetecting] = useState(false);
  const [reload, setReload] = useState(0);
  const [rate, setRate] = useState<number | null>(null);
  const [token, setToken] = useState(cfg.loadToken());
  const [fontSize, setFontSize] = useState(cfg.loadFontSize());
  const [counts, setCounts] = useState<Partial<Record<Subtab, number>>>({});
  const [repoPop, setRepoPop] = useState(false);
  const [setPop, setSetPop] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [paneW, setPaneW] = useState(0);
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((entries) => {
      setPaneW(Math.round(entries[0]?.contentRect.width ?? 0));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // 样式注入 + 宿主 token 兜底合并(一次性)
  useEffect(() => {
    ensureStyles();
    cfg.absorbHostToken({
      effect(fn) { fn(); },
    });
    setToken(cfg.loadToken());
  }, []);

  // 无仓库时自动识别工作区
  useEffect(() => {
    if (ref) return;
    let dead = false;
    setDetecting(true);
    cfg.detectWorkspaceRepo(sessionId)
      .then((detected) => {
        if (dead || !detected) return;
        applyRepo(ghRefKey(detected));
      })
      .finally(() => { if (!dead) setDetecting(false); });
    return () => { dead = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // 仓库元数据 + 分支
  useEffect(() => {
    if (!ref) return;
    let dead = false;
    setError(null);
    api.getRepoMeta(ref)
      .then((m) => { if (!dead) setMeta(m); })
      .catch((e) => { if (!dead) setError(errText(e)); });
    api.getBranches(ref)
      .then((b) => { if (!dead) setBranches(b); })
      .catch(() => { /* 分支列表失败不致命 */ });
    return () => { dead = true; };
  }, [ref?.owner, ref?.repo]);

  // 页脚限额同步(visible 门控)
  useEffect(() => {
    if (!visible) return;
    setRate(api.rateRemaining());
    const t = setInterval(() => setRate(api.rateRemaining()), 3000);
    return () => clearInterval(t);
  }, [visible]);

  const effBranch = branch || meta?.defaultBranch || '';

  function applyRepo(fullName: string): void {
    const parsed = parseRepoInput(fullName);
    if (!parsed) return;
    const next = ghRefKey(parsed);
    setRepoFull(next);
    cfg.saveRepo(next);
    cfg.pushRecentRepo(next);
    setBranch('');
    cfg.saveBranch('');
    setMeta(null);
    setCounts({});
  }

  const switchTab = useCallback((id: Subtab) => {
    setSubtab(id);
    cfg.saveSubtab(id);
  }, []);

  const onCount = useCallback((id: Subtab) => (n: number) => {
    setCounts((prev) => (prev[id] === n ? prev : { ...prev, [id]: n }));
  }, []);

  // ---------- 确认气泡 / toast ----------
  const [dialog, setDialog] = useState<null | { opts: ConfirmOptions; resolve: (v: boolean) => void }>(null);
  const [toasts, setToasts] = useState<{ id: number; msg: string; kind: 'ok' | 'err' }[]>([]);
  const seq = useRef(0);

  const ui = useMemo<UICapability>(() => ({
    confirm: (opts) => new Promise<boolean>((resolve) => setDialog({ opts, resolve })),
    toast: (msg, kind = 'ok') => {
      const id = ++seq.current;
      setToasts((list) => [...list, { id, msg, kind }]);
      setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), kind === 'err' ? 6000 : 3200);
    },
  }), []);

  // ---------- 渲染 ----------

  const header = (
    <div className="gw-header">
      <GwIcon name="octo" size={19} />
      <button className="gw-repo-btn" onClick={() => { setRepoPop((v) => !v); setSetPop(false); }}
        title="切换代码库">
        <span className="gw-repo-name">{repoFull || '选择仓库'}</span>
        <GwIcon name="chevron-down" size={12} style={{ color: 'var(--dsw-alias-label-tertiary)' }} />
      </button>
      {meta?.isPrivate && <span className="gw-chip"><GwIcon name="lock" size={9} />private</span>}
      <select className="gw-select" value={effBranch} title="分支"
        onChange={(e) => { setBranch(e.target.value); cfg.saveBranch(e.target.value); }}>
        {(branches.length ? branches : (meta ? [{ name: meta.defaultBranch }] : [])).map((b) => (
          <option key={b.name} value={b.name}>{b.name}</option>
        ))}
        {meta && !branches.some((b) => b.name === meta.defaultBranch) && <option value={meta.defaultBranch}>{meta.defaultBranch}</option>}
      </select>
      <button className="gw-hbtn" title="刷新" onClick={() => setReload((n) => n + 1)}>
        <GwIcon name="refresh" size={14} />
      </button>
      <button className="gw-hbtn" title="设置(Token / 自动刷新)" onClick={() => { setSetPop((v) => !v); setRepoPop(false); }}>
        <GwIcon name="gear" size={14} />
      </button>
      <span className={`gw-dot ${token ? 'ok' : ''}`}
        title={token ? '已配置 PAT(5000 次/小时)' : '未配置 Token:匿名 60 次/小时且无法写操作'} />
    </div>
  );

  const body = !ref ? (
    <SetupCard detecting={detecting} onSubmit={applyRepo} error={error} />
  ) : (
    <>
      <div className="gw-tabs">
        {SUBTABS.map((t) => (
          <button key={t.id} className={`gw-tab ${subtab === t.id ? 'on' : ''}`} onClick={() => switchTab(t.id)}>
            <GwIcon name={t.icon} size={13} />{t.label}
            {counts[t.id] !== undefined && <span className="gw-count">{counts[t.id]}</span>}
          </button>
        ))}
      </div>
      <div className="gw-body">
        <ViewPort subtab={subtab} reloadKey={`${ghRefKey(ref)}@${effBranch}#${reload}`}
          ghRef={ref} branch={effBranch} branches={branches} visible={visible} onCount={onCount} />
      </div>
      <div className="gw-footer">
        <span>api.github.com · REST v3</span>
        <span>{rate != null ? `core 剩余 ${rate}` : '—'} · {token ? 'PAT 已配置' : '匿名只读'} · 容器 {paneW}px</span>
      </div>
    </>
  );

  return (
    <UICtx.Provider value={ui}>
      <div ref={rootRef} className="gw-root"
        style={fontSize === 'dsh' ? undefined : ({ '--gw-body-size': fontSize } as React.CSSProperties)}>
        {header}
        {body}
        {repoPop && (
          <RepoPopover recent={cfg.loadRecentRepos()} current={repoFull} hasToken={!!token}
            onPick={(full) => { applyRepo(full); setRepoPop(false); }}
            onClose={() => setRepoPop(false)} />
        )}
        {setPop && (
          <SettingsPopover token={token} onSaveToken={(t) => { cfg.saveToken(t); api.invalidateRepoCache(); setToken(t); }}
            fontSize={fontSize} onSaveFontSize={(v) => { cfg.saveFontSize(v); setFontSize(v); }}
            onClose={() => setSetPop(false)} />
        )}
        {dialog && (
          <ConfirmDialog opts={dialog.opts}
            onDone={(v) => { dialog.resolve(v); setDialog(null); }} />
        )}
        {toasts.length > 0 && (
          <div className="gw-toasts">
            {toasts.map((t) => <div key={t.id} className={`gw-toast ${t.kind}`}>{t.msg}</div>)}
          </div>
        )}
      </div>
    </UICtx.Provider>
  );
}

// ---------- 视口分发(key 驱动重挂载刷新) ----------

interface ViewPortProps {
  subtab: Subtab;
  reloadKey: string;
  ghRef: GhRef;
  branch: string;
  branches: api.BranchLite[];
  visible: boolean;
  onCount: (id: Subtab) => (n: number) => void;
}

function ViewPort(p: ViewPortProps): ReactNode {
  switch (p.subtab) {
    case 'code':
      return <CodeView key={`c:${p.reloadKey}`} ghRef={p.ghRef} branch={p.branch} />;
    case 'issues':
      return <IssuesView key={`i:${p.reloadKey}`} ghRef={p.ghRef} visible={p.visible} onCount={p.onCount('issues')} />;
    case 'pulls':
      return <PullsView key={`p:${p.reloadKey}`} ghRef={p.ghRef} branches={p.branches} visible={p.visible} onCount={p.onCount('pulls')} />;
    case 'actions':
      return <ActionsView key={`a:${p.reloadKey}`} ghRef={p.ghRef} visible={p.visible} onCount={p.onCount('actions')} />;
  }
}

// ---------- 首次使用卡片(未选仓库) ----------

function SetupCard(props: { detecting: boolean; error: string | null; onSubmit: (fullName: string) => void }): ReactNode {
  const [value, setValue] = useState('');
  return (
    <div className="gw-empty">
      <div style={{ maxWidth: 340, width: '100%' }}>
        <GwIcon name="octo" size={40} style={{ margin: '0 auto 14px', color: 'var(--dsw-alias-label-tertiary)' }} />
        <div style={{ marginBottom: 10, lineHeight: 1.7 }}>
          {props.detecting ? '正在识别当前工作区的 GitHub 仓库…' : '输入要查看的仓库(owner/repo 或粘贴 URL)。'}
        </div>
        <form className="gw-formrow" onSubmit={(e) => { e.preventDefault(); props.onSubmit(value); }}>
          <input className="gw-input" placeholder="owner/repo" value={value}
            onChange={(e) => setValue(e.target.value)} autoFocus />
          <button className="gw-btn primary" type="submit">载入</button>
        </form>
        {props.error && <div className="gw-errbox">{props.error}</div>}
      </div>
    </div>
  );
}

// ---------- 仓库切换弹层 ----------

function RepoPopover(props: {
  recent: string[]; current: string; hasToken: boolean;
  onPick: (full: string) => void; onClose: () => void;
}): ReactNode {
  const [value, setValue] = useState('');
  const [repos, setRepos] = useState<api.RepoLite[] | null>(null);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [pub, setPub] = useState<api.GhSearchRepo[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [hidden, setHidden] = useState<string[]>(() => cfg.loadHiddenRepos());
  const [viewer, setViewer] = useState<string | null>(null);
  const [manage, setManage] = useState(false);
  const [recent, setRecent] = useState<string[]>(props.recent);
  const dropFromRecent = (e: React.MouseEvent, full: string): void => {
    e.stopPropagation();
    const owner = full.split('/')[0];
    if (viewer === null || owner !== viewer) cfg.hideRepo(full); // 他人的仓同步进隐藏名单
    setRecent(cfg.removeRecentRepo(full));
  };
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => { if (props.hasToken) api.getViewerLogin().then(setViewer); }, [props.hasToken]);

  useEffect(() => {
    if (!props.hasToken) return;
    let dead = false;
    api.getMyRepos().then((r) => { if (!dead) setRepos(r); })
      .catch((e) => { if (!dead) setLoadErr(errText(e)); });
    return () => { dead = true; };
  }, [props.hasToken]);

  useEffect(() => {
    const close = (e: MouseEvent): void => {
      if (!(e.target instanceof Node) || !wrap.current?.contains(e.target)) props.onClose();
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [props]);

  // 公开仓库搜索:450ms 去抖,≥3 字符触发
  const q = value.trim();
  const ql = q.toLowerCase();
  useEffect(() => {
    if (q.length < 3 || manage) { setPub(null); setSearching(false); return; }
    let dead = false;
    setSearching(true);
    const t = setTimeout(() => {
      api.searchPublicRepos(q)
        .then((r) => { if (!dead) { setPub(r); setSearching(false); } })
        .catch(() => { if (!dead) { setPub([]); setSearching(false); } });
    }, 450);
    return () => { dead = true; clearTimeout(t); };
  }, [q, manage]);

  const mineAll = repos ?? [];
  const visibleMine = mineAll.filter((r) =>
    !hidden.includes(r.fullName) || r.fullName === props.current);
  const mineFiltered = ql && visibleMine.length
    ? visibleMine.filter((r) => r.fullName.toLowerCase().includes(ql)).slice(0, 20)
    : (ql ? [] : visibleMine.slice(0, 20));

  // 归属判定:owner 与当前登录名不同 ⇒ 可移除;/user 拿不到(viewer=null)时
  // 也放行(有管理页可恢复),避免身份接口偶发失败导致图标全体消失。
  const canDrop = (r: api.RepoLite): boolean =>
    !!r.ownerLogin && r.ownerLogin !== viewer;

  const dropRepo = (e: React.MouseEvent, fullName: string): void => {
    e.stopPropagation();
    cfg.hideRepo(fullName);
    setHidden(cfg.loadHiddenRepos());
  };

  const submit = (): void => {
    const parsed = parseRepoInput(value.trim());
    if (parsed) props.onPick(`${parsed.owner}/${parsed.repo}`);
  };

  return (
    <div ref={wrap} style={{ position: 'absolute', inset: 0, zIndex: 50 }}>
      <div className="gw-pop left" style={{ top: 44, position: 'absolute', width: 'min(380px, calc(100% - 20px))' }}>
        {!manage ? (
          <>
            <form className="gw-formrow" onSubmit={(e) => { e.preventDefault(); submit(); }}>
              <input className="gw-input" placeholder={props.hasToken ? '过滤我的仓库 / 搜索公开仓库 / owner/repo' : 'owner/repo 或粘贴仓库 URL'}
                value={value} onChange={(e) => setValue(e.target.value)} autoFocus />
              <button className="gw-btn primary" type="submit">切换</button>
            </form>

            {props.recent.length > 0 && (
              <>
                <div className="gw-pop-title" style={{ paddingTop: 8 }}>最近使用</div>
                {recent.map((full) => {
                  const owner = full.split('/')[0];
                  const droppable = viewer === null || owner !== viewer;
                  return (
                    <button key={`r:${full}`} className={`gw-pop-item ${full === props.current ? 'cur' : ''}`}
                      onClick={() => props.onPick(full)}>
                      <span className="gw-dot" />{full}
                      {full === props.current && <span className="gw-pop-cur">当前</span>}
                      {droppable && (
                        <span className="gw-x" title="移除(他人的仓同时加入隐藏名单)"
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={(e) => dropFromRecent(e as unknown as React.MouseEvent, full)}>
                          <GwIcon name="trash" size={10} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </>
            )}

            {props.hasToken && (
              <>
                <div className="gw-pop-title" style={{ paddingTop: 8 }}>
                  有权限的仓库 · 可见 {visibleMine.length}/{mineAll.length}
                </div>
                {!repos && !loadErr && <div className="gw-pop-hint">拉取列表…</div>}
                {mineFiltered.map((r) => (
                  <button key={r.fullName} className={`gw-pop-item ${r.fullName === props.current ? 'cur' : ''}`}
                    onClick={() => props.onPick(r.fullName)} title={r.description ?? r.fullName}>
                    <GwIcon name="lock" size={9}
                      style={{ color: 'var(--dsw-alias-label-tertiary)', opacity: r.isPrivate ? 1 : 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.fullName}</span>
                    <span className="gw-meta" style={{ marginLeft: 'auto', paddingLeft: 8 }}>{timeAgo(r.pushedAt)}</span>
                    {canDrop(r) && (
                      <span className="gw-x" title="从列表移除(不影响 GitHub)"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => dropRepo(e as unknown as React.MouseEvent, r.fullName)}>
                        <GwIcon name="trash" size={10} />
                      </span>
                    )}
                  </button>
                ))}
                {hidden.length > 0 && (
                  <div className="gw-pop-hint" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>已隐藏 {hidden.length} 个非本人仓库</span>
                    <button className="gw-btn" style={{ padding: '1px 8px' }} onClick={() => setManage(true)}>管理</button>
                  </div>
                )}
              </>
            )}
            {loadErr && <div className="gw-errbox">{loadErr}</div>}
            {!props.hasToken && (
              <div className="gw-pop-hint">💡 在 ⚙ 填 Token 后自动列出你有权限的仓库。</div>
            )}

            {(q.length >= 3 || searching) && !manage && (
              <>
                <div className="gw-pop-title" style={{ paddingTop: 8 }}>公开仓库搜索「{q}」</div>
                {searching && <div className="gw-pop-hint">搜索中…</div>}
                {!searching && pub && pub.length === 0 && <div className="gw-pop-hint">无结果。</div>}
                {(pub ?? []).map((r) => (
                  <button key={`p:${r.fullName}`} className="gw-pop-item"
                    onClick={() => props.onPick(r.fullName)} title={r.description ?? r.fullName}>
                    <GwIcon name="octo" size={11} style={{ color: 'var(--dsw-alias-label-tertiary)' }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.fullName}</span>
                    <span className="gw-meta" style={{ marginLeft: 'auto', paddingLeft: 8 }}>⭐ {r.stars}</span>
                  </button>
                ))}
                <div className="gw-pop-hint">提示:回车按输入内容解析为 owner/repo。</div>
              </>
            )}
          </>
        ) : (
          <>
            <div className="gw-pop-title">已隐藏的仓库({hidden.length})—— 仅从本列表移除,不影响 GitHub</div>
            <div style={{ maxHeight: 240, overflow: 'auto' }}>
              {hidden.map((full) => (
                <button key={full} className="gw-pop-item" onClick={() => { cfg.unhideRepo(full); setHidden(cfg.loadHiddenRepos()); }}>
                  <GwIcon name="plus" size={10} />{full}
                  <span className="gw-pop-cur">恢复</span>
                </button>
              ))}
              {hidden.length === 0 && <div className="gw-pop-hint">空。</div>}
            </div>
            <div className="gw-formrow" style={{ justifyContent: 'flex-end', paddingTop: 6 }}>
              <button className="gw-btn" onClick={() => setManage(false)}>返回列表</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ---------- 设置弹层 ----------

function SettingsPopover(props: {
  token: string; onSaveToken: (t: string) => void;
  fontSize: cfg.FontSizePref; onSaveFontSize: (v: cfg.FontSizePref) => void;
  onClose: () => void;
}): ReactNode {
  const [tok, setTok] = useState(props.token);
  const [autoSec, setAutoSec] = useState(cfg.loadAutoRefreshSec());
  const [fontSel, setFontSel] = useState(props.fontSize);
  const wrap = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (e: MouseEvent): void => {
      if (!(e.target instanceof Node) || !wrap.current?.contains(e.target)) props.onClose();
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [props]);
  return (
    <div ref={wrap} style={{ position: 'absolute', inset: 0, zIndex: 50 }}>
      <div className="gw-pop right" style={{ top: 44, position: 'absolute' }}>
        <div className="gw-pop-title">GitHub 访问令牌(Personal Access Token)</div>
        <div className="gw-field">
          <input className="gw-input" type="password" placeholder="ghp_… / github_pat_…(留空 = 匿名只读)"
            value={tok} onChange={(e) => setTok(e.target.value)} autoFocus />
        </div>
        <div className="gw-field">
          <label>PR / Actions 自动刷新周期(秒,0 = 关闭)</label>
          <input className="gw-input" type="number" min={0} max={120} value={autoSec}
            onChange={(e) => setAutoSec(Number(e.target.value) || 0)} />
        </div>
        <div className="gw-field">
          <label>正文字号(Issue / PR 列表与详情)</label>
          <select className="gw-input" value={fontSel} onChange={(e) => setFontSel(e.target.value as cfg.FontSizePref)}
            style={{ appearance: 'auto', paddingRight: 8 }}>
            <option value="dsh">跟随 DSH 侧边栏(12px,默认)</option>
            <option value="13">13 px(紧凑)</option>
            <option value="14">14 px</option>
            <option value="14">14 px(大)</option>
          </select>
        </div>
        <div className="gw-formrow" style={{ justifyContent: 'flex-end', paddingTop: 6 }}>
          <button className="gw-btn primary" onClick={() => {
            props.onSaveToken(tok.trim());
            cfg.saveAutoRefreshSec(autoSec);
            props.onSaveFontSize(fontSel);
            props.onClose();
          }}>保存</button>
        </div>
        <div className="gw-pop-hint">
          细粒度 Token 权限:Contents(R)、Issues(RW)、Pull requests(RW)、Actions(RW);
          经典 Token 用 <code>repo</code>。仅保存在本浏览器,不经过任何服务端。
        </div>
      </div>
    </div>
  );
}

// ---------- 确认气泡 ----------

function ConfirmDialog(props: { opts: ConfirmOptions; onDone: (v: boolean) => void }): ReactNode {
  const { opts } = props;
  return (
    <div className="gw-scrim" onMouseDown={(e) => { if (e.target === e.currentTarget) props.onDone(false); }}>
      <div className="gw-dialog">
        <h4>{opts.title}</h4>
        {opts.body && <p>{opts.body}</p>}
        <div className="gw-dialog-actions">
          <button className="gw-btn" onClick={() => props.onDone(false)}>取消</button>
          <button className={`gw-btn ${opts.danger ? 'danger' : 'primary'}`} autoFocus
            onClick={() => props.onDone(true)}>
            {opts.confirmText ?? '确认'}
          </button>
        </div>
      </div>
    </div>
  );
}
