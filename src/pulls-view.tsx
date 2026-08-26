/**
 * Pull requests 页签:列表(工具条 + 新建 PR)+ 详情抽屉
 * (diffstat / check-runs 摘要 / 合并三法强确认 / 关闭重开 / 评论区)。
 */

import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { GwIcon } from './icons.ts';
import * as api from './api.ts';
import { ghRefKey, timeAgo, type GhRef } from './lib.ts';
import { Loading, ErrorBox, Empty } from './ui.tsx';
import { errText, useUI } from './workbench.tsx';
import { CommentsBlock, CommentComposer } from './comments.tsx';
import { StateIcon, type ListViewProps } from './issues-view.tsx';

type MergeMethod = 'merge' | 'squash' | 'rebase';
const METHOD_LABEL: Record<MergeMethod, string> = {
  merge: 'Merge', squash: 'Squash and merge', rebase: 'Rebase and merge',
};

export function PullsView({ ghRef, branches, visible, onCount, initialDetail, onConsumeDeep }: ListViewProps & { branches: api.BranchLite[] }): ReactNode {
  const ui = useUI();
  const [list, setList] = useState<api.GhPull[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<number | null>(initialDetail ?? null);
  useEffect(() => { if (initialDetail != null) onConsumeDeep?.(); }, [initialDetail]);
  const [showNew, setShowNew] = useState(false);
  const [stateFilter, setStateFilter] = useState<'open' | 'closed'>('open');

  const load = useCallback((silent: boolean) => {
    if (!silent) setList(null);
    setError(null);
    api.listPulls(ghRef, stateFilter)
      .then((arr) => { setList(arr); if (stateFilter === 'open') onCount(arr.length); })
      .catch((e) => setError(errText(e)));
  }, [ghRef.owner, ghRef.repo, onCount, stateFilter]);

  useEffect(() => {
    setList(null); setDetail(null);
    load(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ghRef.owner, ghRef.repo, stateFilter]);

  // 自动刷新(visible 门控,静默不闪)
  useEffect(() => {
    const sec = Number(localStorage.getItem('gw.autoSec') ?? 0);
    if (!visible || sec <= 0) return;
    const t = setInterval(() => load(true), sec * 1000);
    return () => clearInterval(t);
  }, [visible, load]);

  return (
    <div className="gw-colpane" style={{ flex: 1, minHeight: 0, display: 'flex' }}>
      <div className="gw-toolbar">
        <span className="gw-open-count">{list ? `${list.length} ${stateFilter === 'open' ? 'open' : 'closed'}` : '…'}</span>
        <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <button className={`gw-btn ${stateFilter === 'open' ? 'primary' : ''}`}
            onClick={() => setStateFilter('open')}>开放</button>
          <button className={`gw-btn ${stateFilter === 'closed' ? 'primary' : ''}`}
            onClick={() => setStateFilter('closed')}>已关闭</button>
          <button className="gw-btn primary" onClick={() => setShowNew(true)}>
            <GwIcon name="plus" size={12} />新建 PR
          </button>
        </span>
      </div>
      <div className="gw-list">
        {error && <ErrorBox msg={error} onRetry={() => load(true)} />}
        {!error && !list && <Loading />}
        {list?.length === 0 && <Empty>没有打开的 Pull Request。</Empty>}
        {list?.map((pr) => (
          <button key={pr.number} className="gw-row" onClick={() => setDetail(pr.number)}>
            <span className="gw-stateic"
              style={{ color: pr.state === 'closed'
                ? 'var(--dsw-alias-state-danger-primary)'
                : pr.draft ? 'var(--dsw-alias-label-tertiary)'
                : 'var(--dsw-alias-state-success-primary)' }}>
              <GwIcon name={pr.state === 'closed' ? 'x-circle' : 'pr'} />
            </span>
            <span className="gw-rowmain">
              <span className="gw-rowtitle">
                {pr.title}{pr.draft && <span className="gw-chip" style={{ marginLeft: 6 }}>draft</span>}
              </span>
              <span className="gw-rowsub">
                #{pr.number} · <span className="gw-branch-chip">{pr.head.ref} → {pr.base.ref}</span>
                 · {timeAgo(pr.updated_at)}
              </span>
            </span>
            <span className="gw-meta">更新<br />{timeAgo(pr.updated_at)}</span>
          </button>
        ))}
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

// ---------- 新建 PR ----------

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
          <button className="gw-btn backbtn" onClick={props.onClose}><GwIcon name="chevron-left" size={12} />返回列表</button>
          <div style={{ fontWeight: 600, marginTop: 6 }}>新建 Pull Request</div>
        </div>
        <div className="gw-detail-body" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="gw-formrow">
            <div className="gw-field" style={{ flex: 1 }}>
              <label>head(源分支)</label>
              <input className="gw-input" placeholder="feature/xxx" value={head} list="gw-branches"
                onChange={(e) => setHead(e.target.value)} autoFocus />
              <datalist id="gw-branches">
                {props.branches.map((b) => <option key={b.name} value={b.name} />)}
              </datalist>
            </div>
            <div className="gw-field" style={{ width: 140 }}>
              <label>base(目标分支)</label>
              <select className="gw-input" value={base} onChange={(e) => setBase(e.target.value)}
                style={{ appearance: 'auto', backgroundImage: 'none', paddingRight: 8 }}>
                {props.branches.map((b) => <option key={b.name} value={b.name}>{b.name}</option>)}
              </select>
            </div>
          </div>
          <input className="gw-input" placeholder="标题(必填)" value={title}
            onChange={(e) => setTitle(e.target.value)} />
          <textarea className="gw-input gw-textarea" rows={6} placeholder="描述(Markdown)"
            value={body} onChange={(e) => setBody(e.target.value)} />
          {error && <div className="gw-errbox">{error}</div>}
        </div>
        <div className="gw-composer">
          <div className="gw-composer-row" style={{ justifyContent: 'flex-end' }}>
            <button className="gw-btn" onClick={props.onClose}>取消</button>
            <button className="gw-btn primary" disabled={!title.trim() || !head.trim() || !base || busy}
              onClick={() => {
                setBusy(true); setError(null);
                api.createPull(props.ghRef, { title: title.trim(), body, head: head.trim(), base })
                  .then((pr) => { ui.toast(`PR #${pr.number} 已创建`);
                  (window as unknown as { __gwSelfMark?: (k: string) => void }).__gwSelfMark?.(`pulls:${pr.number}`);
                  props.onCreated(pr.number); })
                  .catch((e) => setError(errText(e)))
                  .finally(() => setBusy(false));
              }}>{busy ? '创建中…' : '创建 PR'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- 详情抽屉 ----------

function PullDrawer(props: { ghRef: GhRef; number: number; onClose: () => void; onChanged: () => void }): ReactNode {
  const ui = useUI();
  const [pull, setPull] = useState<api.GhPull | null>(null);
  const [comments, setComments] = useState<api.GhComment[]>([]);
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
      .then(([p, c]) => { setPull(p); setComments(c); })
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
              <GwIcon name="chevron-left" size={12} />返回列表
            </button>
          </div>
          <ErrorBox msg={error} onRetry={loadAll} />
        </div>
      </div>
    );
  }
  if (!pull) return <Loading />;

  const closed = pull.state === 'closed';
  const merged = pull.mergeable_state === undefined ? false : false; // merged 状态经 list 不含;以 checks/detail 为准的保守展示
  const okChecks = checks?.filter((c) => c.conclusion === 'success').length ?? 0;
  const badChecks = checks?.filter((c) => c.conclusion && c.conclusion !== 'success' && c.conclusion !== 'skipped' && c.conclusion !== 'neutral').length ?? 0;
  const pendingChecks = checks?.filter((c) => !c.conclusion).length ?? 0;
  const canMerge = !closed && !pull.draft;

  async function doMerge(): Promise<void> {
    if (!pull) return;
    if (!(await ui.confirm({
      title: `以 ${METHOD_LABEL[method]} 合并 #${pull.number}?`,
      body: `${pull.head.ref} → ${pull.base.ref}\n将按 GitHub 的该方式产生提交,合并后通常自动删除源分支。`,
      confirmText: METHOD_LABEL[method], danger: true,
    }))) return;
    setBusy(true);
    try {
      (window as unknown as { __gwSelfMark?: (k: string) => void }).__gwSelfMark?.(`pulls:${pull.number}`);
      await api.mergePull(props.ghRef, pull.number, method);
      ui.toast(`PR #${pull.number} 已合并(${METHOD_LABEL[method]})`);
      props.onChanged(); loadAll();
    } catch (e) { ui.toast(errText(e), 'err'); }
    finally { setBusy(false); }
  }

  async function toggleState(): Promise<void> {
    if (!pull) return;
    const toClosed = !closed;
    if (toClosed && !(await ui.confirm({
      title: `关闭 PR #${pull.number}?`, body: pull.title, confirmText: '关闭', danger: true,
    }))) return;
    try {
      await api.patchIssue(props.ghRef, pull.number, { state: toClosed ? 'closed' : 'open' });
      ui.toast(toClosed ? `PR #${pull.number} 已关闭` : `PR #${pull.number} 已重新打开`);
      props.onChanged(); loadAll();
    } catch (e) { ui.toast(errText(e), 'err'); }
  }

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 30, display: 'flex' }}>
      <div className="gw-detail" style={{ position: 'static', flex: 1 }}>
        <div className="gw-detail-head">
          <button className="gw-btn backbtn" onClick={props.onClose}>
            <GwIcon name="chevron-left" size={12} />返回列表
          </button>
          <div style={{ fontWeight: 600, marginTop: 6, fontSize: 13 }}>
            <StateIcon closed={closed} merged={merged} />{pull.title} <span className="gw-muted">#{pull.number}</span>
          </div>
          <div className="gw-rowsub" style={{ marginTop: 3, flexWrap: 'wrap' }}>
            <span className="gw-branch-chip">{pull.head.label} → {pull.base.label}</span>
            {(pull.additions !== undefined) && (
              <span><span className="gw-diffstat-add">+{pull.additions}</span> <span className="gw-diffstat-del">−{pull.deletions}</span>
                {pull.changed_files !== undefined ? ` · ${pull.changed_files} files` : ''}</span>
            )}
            · {timeAgo(pull.created_at)} 创建
            {checks !== null && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                ·
                {badChecks > 0
                  ? <span className="gw-checkdot" style={{ background: 'var(--dsw-alias-state-danger-primary)' }} />
                  : pendingChecks > 0
                    ? <span className="gw-checkdot" style={{ background: 'var(--dsw-alias-state-attention-primary)' }} />
                    : <span className="gw-checkdot" style={{ background: 'var(--dsw-alias-state-success-primary)' }} />}
                {badChecks > 0 ? `失败 ${badChecks}` : pendingChecks > 0 ? '进行中' : `通过 ${okChecks}`}
              </span>
            )}
            <a className="gw-link" href={pull.html_url} target="_blank" rel="noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
              <GwIcon name="external-link" size={10} />GitHub
            </a>
          </div>

          {/* 合并控制条 */}
          {canMerge && (
            <div className="gw-composer-row" style={{ marginTop: 8 }}>
              <select className="gw-select" style={{ marginLeft: 0, maxWidth: 190 }}
                value={method} onChange={(e) => setMethod(e.target.value as MergeMethod)}>
                <option value="merge">Create a merge commit</option>
                <option value="squash">Squash and merge</option>
                <option value="rebase">Rebase and merge</option>
              </select>
              <button className="gw-btn primary" disabled={busy || pull.mergeable === false}
                onClick={doMerge}>
                <GwIcon name="merge" size={12} />{METHOD_LABEL[method]}
              </button>
              {pull.mergeable === false && (
                <span className="gw-muted" style={{ fontSize: 10 }}>存在冲突,无法合并</span>
              )}
            </div>
          )}

          {/* checks 明细 */}
          {checks !== null && checks.length > 0 && (
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {checks.slice(0, 8).map((c) => (
                <a key={c.id} className="gw-rowsub gw-link" href={c.html_url} target="_blank" rel="noreferrer"
                  style={{ textDecoration: 'none' }}>
                  <CheckDot run={c} />{c.name ?? 'check'} · {c.conclusion ?? c.status}
                </a>
              ))}
              {checks.length > 8 && <span className="gw-muted">… 其余 {checks.length - 8} 项见 GitHub</span>}
            </div>
          )}
        </div>

        <div className="gw-detail-body">
          {pull.body || '(无描述)'}
          <CommentsBlock ghRef={props.ghRef} number={props.number} comments={comments} onChanged={loadAll} />
        </div>

        <div className="gw-composer">
          <CommentComposer ghRef={props.ghRef} number={props.number} onDone={loadAll} />
          <div className="gw-composer-row">
            <button className={`gw-btn ${closed ? '' : 'danger'}`} onClick={toggleState}>
              {closed ? '重新打开' : '关闭 PR'}
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
