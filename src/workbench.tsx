/**
 * Main GitHub Workbench application: header controls, four subtab routes, and
 * shared confirmation and toast infrastructure. The tab and standalone mounts
 * share this component; .gw-root fills its host container.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { GwIcon } from './icons.ts';
import * as api from './api.ts';
import * as cfg from './config.ts';
import { ghRefKey, parseGithubUrl, parseRepoInput, timeAgo, type GhRef } from './lib.ts';
import { ensureStyles } from './styles.ts';
import { CodeView } from './code-view.tsx';
import { IssuesView } from './issues-view.tsx';
import { PullsView } from './pulls-view.tsx';
import { ActionsView } from './actions-view.tsx';
import { getInboxStore } from './inbox-store.ts';
import type { InboxItem } from './inbox-store.ts';
import { InboxOverlay, InboxReturnBar, useInboxSnapshot } from './inbox-view.tsx';
import { t, type WorkbenchKey } from './locales.ts';

// ---------- Cross-view UI capabilities ----------

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
const SUBTABS: readonly { id: Subtab; icon: Parameters<typeof GwIcon>[0]['name']; labelKey: WorkbenchKey }[] = [
  { id: 'code', icon: 'code', labelKey: 'tab.code' },
  { id: 'issues', icon: 'issue', labelKey: 'tab.issues' },
  { id: 'pulls', icon: 'pr', labelKey: 'tab.prs' },
  { id: 'actions', icon: 'play', labelKey: 'tab.actions' },
];

function isSubtab(v: string): v is Subtab {
  return SUBTABS.some((t) => t.id === v);
}

export interface WorkbenchAppProps {
  sessionId: string;
  cwd?: string;
  visible: boolean;
  /** GitHub URL carried by tab.path for chat deep links. */
  seedUrl?: string;
}

