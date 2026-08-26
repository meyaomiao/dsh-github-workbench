/**
 * Issues 页签:列表(工具条 + 新建)+ 详情抽屉(正文 / 评论 / 编辑 / 关闭重开)。
 * 写操作:新建、评论、编辑标题正文、编辑/删除评论、关闭/重开(关闭需确认)。
 */

import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { GwIcon, type IconName } from './icons.ts';
import * as api from './api.ts';
import { ghRefKey, labelTextColor, timeAgo, type GhRef } from './lib.ts';
import { Loading, ErrorBox, Empty } from './ui.tsx';
import { errText, useUI } from './workbench.tsx';
import { CommentComposer, CommentsBlock } from './comments.tsx';

export interface ListViewProps {
  ghRef: GhRef;
  visible: boolean;
  onCount: (n: number) => void;
  /** 外链深链:初始打开的 issue/PR 编号(消费一次)。 */
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

  const reload = useCallback(() => {
    setList(null); setError(null);
    api.listIssues(ghRef)
      .then((arr) => { setList(arr); onCount(arr.length); })
      .catch((e) => setError(errText(e)));
  }, [ghRef.owner, ghRef.repo, onCount]);

  useEffect(() => { reload(); }, [reload]);

  return (
    <div className="gw-colpane" style={{ flex: 1, minHeight: 0, display: 'flex' }}>
      <div className="gw-toolbar">
        <span className="gw-open-count">{list ? `${list.length} open` : '…'}</span>
        <button className="gw-btn primary" onClick={() => setShowNew(true)}>
          <GwIcon name="plus" size={12} />新建 Issue
        </button>
      </div>
      <div className="gw-list">
        {error && <ErrorBox msg={error} onRetry={reload} />}
        {!error && !list && <Loading />}
        {list?.length === 0 && <Empty>没有打开的 Issue。<br />用上方按钮创建第一个。</Empty>}
        {list?.map((it) => (
          <button key={it.number} className="gw-row" onClick={() => setDetail(it.number)}>
            <span className="gw-stateic" style={{ color: 'var(--dsw-alias-state-success-primary)' }}>
              <GwIcon name="issue" />
            </span>
            <span className="gw-rowmain">
              <span className="gw-rowtitle">{it.title}</span>
              <span className="gw-rowsub">
                #{it.number} · {timeAgo(it.updated_at)} 更新 · {it.user?.login ?? 'ghost'}
                {it.comments > 0 && <> · <GwIcon name="comment" size={10} /> {it.comments}</>}
                {it.labels.map((l) => (
                  <span key={l.name} className="gw-label-chip"
                    style={{ background: `#${l.color.replace('#', '')}`, color: labelTextColor(l.color), marginLeft: 4 }}>
                    {l.name}
                  </span>
                ))}
              </span>
            </span>
            <span className="gw-meta">更新<br />{timeAgo(it.updated_at)}</span>
          </button>
        ))}
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

// ---------- 新建 Issue ----------

function NewIssueDrawer(props: { ghRef: GhRef; onClose: () => void; onCreated: (n: number) => void }): ReactNode {
  const ui = useUI();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="gw-detail">
      <div className="gw-detail-head">
        <button className="backbtn gw-btn" onClick={props.onClose}><GwIcon name="chevron-left" size={12} />返回列表</button>
        <div style={{ fontWeight: 600, marginTop: 6 }}>新建 Issue</div>
      </div>
      <div className="gw-detail-body" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <input className="gw-input" placeholder="标题(必填)" value={title}
          onChange={(e) => setTitle(e.target.value)} autoFocus />
        <textarea className="gw-input gw-textarea" rows={7} placeholder="正文(Markdown)"
          value={body} onChange={(e) => setBody(e.target.value)} />
        {error && <div className="gw-errbox">{error}</div>}
      </div>
      <div className="gw-composer">
        <div className="gw-composer-row" style={{ justifyContent: 'flex-end' }}>
          <button className="gw-btn" onClick={props.onClose}>取消</button>
          <button className="gw-btn primary" disabled={!title.trim() || busy}
            onClick={() => {
              setBusy(true); setError(null);
              api.createIssue(props.ghRef, title.trim(), body)
                .then((it) => { ui.toast(`Issue #${it.number} 已创建`);
                  (window as unknown as { __gwSelfMark?: (k: string) => void }).__gwSelfMark?.(`issues:${it.number}`);
                  props.onCreated(it.number); })
                .catch((e) => { setError(errText(e)); })
                .finally(() => setBusy(false));
            }}>{busy ? '创建中…' : '创建'}</button>
        </div>
      </div>
    </div>
  );
}

// ---------- 详情抽屉 ----------

function IssueDrawer(props: { ghRef: GhRef; number: number; onClose: () => void; onChanged: () => void }): ReactNode {
  const ui = useUI();
  const [issue, setIssue] = useState<api.GhIssue | null>(null);
  const [comments, setComments] = useState<api.GhComment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [eTitle, setETitle] = useState('');
  const [eBody, setEBody] = useState('');

  const loadAll = useCallback(() => {
    setError(null);
    Promise.all([api.getIssue(props.ghRef, props.number), api.listComments(props.ghRef, props.number)])
      .then(([i, c]) => {
        setIssue(i); setComments(c);
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
      title: `关闭 Issue #${issue.number}?`,
      body: issue.title,
      confirmText: '关闭', danger: true,
    }))) return;
    try {
      await api.patchIssue(props.ghRef, issue.number, { state: toClosed ? 'closed' : 'open' });
      ui.toast(toClosed ? `Issue #${issue.number} 已关闭` : `Issue #${issue.number} 已重新打开`);
      loadAll(); props.onChanged();
    } catch (e) { ui.toast(errText(e), 'err'); }
  }

