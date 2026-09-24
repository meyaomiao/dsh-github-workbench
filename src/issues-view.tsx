/**
 * Issues tab: list and create flow plus a detail drawer for the body, comments,
 * editing, and close/reopen actions. Closing an Issue requires confirmation.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { GwIcon, type IconName } from './icons.ts';
import * as api from './api.ts';
import { inboxItemKey, labelTextColor, timeAgo, type GhRef } from './lib.ts';
import { getInboxStore } from './inbox-store.ts';
import { Loading, ErrorBox, Empty } from './ui.tsx';
import { errText, useUI } from './workbench.tsx';
import { CommentComposer, CommentsBlock } from './comments.tsx';
import { t } from './locales.ts';

export interface ListViewProps {
  ghRef: GhRef;
  visible: boolean;
  onCount: (n: number) => void;
  /** External-link deep link: initially open Issue or PR number, consumed once. */
  initialDetail?: number | null;
  onConsumeDeep?: () => void;
}

export function IssuesView({ ghRef, onCount, initialDetail, onConsumeDeep }: ListViewProps): ReactNode {
  const ui = useUI();
  const [list, setList] = useState<api.GhIssue[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<number | null>(initialDetail ?? null);
  useEffect(() => { if (initialDetail != null) onConsumeDeep?.(); }, [initialDetail]);
  const [showNew, setShowNew] = useState(false);
  const [stateFilter, setStateFilter] = useState<api.IssueState>('open');
  const [sort, setSort] = useState<api.ListSort>('created');
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const reqId = useRef(0);

  // List loading: repository, filter, and sort changes reset the list; load-more appends; writes refresh silently.
  const load = useCallback((silent: boolean, pageUrl?: string) => {
    const id = pageUrl ? reqId.current : ++reqId.current;
    if (pageUrl) setLoadingMore(true);
    else if (!silent) setList(null);
    setError(null);
    api.listIssues(ghRef, stateFilter, sort, pageUrl)
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

  const reload = useCallback(() => load(true), [load]);

  return (
    <div className="gw-colpane" style={{ flex: 1, minHeight: 0, display: 'flex' }}>
      <div className="gw-toolbar">
        <span className="gw-open-count">{list
          ? `${list.length}${total != null ? ` / ${total}` : ''} ${stateFilter === 'open' ? t('issues.filterOpen') : t('issues.filterClosed')}`
          : '…'}</span>
        <span style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <select className="gw-select" style={{ marginLeft: 0, maxWidth: 118 }}
            value={sort} onChange={(e) => setSort(e.target.value as api.ListSort)}>
            <option value="created">{t('issues.sortCreated')}</option>
            <option value="updated">{t('issues.sortUpdated')}</option>
          </select>
          <button className={`gw-btn ${stateFilter === 'open' ? 'primary' : ''}`}
            onClick={() => setStateFilter('open')}>{t('issues.filterOpen')}</button>
          <button className={`gw-btn ${stateFilter === 'closed' ? 'primary' : ''}`}
            onClick={() => setStateFilter('closed')}>{t('issues.filterClosed')}</button>
          <button className="gw-btn primary" onClick={() => setShowNew(true)}>
            <GwIcon name="plus" size={12} />{t('issues.new')}
          </button>
        </span>
      </div>
      <div className="gw-list">
        {error && <ErrorBox msg={error} onRetry={() => reload()} />}
        {!error && !list && <Loading />}
        {list?.length === 0 && <Empty>{stateFilter === 'open'
          ? t('empty.noOpenIssues')
          : t('empty.noClosedIssues')}</Empty>}
        {list?.map((it) => (
          <button key={it.number} className="gw-row" onClick={() => setDetail(it.number)}>
            <span className="gw-stateic"
              style={{ color: it.state === 'closed' ? 'var(--dsw-alias-state-danger-primary)' : 'var(--dsw-alias-state-success-primary)' }}>
              <GwIcon name={it.state === 'closed' ? 'x-circle' : 'issue'} />
            </span>
            <span className="gw-rowmain">
              <span className="gw-rowtitle">{it.title}</span>
              <span className="gw-rowsub">
                #{it.number} · {timeAgo(it.updated_at)} · {it.user?.login ?? 'ghost'}
                {it.comments > 0 && <> · <GwIcon name="comment" size={10} /> {it.comments}</>}
                {it.labels.map((l) => (
                  <span key={l.name} className="gw-label-chip"
                    style={{ background: `#${l.color.replace('#', '')}`, color: labelTextColor(l.color), marginLeft: 4 }}>
                    {l.name}
                  </span>
                ))}
              </span>
            </span>
            <span className="gw-meta">{t('issues.updated')}<br />{timeAgo(it.updated_at)}</span>
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
        <NewIssueDrawer ghRef={ghRef}
          onClose={() => setShowNew(false)}
          onCreated={(n) => { setShowNew(false); reload(); setDetail(n); }} />
      )}
      {detail !== null && (
        <IssueDrawer key={detail} ghRef={ghRef} number={detail}
          onClose={() => setDetail(null)}
          onChanged={() => { reload(); }} />
      )}
    </div>
  );
}

// ---------- New Issue ----------

function NewIssueDrawer(props: { ghRef: GhRef; onClose: () => void; onCreated: (n: number) => void }): ReactNode {
  const ui = useUI();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="gw-detail">
      <div className="gw-detail-head">
        <button className="backbtn gw-btn" onClick={props.onClose}><GwIcon name="chevron-left" size={12} />{t('issues.backToList')}</button>
        <div style={{ fontWeight: 600, marginTop: 6 }}>{t('issues.newTitle')}</div>
      </div>
      <div className="gw-detail-body" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <input className="gw-input" placeholder={t('issues.titlePlaceholder')} value={title}
          onChange={(e) => setTitle(e.target.value)} autoFocus />
        <textarea className="gw-input gw-textarea" rows={7} placeholder={t('issues.bodyPlaceholder')}
          value={body} onChange={(e) => setBody(e.target.value)} />
        {error && <div className="gw-errbox">{error}</div>}
      </div>
      <div className="gw-composer">
        <div className="gw-composer-row" style={{ justifyContent: 'flex-end' }}>
          <button className="gw-btn" onClick={props.onClose}>{t('confirm.no')}</button>
          <button className="gw-btn primary" disabled={!title.trim() || busy}
            onClick={() => {
              setBusy(true); setError(null);
              api.createIssue(props.ghRef, title.trim(), body)
                .then((it) => { ui.toast(t('issues.created', { number: it.number }));
                  getInboxStore().markSelfCreated(inboxItemKey('issue', props.ghRef.owner, props.ghRef.repo, it.number));
                  props.onCreated(it.number); })
                .catch((e) => { setError(errText(e)); })
                .finally(() => setBusy(false));
            }}>{busy ? t('issues.creating') : t('issues.create')}</button>
        </div>
      </div>
    </div>
  );
}

// ---------- Issue detail drawer ----------

function IssueDrawer(props: { ghRef: GhRef; number: number; onClose: () => void; onChanged: () => void }): ReactNode {
  const ui = useUI();
  const [issue, setIssue] = useState<api.GhIssue | null>(null);
  const [comments, setComments] = useState<api.GhComment[]>([]);
  const [commentsNext, setCommentsNext] = useState<string | null>(null);
  const [loadingMoreComments, setLoadingMoreComments] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [eTitle, setETitle] = useState('');
  const [eBody, setEBody] = useState('');

  const loadAll = useCallback(() => {
    setError(null);
    Promise.all([api.getIssue(props.ghRef, props.number), api.listComments(props.ghRef, props.number)])
      .then(([i, c]) => {
        setIssue(i); setComments(c.items); setCommentsNext(c.nextUrl);
        setETitle(i.title); setEBody(i.body ?? '');
      })
      .catch((e) => setError(errText(e)));
  }, [props.ghRef.owner, props.ghRef.repo, props.number]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const closed = issue?.state === 'closed';

  async function toggleState(): Promise<void> {
    if (!issue) return;
    const toClosed = !closed;
    if (toClosed && !(await ui.confirm({
      title: t('issues.closeConfirm', { number: issue.number }),
      body: issue.title,
      confirmText: t('issues.closeText'), danger: true,
    }))) return;
    try {
      await api.patchIssue(props.ghRef, issue.number, { state: toClosed ? 'closed' : 'open' });
      ui.toast(toClosed ? t('issues.closed', { number: issue.number }) : t('issues.reopened', { number: issue.number }));
      loadAll(); props.onChanged();
    } catch (e) { ui.toast(errText(e), 'err'); }
  }

  async function saveEdit(): Promise<void> {
    if (!issue) return;
    try {
      await api.patchIssue(props.ghRef, issue.number, { title: eTitle.trim(), body: eBody });
      ui.toast(t('issues.saveSuccess')); setEditing(false); loadAll(); props.onChanged();
    } catch (e) { ui.toast(errText(e), 'err'); }
  }

  return (
    <div className="pane-wrap gw-pane-wrap" style={{ position: 'absolute', inset: 0, zIndex: 30, display: 'flex' }}>
      <div className="gw-detail" style={{ position: 'static', flex: 1 }}>
        <div className="gw-detail-head">
          <button className="gw-btn backbtn" onClick={props.onClose}>
            <GwIcon name="chevron-left" size={12} />{t('issues.backToList')}
          </button>
          {issue ? (
            <>
              <div style={{ fontWeight: 600, marginTop: 6, fontSize: 13 }}>
                <StateIcon closed={issue.state === 'closed'} />{issue.title} <span className="gw-muted">#{issue.number}</span>
              </div>
              <div className="gw-rowsub" style={{ marginTop: 3 }}>
                {issue.user?.login ?? 'ghost'} {t('issues.createdAt')} {timeAgo(issue.created_at)} · {issue.state === 'closed' ? t('issues.closedLabel') : t('issues.open')}
                <a className="gw-link" href={issue.html_url} target="_blank" rel="noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                  <GwIcon name="external-link" size={10} />GitHub
                </a>
              </div>
            </>
          ) : <div className="gw-muted" style={{ marginTop: 8 }}>{t('loading')}</div>}
        </div>
        <div className="gw-detail-body">
          {error && <ErrorBox msg={error} onRetry={loadAll} />}
          {!error && !issue && <Loading />}
          {issue && (editing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input className="gw-input" value={eTitle} onChange={(e) => setETitle(e.target.value)} />
              <textarea className="gw-input gw-textarea" rows={8} value={eBody}
                onChange={(e) => setEBody(e.target.value)} />
              <div className="gw-composer-row">
                <button className="gw-btn primary" onClick={saveEdit}>{t('issues.saveEdit')}</button>
                <button className="gw-btn" onClick={() => {
                  setEditing(false); setETitle(issue.title); setEBody(issue.body ?? '');
                }}>{t('confirm.no')}</button>
              </div>
            </div>
          ) : (
            <>
              {issue.body || t('issues.noBody')}
              {issue.labels.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  {issue.labels.map((l) => (
                    <span key={l.name} className="gw-label-chip"
                      style={{ background: `#${l.color.replace('#', '')}`, color: labelTextColor(l.color) }}>
                      {l.name}
                    </span>
                  ))}
                </div>
              )}
              <CommentsBlock ghRef={props.ghRef} number={props.number}
                comments={comments} onChanged={loadAll}
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
            </>
          ))}
        </div>
        {issue && !editing && (
          <div className="gw-composer">
            <CommentComposer ghRef={props.ghRef} number={props.number} onDone={loadAll} />
            <div className="gw-composer-row">
              <button className={`gw-btn ${closed ? '' : 'danger'}`} onClick={toggleState}>
                {closed ? t('issues.reopenIssue') : t('issues.closeIssue')}
              </button>
              <button className="gw-btn" onClick={() => setEditing(true)}>
                <GwIcon name="pencil" size={11} />{t('issues.edit')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function StateIcon(props: { closed: boolean; merged?: boolean }): ReactNode {
  const color = props.merged ? 'var(--dsw-alias-state-merged, #a371f7)'
    : props.closed ? 'var(--dsw-alias-state-danger-primary)' : 'var(--dsw-alias-state-success-primary)';
  return <span className="gw-stateic" style={{ color, display: 'inline-flex', marginRight: 6, verticalAlign: '-2px' }}>
    <GwIcon name={props.merged ? 'merge' : props.closed ? 'x-circle' : 'issue'} size={13} />
  </span>;
}

// Re-export the icon type to keep the public type surface explicit.
export type { IconName };