export function WorkbenchApp({ sessionId, visible, seedUrl }: WorkbenchAppProps): ReactNode {
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
  const [deep, setDeep] = useState<{ tab: Subtab; number?: number } | null>(null);
  const [inboxOpen, setInboxOpen] = useState(false);
  const [returnSnap, setReturnSnap] = useState<{
    repoFull: string; branch: string; subtab: Subtab; detailNumber?: number;
  } | null>(null);
  const inboxStore = getInboxStore();
  const inboxSnap = useInboxSnapshot(inboxStore);
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

  // Inject styles and merge the host token once on mount.
  useEffect(() => {
    ensureStyles();
    cfg.absorbHostToken({
      effect(fn) { fn(); },
    });
    setToken(cfg.loadToken());
  }, []);

  // A tab.path change switches repository, tab, and optional detail number.
  useEffect(() => {
    if (!seedUrl) return;
    const m = parseGithubUrl(seedUrl);
    if (!m) return;
    applyRepo(ghRefKey(m.ref));
    if (m.kind === 'issues') { switchTab('issues'); setDeep({ tab: 'issues', number: m.number }); }
    else if (m.kind === 'pulls') { switchTab('pulls'); setDeep({ tab: 'pulls', number: m.number }); }
    else if (m.kind === 'actions') { switchTab('actions'); setDeep({ tab: 'actions' }); }
    else { switchTab('code'); setDeep(null); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seedUrl]);

  // Detect a repository from the workspace when none is selected.
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

  // Load repository metadata and branches.
  useEffect(() => {
    if (!ref) return;
    let dead = false;
    setError(null);
    api.getRepoMeta(ref)
      .then((m) => { if (!dead) setMeta(m); })
      .catch((e) => { if (!dead) setError(errText(e)); });
    api.getBranches(ref)
      .then((b) => { if (!dead) setBranches(b); })
      .catch(() => { /* A branch-list failure is not fatal. */ });
    return () => { dead = true; };
  }, [ref?.owner, ref?.repo]);

  // Keep the footer quota synchronized while visible.
  useEffect(() => {
    if (!visible) return;
    setRate(api.rateRemaining());
    const t = setInterval(() => setRate(api.rateRemaining()), 3000);
    return () => clearInterval(t);
  }, [visible]);

  const effBranch = branch || meta?.defaultBranch || '';

  function applyRepo(fullName: string, opts?: { fromInbox?: boolean }): void {
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
    if (!opts?.fromInbox) {
      setInboxOpen(false);
      setReturnSnap(null);
    }
  }

  function openInbox(): void {
    setRepoPop(false);
    setSetPop(false);
    if (inboxOpen) {
      setInboxOpen(false);
      return;
    }
    setReturnSnap((prev) => prev ?? {
      repoFull, branch: effBranch, subtab, detailNumber: deep?.number,
    });
    setInboxOpen(true);
  }

  function restoreSnap(): void {
    const snap = returnSnap;
    setInboxOpen(false);
    setReturnSnap(null);
    if (!snap) return;
    applyRepo(snap.repoFull, { fromInbox: true });
    if (snap.branch) {
      setBranch(snap.branch);
      cfg.saveBranch(snap.branch);
    }
    switchTab(snap.subtab);
    setDeep(snap.detailNumber != null ? { tab: snap.subtab, number: snap.detailNumber } : null);
  }

  function jumpInbox(item: InboxItem): void {
    inboxStore.markRead(item.key);
    setInboxOpen(false);
    const full = `${item.owner}/${item.repo}`;
    if (full !== repoFull) applyRepo(full, { fromInbox: true });
    if (item.kind === 'pr') {
      switchTab('pulls');
      setDeep({ tab: 'pulls', number: item.number });
    } else if (item.kind === 'actions') {
      switchTab('actions');
      setDeep({ tab: 'actions' });
    } else {
      switchTab('issues');
      setDeep({ tab: 'issues', number: item.number });
    }
  }

  const switchTab = useCallback((id: Subtab) => {
    setSubtab(id);
    cfg.saveSubtab(id);
  }, []);

  const onCount = useCallback((id: Subtab) => (n: number) => {
    setCounts((prev) => (prev[id] === n ? prev : { ...prev, [id]: n }));
  }, []);

  useEffect(() => {
    inboxStore.setExtraWatchRepo(meta?.isPrivate ? null : (repoFull || null));
  }, [inboxStore, repoFull, meta?.isPrivate]);

  // ---------- Confirmation and toast state ----------
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

  useEffect(() => {
    inboxStore.setOnFresh(visible ? (fresh) => {
      const top = fresh[0];
      if (top) {
        const kind = top.kind === 'pr'
          ? t('inbox.kindPr')
          : top.kind === 'actions' ? t('inbox.kindActions') : t('inbox.kindIssue');
        const id = top.kind === 'actions'
          ? t('inbox.runNumber', { number: top.number })
          : `#${top.number}`;
        ui.toast(t('inbox.fresh', { kind, repo: `${top.owner}/${top.repo}`, id }), 'ok');
      }
    } : null);
    return () => inboxStore.setOnFresh(null);
  }, [visible, ui, inboxStore]);

  // ---------- Render ----------

  const header = (
    <div className="gw-header">
      <GwIcon name="octo" size={19} />
      <button className="gw-repo-btn" onClick={() => { setRepoPop((v) => !v); setSetPop(false); }}
        title={t('workbench.selectRepository')}>
        <span className="gw-repo-name">{repoFull || t('mount.standaloneTitle')}</span>
        <GwIcon name="chevron-down" size={12} style={{ color: 'var(--dsw-alias-label-tertiary)' }} />
      </button>
      {meta?.isPrivate && <span className="gw-chip"><GwIcon name="lock" size={9} />{t('workbench.private')}</span>}
      <select className="gw-select" value={effBranch} title={t('workbench.branchSelector')}
        onChange={(e) => { setBranch(e.target.value); cfg.saveBranch(e.target.value); }}>
        {(branches.length ? branches : (meta ? [{ name: meta.defaultBranch }] : [])).map((b) => (
          <option key={b.name} value={b.name}>{b.name}</option>
        ))}
        {meta && !branches.some((b) => b.name === meta.defaultBranch) && <option value={meta.defaultBranch}>{meta.defaultBranch}</option>}
      </select>
      <button className="gw-hbtn" title={t('file.openOnGitHub')}
        onClick={() => window.open(meta?.htmlUrl || `https://github.com/${repoFull}`, '_blank', 'noopener')}>
        <GwIcon name="external-link" size={14} />
      </button>
      <button className={`gw-hbtn${inboxSnap.unreadCount > 0 ? ' has-unread' : ''}`}
        title={inboxSnap.unreadCount > 0 ? t('inbox.unreadCount', { count: inboxSnap.unreadCount }) : t('inbox.title')}
        onClick={openInbox}>
        <GwIcon name="inbox" size={14} />
        {inboxSnap.unreadCount > 0 && (
          <span className="gw-inbox-badge">{inboxSnap.unreadCount > 99 ? '99+' : inboxSnap.unreadCount}</span>
        )}
      </button>
      <button className="gw-hbtn" title={t('actions.refresh')} onClick={() => setReload((n) => n + 1)}>
        <GwIcon name="refresh" size={14} />
      </button>
      <button className="gw-hbtn" title={t('workbench.settings')} onClick={() => { setSetPop((v) => !v); setRepoPop(false); }}>
        <GwIcon name="gear" size={14} />
      </button>
      <span className={`gw-dot ${token ? 'ok' : ''}`}
        title={token ? t('workbench.authPat') : t('workbench.authAnonymous')} />
    </div>
  );

  const body = !ref ? (
    <SetupCard detecting={detecting} onSubmit={applyRepo} error={error} />
  ) : (
    <>
      <div className="gw-tabs">
        {SUBTABS.map((tabItem) => (
          <button key={tabItem.id} className={`gw-tab ${subtab === tabItem.id ? 'on' : ''}`} onClick={() => switchTab(tabItem.id)}>
            <GwIcon name={tabItem.icon} size={13} />{t(tabItem.labelKey)}
            {counts[tabItem.id] !== undefined && <span className="gw-count">{counts[tabItem.id]}</span>}
          </button>
        ))}
      </div>
      <div className="gw-body">
        <ViewPort subtab={subtab} reloadKey={`${ghRefKey(ref)}@${effBranch}#${reload}`}
          ghRef={ref} branch={effBranch} branches={branches} visible={visible} onCount={onCount}
          initialDetail={deep && ((subtab === 'issues' && deep.tab === 'issues') || (subtab === 'pulls' && deep.tab === 'pulls')) ? deep.number ?? null : null}
          onConsumeDeep={() => setDeep(null)} />
      </div>
      <div className="gw-footer">
        <span>{t('workbench.api')}</span>
        <span>{t('workbench.footerStatus', {
          remaining: rate != null ? String(rate) : '—',
          auth: token ? t('workbench.authPat') : t('workbench.authAnonymous'),
          width: paneW,
        })}</span>
      </div>
    </>
  );

  return (
    <UICtx.Provider value={ui}>
      <div ref={rootRef} className="gw-root"
        style={fontSize === 'dsh' ? undefined : ({ '--gw-body-size': fontSize } as React.CSSProperties)}>
        {header}
        {returnSnap && !inboxOpen && (
          <InboxReturnBar label={returnSnap.repoFull || t('inbox.originalRepo')} onReturn={restoreSnap} />
        )}
        <div style={{ flex: 1, minHeight: 0, position: 'relative', display: 'flex', flexDirection: 'column' }}>
          {body}
          {inboxOpen && (
            <InboxOverlay store={inboxStore} snapLabel={returnSnap?.repoFull ?? null}
              onReturn={restoreSnap} onJump={jumpInbox} />
          )}
        </div>
        {repoPop && (
          <RepoPopover recent={cfg.loadRecentRepos()} current={repoFull} hasToken={!!token}
            onPick={(full) => { applyRepo(full); setRepoPop(false); }}
            onClose={() => setRepoPop(false)} />
        )}
        {setPop && (
          <SettingsPopover token={token} onSaveToken={(t) => {
            cfg.saveToken(t); api.setToken(t); setToken(t);
            void inboxStore.pollOnce();
          }}
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

// ---------- Viewport dispatch ----------

interface ViewPortProps {
  subtab: Subtab;
  reloadKey: string;
  ghRef: GhRef;
  branch: string;
  branches: api.BranchLite[];
  visible: boolean;
  onCount: (id: Subtab) => (n: number) => void;
  initialDetail: number | null;
  onConsumeDeep: () => void;
}

function ViewPort(p: ViewPortProps): ReactNode {
  switch (p.subtab) {
    case 'code':
      return <CodeView key={`c:${p.reloadKey}`} ghRef={p.ghRef} branch={p.branch} />;
    case 'issues':
      return <IssuesView key={`i:${p.reloadKey}`} ghRef={p.ghRef} visible={p.visible} onCount={p.onCount('issues')} initialDetail={p.initialDetail} onConsumeDeep={p.onConsumeDeep} />;
    case 'pulls':
      return <PullsView key={`p:${p.reloadKey}`} ghRef={p.ghRef} branches={p.branches} visible={p.visible} onCount={p.onCount('pulls')} initialDetail={p.initialDetail} onConsumeDeep={p.onConsumeDeep} />;
    case 'actions':
      return <ActionsView key={`a:${p.reloadKey}`} ghRef={p.ghRef} visible={p.visible} onCount={p.onCount('actions')} />;
  }
}

// ---------- Initial setup card ----------

function SetupCard(props: { detecting: boolean; error: string | null; onSubmit: (fullName: string) => void }): ReactNode {
  const [value, setValue] = useState('');
  return (
    <div className="gw-empty">
      <div style={{ maxWidth: 340, width: '100%' }}>
        <GwIcon name="octo" size={40} style={{ margin: '0 auto 14px', color: 'var(--dsw-alias-label-tertiary)' }} />
        <div style={{ marginBottom: 10, lineHeight: 1.7 }}>
          {props.detecting ? t('loadingTree') : t('workbench.repoPrompt')}
        </div>
        <form className="gw-formrow" onSubmit={(e) => { e.preventDefault(); props.onSubmit(value); }}>
          <input className="gw-input" placeholder="owner/repo" value={value}
            onChange={(e) => setValue(e.target.value)} autoFocus />
          <button className="gw-btn primary" type="submit">{t('workbench.loadRepository')}</button>
        </form>
        {props.error && <div className="gw-errbox">{props.error}</div>}
      </div>
    </div>
  );
}

// ---------- Repository switcher ----------

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
    if (viewer === null || owner !== viewer) cfg.hideRepo(full); // Hide repositories owned by someone else.
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

  // Public repository search uses a 450ms debounce and three-character threshold.
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

  // A repository is removable when its owner differs from the viewer.
  // If /user is unavailable, allow removal because the management view can restore it.
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
              <input className="gw-input" placeholder={props.hasToken ? t('workbench.repoFilterPlaceholder') : t('workbench.repoPrompt')}
                value={value} onChange={(e) => setValue(e.target.value)} autoFocus />
              <button className="gw-btn primary" type="submit">{t('workbench.switchRepository')}</button>
            </form>

            {props.recent.length > 0 && (
              <>
                <div className="gw-pop-title" style={{ paddingTop: 8 }}>{t('workbench.recent')}</div>
                {recent.map((full) => {
                  const owner = full.split('/')[0];
                  const droppable = viewer === null || owner !== viewer;
                  return (
                    <button key={`r:${full}`} className={`gw-pop-item ${full === props.current ? 'cur' : ''}`}
                      onClick={() => props.onPick(full)}>
                      <span className="gw-dot" />{full}
                      {full === props.current && <span className="gw-pop-cur">{t('issues.open')}</span>}
                      {droppable && (
                        <span className="gw-x" title={t('workbench.remove')}
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
                  {t('workbench.repos', { count: visibleMine.length, total: mineAll.length })}
                </div>
                {!repos && !loadErr && <div className="gw-pop-hint">{t('loading')}</div>}
                {mineFiltered.map((r) => (
                  <button key={r.fullName} className={`gw-pop-item ${r.fullName === props.current ? 'cur' : ''}`}
                    onClick={() => props.onPick(r.fullName)} title={r.description ?? r.fullName}>
                    <GwIcon name="lock" size={9}
                      style={{ color: 'var(--dsw-alias-label-tertiary)', opacity: r.isPrivate ? 1 : 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.fullName}</span>
                    <span className="gw-meta" style={{ marginLeft: 'auto', paddingLeft: 8 }}>{timeAgo(r.pushedAt)}</span>
                    {canDrop(r) && (
                      <span className="gw-x" title={t('workbench.removeFromList')}
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => dropRepo(e as unknown as React.MouseEvent, r.fullName)}>
                        <GwIcon name="trash" size={10} />
                      </span>
                    )}
                  </button>
                ))}
                {hidden.length > 0 && (
                  <div className="gw-pop-hint" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{t('workbench.hidden', { count: hidden.length })}</span>
                    <button className="gw-btn" style={{ padding: '1px 8px' }} onClick={() => setManage(true)}>{t('workbench.manage')}</button>
                  </div>
                )}
              </>
            )}
            {loadErr && <div className="gw-errbox">{loadErr}</div>}
            {!props.hasToken && (
              <div className="gw-pop-hint">{t('workbench.patHint')}</div>
            )}

            {(q.length >= 3 || searching) && !manage && (
              <>
                <div className="gw-pop-title" style={{ paddingTop: 8 }}>{t('workbench.search', { query: q })}</div>
                {searching && <div className="gw-pop-hint">{t('loading')}</div>}
                {!searching && pub && pub.length === 0 && <div className="gw-pop-hint">{t('workbench.noResults')}</div>}
                {(pub ?? []).map((r) => (
                  <button key={`p:${r.fullName}`} className="gw-pop-item"
                    onClick={() => props.onPick(r.fullName)} title={r.description ?? r.fullName}>
                    <GwIcon name="octo" size={11} style={{ color: 'var(--dsw-alias-label-tertiary)' }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.fullName}</span>
                    <span className="gw-meta" style={{ marginLeft: 'auto', paddingLeft: 8 }}>⭐ {r.stars}</span>
                  </button>
                ))}
                <div className="gw-pop-hint">{t('workbench.pressEnter')}</div>
              </>
            )}
          </>
        ) : (
          <>
            <div className="gw-pop-title">{t('workbench.hiddenRepos', { count: hidden.length })}</div>
            <div style={{ maxHeight: 240, overflow: 'auto' }}>
              {hidden.map((full) => (
                <button key={full} className="gw-pop-item" onClick={() => { cfg.unhideRepo(full); setHidden(cfg.loadHiddenRepos()); }}>
                  <GwIcon name="plus" size={10} />{full}
                  <span className="gw-pop-cur">{t('workbench.restore')}</span>
                </button>
              ))}
              {hidden.length === 0 && <div className="gw-pop-hint">{t('workbench.empty')}</div>}
            </div>
            <div className="gw-formrow" style={{ justifyContent: 'flex-end', paddingTop: 6 }}>
              <button className="gw-btn" onClick={() => setManage(false)}>{t('issues.backToList')}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ---------- Settings popover ----------

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
        <div className="gw-pop-title">{t('workbench.patTitle')}</div>
        <div className="gw-field">
          <input className="gw-input" type="password" placeholder="ghp_… / github_pat_…"
            value={tok} onChange={(e) => setTok(e.target.value)} autoFocus />
        </div>
        <div className="gw-field">
          <label>{t('workbench.autoRefreshOff', { label: t('mount.settingsAutoRefresh') })}</label>
          <input className="gw-input" type="number" min={0} max={120} value={autoSec}
            onChange={(e) => setAutoSec(Number(e.target.value) || 0)} />
        </div>
        <div className="gw-field">
          <label>{t('workbench.fontSize')}</label>
          <select className="gw-input" value={fontSel} onChange={(e) => setFontSel(e.target.value as cfg.FontSizePref)}
            style={{ appearance: 'auto', paddingRight: 8 }}>
            <option value="dsh">{t('workbench.followSidebar')}</option>
            <option value="13">13 px</option>
            <option value="14">14 px</option>
          </select>
        </div>
        <div className="gw-formrow" style={{ justifyContent: 'flex-end', paddingTop: 6 }}>
          <button className="gw-btn primary" onClick={() => {
            props.onSaveToken(tok.trim());
            cfg.saveAutoRefreshSec(autoSec);
            props.onSaveFontSize(fontSel);
            props.onClose();
          }}>{t('comments.save')}</button>
        </div>
        <div className="gw-pop-hint" dangerouslySetInnerHTML={{ __html: t('workbench.tokenScopes') }} />
      </div>
    </div>
  );
}

// ---------- Confirm dialog ----------

function ConfirmDialog(props: { opts: ConfirmOptions; onDone: (v: boolean) => void }): ReactNode {
  const { opts } = props;
  return (
    <div className="gw-scrim" onMouseDown={(e) => { if (e.target === e.currentTarget) props.onDone(false); }}>
      <div className="gw-dialog">
        <h4>{opts.title}</h4>
        {opts.body && <p>{opts.body}</p>}
        <div className="gw-dialog-actions">
          <button className="gw-btn" onClick={() => props.onDone(false)}>{t('confirm.no')}</button>
          <button className={`gw-btn ${opts.danger ? 'danger' : 'primary'}`} autoFocus
            onClick={() => props.onDone(true)}>
            {opts.confirmText ?? t('confirm.yes')}
          </button>
        </div>
      </div>
    </div>
  );
}