  async function saveEdit(): Promise<void> {
    if (!issue) return;
    try {
      await api.patchIssue(props.ghRef, issue.number, { title: eTitle.trim(), body: eBody });
      ui.toast('已保存'); setEditing(false); loadAll(); props.onChanged();
    } catch (e) { ui.toast(errText(e), 'err'); }
  }

  return (
    <div className="pane-wrap gw-pane-wrap" style={{ position: 'absolute', inset: 0, zIndex: 30, display: 'flex' }}>
      <div className="gw-detail" style={{ position: 'static', flex: 1 }}>
        <div className="gw-detail-head">
          <button className="gw-btn backbtn" onClick={props.onClose}>
            <GwIcon name="chevron-left" size={12} />返回列表
          </button>
          {issue ? (
            <>
              <div style={{ fontWeight: 600, marginTop: 6, fontSize: 13 }}>
                <StateIcon closed={issue.state === 'closed'} />{issue.title} <span className="gw-muted">#{issue.number}</span>
              </div>
              <div className="gw-rowsub" style={{ marginTop: 3 }}>
                {issue.user?.login ?? 'ghost'} 创建于 {timeAgo(issue.created_at)} · {issue.state === 'closed' ? '已关闭' : '开放'}
                <a className="gw-link" href={issue.html_url} target="_blank" rel="noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                  <GwIcon name="external-link" size={10} />GitHub
                </a>
              </div>
            </>
          ) : <div className="gw-muted" style={{ marginTop: 8 }}>加载中…</div>}
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
                <button className="gw-btn primary" onClick={saveEdit}>保存修改</button>
                <button className="gw-btn" onClick={() => {
                  setEditing(false); setETitle(issue.title); setEBody(issue.body ?? '');
                }}>取消</button>
              </div>
            </div>
          ) : (
            <>
              {issue.body || '(无正文)'}
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
                comments={comments} onChanged={loadAll} />
            </>
          ))}
        </div>
        {issue && !editing && (
          <div className="gw-composer">
            <CommentComposer ghRef={props.ghRef} number={props.number} onDone={loadAll} />
            <div className="gw-composer-row">
              <button className={`gw-btn ${closed ? '' : 'danger'}`} onClick={toggleState}>
                {closed ? '重新打开' : '关闭 Issue'}
              </button>
              <button className="gw-btn" onClick={() => setEditing(true)}>
                <GwIcon name="pencil" size={11} />编辑
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

// 复用类型引用(避免未使用告警的显式引用)
export type { IconName };
