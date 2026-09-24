/**
 * Pull requests tab: list and creation flow plus a detail drawer with diffstat,
 * check-run summaries, merge confirmation, close/reopen, and comments.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { GwIcon } from './icons.ts';
import * as api from './api.ts';
import { inboxItemKey, timeAgo, type GhRef } from './lib.ts';
import { getInboxStore } from './inbox-store.ts';
import { Loading, ErrorBox, Empty } from './ui.tsx';
import { errText, useUI } from './workbench.tsx';
import { CommentsBlock, CommentComposer } from './comments.tsx';
import { StateIcon, type ListViewProps } from './issues-view.tsx';
import { t, type WorkbenchKey } from './locales.ts';

type MergeMethod = 'merge' | 'squash' | 'rebase';
const METHOD_LABEL: Record<MergeMethod, WorkbenchKey> = {
  merge: 'pulls.mergeMethod.merge',
  squash: 'pulls.mergeMethod.squash',
  rebase: 'pulls.mergeMethod.rebase',
};
const FILTER_LABEL: Record<api.PullFilter, WorkbenchKey> = {
  open: 'pulls.filterOpen', closed: 'pulls.filterClosed', merged: 'pulls.filterMerged',
};

export function PullsView({ ghRef, branches, visible, onCount, initialDetail, onConsumeDeep }: ListViewProps & { branches: api.BranchLite[] }): ReactNode {
  const ui = useUI();
  const [list, setList] = useState<api.GhPull[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<number | null>(initialDetail ?? null);
  useEffect(() => { if (initialDetail != null) onConsumeDeep?.(); }, [initialDetail]);
  const [showNew, setShowNew] = useState(false);
  const [stateFilter, setStateFilter] = useState<api.PullFilter>('open');
  const [sort, setSort] = useState<api.ListSort>('created');
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const reqId = useRef(0);

  const load = useCallback((silent: boolean, pageUrl?: string) => {
    const id = pageUrl ? reqId.current : ++reqId.current;
    if (pageUrl) setLoadingMore(true);
    else if (!silent) setList(null);
    setError(null);
    api.listPulls(ghRef, stateFilter, sort, pageUrl)
      .then((page) => {
        if (id !== reqId.current) return;
        setList((prev) => (pageUrl && prev ? [...prev, ...page.items] : page.items));
        setNextUrl(page.nextUrl);
        setTotal(page.totalCount);
        if (stateFilter === 'open' && page.totalCount != null) onCount(page.totalCount);
      })
      .catch((e) => { if (id === reqId.current) setError(errText(e)); })
      .finally(() => { if (id === reqId.current) setLoadingMore(false); });
  }, [ghRef.owner, ghRef.repo, onCount, stateFilter, sort]);

  useEffect(() => {
    setList(null); setDetail(null); setNextUrl(null);
    load(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ghRef.owner, ghRef.repo, stateFilter, sort]);

  // Auto-refresh is gated by visibility and remains silent.
  useEffect(() => {
    const sec = Number(localStorage.getItem('gw.autoSec') ?? 0);
    if (!visible || sec <= 0) return;
    const t = setInterval(() => load(true), sec * 1000);
    return () => clearInterval(t);
  }, [visible, load]);

  return (
    <div className="gw-colpane" style={{ flex: 1, minHeight: 0, display: 'flex' }}>
      <div className="gw-toolbar">
        <span className="gw-open-count">{list
          ? `${list.length}${total != null ? ` / ${total}` : ''} ${t(FILTER_LABEL[stateFilter])}`
          : '…'}</span>
        <span style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <select className="gw-select" style={{ marginLeft: 0, maxWidth: 118 }}
            value={sort} onChange={(e) => setSort(e.target.value as api.ListSort)} title={t('issues.sortCreated')}>
            <option value="created">{t('issues.sortCreated')}</option>
            <option value="updated">{t('issues.sortUpdated')}</option>
          </select>
          <button className={`gw-btn ${stateFilter === 'open' ? 'primary' : ''}`}
            onClick={() => setStateFilter('open')}>{t('pulls.filterOpen')}</button>
          <button className={`gw-btn ${stateFilter === 'closed' ? 'primary' : ''}`}
            onClick={() => setStateFilter('closed')}>{t('pulls.filterClosed')}</button>
          <button className={`gw-btn ${stateFilter === 'merged' ? 'primary' : ''}`}
            onClick={() => setStateFilter('merged')}>{t('pulls.filterMerged')}</button>
          <button className="gw-btn primary" onClick={() => setShowNew(true)}>
            <GwIcon name="plus" size={12} />{t('pulls.new')}
          </button>
        </span>
      </div>
      <div className="gw-list">
        {error && <ErrorBox msg={error} onRetry={() => load(true)} />}
        {!error && !list && <Loading />}
        {list?.length === 0 && <Empty>{stateFilter === 'open'
          ? t('pulls.emptyOpen')
          : stateFilter === 'merged' ? t('pulls.emptyMerged') : t('pulls.emptyClosed')}</Empty>}
        {list?.map((pr) => (
          <button key={pr.number} className="gw-row" onClick={() => setDetail(pr.number)}>
            <span className="gw-stateic"
              style={{ color: stateFilter === 'merged' || (pr.merged_at && pr.state === 'closed')
                ? 'var(--dsw-alias-state-merged, #a371f7)'
                : pr.state === 'closed'
                ? 'var(--dsw-alias-state-danger-primary)'
                : pr.draft ? 'var(--dsw-alias-label-tertiary)'
                : 'var(--dsw-alias-state-success-primary)' }}>
              <GwIcon name={stateFilter === 'merged' || pr.merged_at ? 'merge' : pr.state === 'closed' ? 'x-circle' : 'pr'} />
            </span>
            <span className="gw-rowmain">
              <span className="gw-rowtitle">
                {pr.title}{pr.draft && <span className="gw-chip" style={{ marginLeft: 6 }}>{t('pulls.draft')}</span>}
              </span>
              <span className="gw-rowsub">
                #{pr.number}
                {pr.head.ref && <> · <span className="gw-branch-chip">{pr.head.ref} → {pr.base.ref}</span></>}
                 · {timeAgo(pr.updated_at)}
              </span>
            </span>
            <span className="gw-meta">{t('pulls.updated')}<br />{timeAgo(pr.updated_at)}</span>
          </button>
        ))}
        {nextUrl && (
          <div className="gw-more">
            <button className="gw-btn" disabled={loadingMore} onClick={() => load(true, nextUrl)}>
              {loadingMore ? t('loading') : t('loadMore')}
            </button>
          </div>
        )}
        {!nextUrl && total != null && (list?.length ?? 0) >= 1000 && total > 1000 && (
          <div className="gw-muted" style={{ textAlign: 'center', padding: '8px 12px 14px' }}>
            {t('search.limit')}
          </div>
        )}
      </div>

      {showNew && (
        <NewPRDrawer ghRef={ghRef} branches={branches}
          onClose={() => setShowNew(false)}
          onCreated={(n) => { setShowNew(false); load(true); setDetail(n); }} />
      )}
      {detail !== null && (
        <PullDrawer key={detail} ghRef={ghRef} number={detail}
          onClose={() => setDetail(null)} onChanged={() => load(true)} />
      )}
    </div>
  );
}

// ---------- New PR ----------

function NewPRDrawer(props: {
  ghRef: GhRef; branches: api.BranchLite[];
  onClose: () => void; onCreated: (n: number) => void;
}): ReactNode {
  const ui = useUI();
  const defBase = props.branches[0]?.name ?? '';
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [head, setHead] = useState('');
  const [base, setBase] = useState(defBase);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 30, display: 'flex' }}>
      <div className="gw-detail" style={{ position: 'static', flex: 1 }}>
        <div className="gw-detail-head">
          <button className="gw-btn backbtn" onClick={props.onClose}><GwIcon name="chevron-left" size={12} />{t('issues.backToList')}</button>
          <div style={{ fontWeight: 600, marginTop: 6 }}>{t('pulls.newTitle')}</div>
        </div>
        <div className="gw-detail-body" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="gw-formrow">
            <div className="gw-field" style={{ flex: 1 }}>
              <label>{t('pulls.head')}</label>
              <input className="gw-input" placeholder="feature/xxx" value={head} list="gw-branches"
                onChange={(e) => setHead(e.target.value)} autoFocus />
              <datalist id="gw-branches">
                {props.branches.map((b) => <option key={b.name} value={b.name} />)}
              </datalist>
            </div>
            <div className="gw-field" style={{ width: 140 }}>
              <label>{t('pulls.base')}</label>
              <select className="gw-input" value={base} onChange={(e) => setBase(e.target.value)}
                style={{ appearance: 'auto', backgroundImage: 'none', paddingRight: 8 }}>
                {props.branches.map((b) => <option key={b.name} value={b.name}>{b.name}</option>)}
              </select>
            </div>
          </div>
          <input className="gw-input" placeholder={t('issues.titlePlaceholder')} value={title}
            onChange={(e) => setTitle(e.target.value)} />
          <textarea className="gw-input gw-textarea" rows={6} placeholder={t('issues.bodyPlaceholder')}
            value={body} onChange={(e) => setBody(e.target.value)} />
          {error && <div className="gw-errbox">{error}</div>}
        </div>
        <div className="gw-composer">
          <div className="gw-composer-row" style={{ justifyContent: 'flex-end' }}>
            <button className="gw-btn" onClick={props.onClose}>{t('confirm.no')}</button>
            <button className="gw-btn primary" disabled={!title.trim() || !head.trim() || !base || busy}
              onClick={() => {
                setBusy(true); setError(null);
                api.createPull(props.ghRef, { title: title.trim(), body, head: head.trim(), base })
                  .then((pr) => { ui.toast(t('pulls.created', { number: pr.number }));
                  getInboxStore().markSelfCreated(inboxItemKey('pr', props.ghRef.owner, props.ghRef.repo, pr.number));
                  props.onCreated(pr.number); })
                  .catch((e) => setError(errText(e)))
                  .finally(() => setBusy(false));
              }}>{busy ? t('issues.creating') : t('pulls.create')}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Detail drawer ----------

function PullDrawer(props: { ghRef: GhRef; number: number; onClose: () => void; onChanged: () => void }): ReactNode {
  const ui = useUI();
  const [pull, setPull] = useState<api.GhPull | null>(null);
  const [comments, setComments] = useState<api.GhComment[]>([]);
  const [commentsNext, setCommentsNext] = useState<string | null>(null);
  const [loadingMoreComments, setLoadingMoreComments] = useState(false);
  const [checks, setChecks] = useState<api.GhCheckRun[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [method, setMethod] = useState<MergeMethod>('squash');
  const [busy, setBusy] = useState(false);

  const loadAll = useCallback(() => {
    setError(null);
    Promise.all([
      api.getPull(props.ghRef, props.number),
      api.listComments(props.ghRef, props.number),
    ])
      .then(([p, c]) => { setPull(p); setComments(c.items); setCommentsNext(c.nextUrl); })
      .catch((e) => setError(errText(e)));
  }, [props.ghRef.owner, props.ghRef.repo, props.number]);

  useEffect(() => { loadAll(); }, [loadAll]);

  useEffect(() => {
    if (!pull?.head.sha) return;
    setChecks(null);
    api.listCheckRuns(props.ghRef, pull.head.sha)
      .then(setChecks)
      .catch(() => setChecks([]));
  }, [pull?.head.sha, props.ghRef.owner, props.ghRef.repo]);

  if (error) {
    return (
      <div style={{ position: 'absolute', inset: 0, zIndex: 30, display: 'flex' }}>
        <div className="gw-detail" style={{ position: 'static', flex: 1 }}>
          <div className="gw-detail-head">
            <button className="gw-btn backbtn" onClick={props.onClose}>
              <GwIcon name="chevron-left" size={12} />{t('issues.backToList')}
            </button>
          </div>
          <ErrorBox msg={error} onRetry={loadAll} />
        </div>
      </div>
    );
  }
  if (!pull) return <Loading />;

  const closed = pull.state === 'closed';
  const merged = Boolean(pull.merged_at);
  const okChecks = checks?.filter((c) => c.conclusion === 'success').length ?? 0;
  const badChecks = checks?.filter((c) => c.conclusion && c.conclusion !== 'success' && c.conclusion !== 'skipped' && c.conclusion !== 'neutral').length ?? 0;
  const pendingChecks = checks?.filter((c) => !c.conclusion).length ?? 0;
  const canMerge = !closed && !pull.draft;

  async function doMerge(): Promise<void> {
    if (!pull) return;
    if (!(await ui.confirm({
      title: t('pulls.mergeConfirm', { method: t(METHOD_LABEL[method]), number: pull.number }),
      body: t('pulls.mergeBody', { head: pull.head.ref, base: pull.base.ref }),
      confirmText: t(METHOD_LABEL[method]), danger: true,
    }))) return;
    setBusy(true);
    try {
      await api.mergePull(props.ghRef, pull.number, method);
      ui.toast(t('pulls.merged', { number: pull.number, method: t(METHOD_LABEL[method]) }));
      props.onChanged(); loadAll();
    } catch (e) { ui.toast(errText(e), 'err'); }
    finally { setBusy(false); }
  }

  async function toggleState(): Promise<void> {
    if (!pull) return;
    const toClosed = !closed;
    if (toClosed && !(await ui.confirm({
      title: t('pulls.closeConfirm', { number: pull.number }), body: pull.title, confirmText: t('confirm.yes'), danger: true,
    }))) return;
    try {
      await api.patchIssue(props.ghRef, pull.number, { state: toClosed ? 'closed' : 'open' });
      ui.toast(toClosed ? t('pulls.closed', { number: pull.number }) : t('pulls.reopened', { number: pull.number }));
      props.onChanged(); loadAll();
    } catch (e) { ui.toast(errText(e), 'err'); }
  }

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 30, display: 'flex' }}>
      <div className="gw-detail" style={{ position: 'static', flex: 1 }}>
        <div className="gw-detail-head">
          <button className="gw-btn backbtn" onClick={props.onClose}>
            <GwIcon name="chevron-left" size={12} />{t('issues.backToList')}
          </button>
          <div style={{ fontWeight: 600, marginTop: 6, fontSize: 13 }}>
            <StateIcon closed={closed} merged={merged} />{pull.title} <span className="gw-muted">#{pull.number}</span>
          </div>
          <div className="gw-rowsub" style={{ marginTop: 3, flexWrap: 'wrap' }}>
            <span className="gw-branch-chip">{pull.head.label} → {pull.base.label}</span>
            {(pull.additions !== undefined) && (
              <span><span className="gw-diffstat-add">+{pull.additions}</span> <span className="gw-diffstat-del">−{pull.deletions}</span>
                {pull.changed_files !== undefined ? ` · ${t('pulls.files', { count: pull.changed_files })}` : ''}</span>
            )}
            · {t('pulls.createdAt')} {timeAgo(pull.created_at)}
            {checks !== null && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                ·
                {badChecks > 0
                  ? <span className="gw-checkdot" style={{ background: 'var(--dsw-alias-state-danger-primary)' }} />
                  : pendingChecks > 0
                    ? <span className="gw-checkdot" style={{ background: 'var(--dsw-alias-state-attention-primary)' }} />
                    : <span className="gw-checkdot" style={{ background: 'var(--dsw-alias-state-success-primary)' }} />}
                {badChecks > 0 ? t('pulls.checksFailed', { count: badChecks }) : pendingChecks > 0 ? t('pulls.checksPending') : t('pulls.checksPassed', { count: okChecks })}
              </span>
            )}
            <a className="gw-link" href={pull.html_url} target="_blank" rel="noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
              <GwIcon name="external-link" size={10} />GitHub
            </a>
          </div>

          {/* Merge controls */}
          {canMerge && (
            <div className="gw-composer-row" style={{ marginTop: 8 }}>
              <select className="gw-select" style={{ marginLeft: 0, maxWidth: 190 }}
                value={method} onChange={(e) => setMethod(e.target.value as MergeMethod)}>
                <option value="merge">{t('pulls.mergeMethod.mergeCommit')}</option>
                <option value="squash">{t('pulls.mergeMethod.squash')}</option>
                <option value="rebase">{t('pulls.mergeMethod.rebase')}</option>
              </select>
              <button className="gw-btn primary" disabled={busy || pull.mergeable === false}
                onClick={doMerge}>
                <GwIcon name="merge" size={12} />{t(METHOD_LABEL[method])}
              </button>
              {pull.mergeable === false && (
                <span className="gw-muted" style={{ fontSize: 10 }}>{t('pulls.mergeConflict')}</span>
              )}
            </div>
          )}

          {/* Check details */}
          {checks !== null && checks.length > 0 && (
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {checks.slice(0, 8).map((c) => (
                <a key={c.id} className="gw-rowsub gw-link" href={c.html_url} target="_blank" rel="noreferrer"
                  style={{ textDecoration: 'none' }}>
                  <CheckDot run={c} />{c.name ?? t('pulls.checkFallback')} · {c.conclusion ?? c.status}
                </a>
              ))}
              {checks.length > 8 && <span className="gw-muted">{t('pulls.moreChecks', { count: checks.length - 8 })}</span>}
            </div>
          )}
        </div>

        <div className="gw-detail-body">
          {pull.body || t('pulls.noDescription')}
          <CommentsBlock ghRef={props.ghRef} number={props.number} comments={comments} onChanged={loadAll}
            nextUrl={commentsNext} loadingMore={loadingMoreComments}
            onLoadMore={() => {
              if (!commentsNext) return;
              setLoadingMoreComments(true);
              api.listComments(props.ghRef, props.number, commentsNext)
                .then((page) => {
                  setComments((prev) => [...prev, ...page.items]);
                  setCommentsNext(page.nextUrl);
                })
                .catch((e) => ui.toast(errText(e), 'err'))
                .finally(() => setLoadingMoreComments(false));
            }} />
        </div>

        <div className="gw-composer">
          <CommentComposer ghRef={props.ghRef} number={props.number} onDone={loadAll} />
          <div className="gw-composer-row">
            <button className={`gw-btn ${closed ? '' : 'danger'}`} onClick={toggleState}>
              {closed ? t('pulls.reopen') : t('pulls.close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckDot(props: { run: api.GhCheckRun }): ReactNode {
  const color = props.run.conclusion === 'success' ? 'var(--dsw-alias-state-success-primary)'
    : props.run.conclusion && props.run.conclusion !== 'skipped' && props.run.conclusion !== 'neutral'
      ? 'var(--dsw-alias-state-danger-primary)'
      : 'var(--dsw-alias-state-attention-primary)';
  return <span className="gw-checkdot" style={{ background: color }} />;
}
