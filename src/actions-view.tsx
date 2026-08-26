/**
 * Actions 页签:workflow runs 列表(状态图标 / 行悬停 重跑·取消 / 点击跳原页)。
 * 自动刷新周期来自设置,受 visible 门控;取消需确认。
 */

import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { GwIcon, type IconName } from './icons.ts';
import * as api from './api.ts';
import { fmtDuration, timeAgo, type GhRef } from './lib.ts';
import { Loading, ErrorBox, Empty } from './ui.tsx';
import { loadAutoRefreshSec } from './config.ts';
import { errText, useUI } from './workbench.tsx';

export function ActionsView({ ghRef, visible, onCount }: { ghRef: GhRef; visible: boolean; onCount: (n: number) => void }): ReactNode {
  const ui = useUI();
  const [runs, setRuns] = useState<api.GhRun[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0); // 相对时间重绘

  const reload = useCallback((silent = false) => {
    if (!silent) setError(null);
    api.listRuns(ghRef)
      .then((arr) => { setRuns(arr); onCount(arr.length); })
      .catch((e) => setError(errText(e)));
  }, [ghRef.owner, ghRef.repo, onCount]);

  useEffect(() => { reload(); }, [reload]);

  // 相对时间每 30s 重绘
  useEffect(() => {
    if (!visible) return;
    const t = setInterval(() => setTick((n) => n + 1), 30_000);
    return () => clearInterval(t);
  }, [visible]);

  // 自动刷新
  useEffect(() => {
    if (!visible) return;
    const sec = loadAutoRefreshSec();
    if (sec <= 0) return;
    const t = setInterval(() => reload(true), sec * 1000);
    return () => clearInterval(t);
  }, [visible, reload]);

  async function rerun(run: api.GhRun): Promise<void> {
    try {
      await api.rerunRun(ghRef, run.id);
      ui.toast(`已触发重跑:${run.display_title || run.name || '#' + run.id}`);
      setTimeout(() => reload(false), 1200);
    } catch (e) { ui.toast(errText(e), 'err'); }
  }

  async function cancel(run: api.GhRun): Promise<void> {
    if (!(await ui.confirm({
      title: `取消运行 #${run.id}?`,
      body: `${run.display_title || run.name} · ${run.head_branch}`,
      confirmText: '取消运行', danger: true,
    }))) return;
    try {
      await api.cancelRun(ghRef, run.id);
      ui.toast('已发送取消请求');
      setTimeout(() => reload(false), 1000);
    } catch (e) { ui.toast(errText(e), 'err'); }
  }

  const active = runs?.filter((r) => r.status === 'in_progress' || r.status === 'queued').length ?? 0;

  return (
    <div className="gw-colpane" style={{ flex: 1, minHeight: 0, display: 'flex' }}>
      <div className="gw-toolbar">
        <span className="gw-open-count">
          最近 20 次{active > 0 ? ` · ${active} 个进行中` : ''}
        </span>
        <button className="gw-btn" onClick={() => reload(false)}><GwIcon name="refresh" size={11} />刷新</button>
      </div>
      <div className="gw-list">
        {error && <ErrorBox msg={error} onRetry={reload} />}
        {!error && !runs && <Loading />}
        {runs?.length === 0 && <Empty>这个仓库还没有 workflow 运行记录。</Empty>}
        {runs?.map((run) => {
          const isActive = run.status === 'in_progress' || run.status === 'queued';
          const dur = Date.parse(run.updated_at) - Date.parse(run.created_at);
          return (
            <div key={run.id} className="gw-row" style={{ cursor: 'pointer' }}
              onClick={() => window.open(run.html_url, '_blank', 'noopener')}
              title="点击在新窗口打开此次运行">
              <span className="gw-stateic"><RunIcon run={run} /></span>
              <span className="gw-rowmain">
                <span className="gw-rowtitle">{run.name ?? 'workflow'} · {run.display_title}</span>
                <span className="gw-rowsub">
                  #{run.id} · <span className="gw-branch-chip">{run.head_branch}</span> · {run.event}
                  {run.status === 'completed'
                    ? ` · 用时 ${fmtDuration(Math.max(0, dur))}`
                    : ` · ${run.status === 'queued' ? '排队中' : '运行中'}(#${run.run_attempt})`}
                </span>
                <span className="gw-hoverbar" onClick={(e) => e.stopPropagation()}>
                  <button className="gw-btn" onClick={() => rerun(run)}>
                    <GwIcon name="refresh" size={11} />重跑
                  </button>
                  {isActive && (
                    <button className="gw-btn danger" onClick={() => cancel(run)}>取消</button>
                  )}
                  <a className="gw-btn" href={run.html_url} target="_blank" rel="noreferrer">
                    <GwIcon name="external-link" size={11} />原页
                  </a>
                </span>
              </span>
              <span className="gw-meta" data-tick={tick}>{timeAgo(run.created_at)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RunIcon(props: { run: api.GhRun }): ReactNode {
  const r = props.run;
  let name: IconName = 'circle-idle';
  let color = 'var(--dsw-alias-label-tertiary)';
  let spin = false;
  if (r.status === 'in_progress') { name = 'loader'; color = 'var(--dsw-alias-state-attention-primary)'; spin = true; }
  else if (r.status === 'queued') { name = 'loader'; color = 'var(--dsw-alias-label-secondary)'; }
  else if (r.conclusion === 'success') { name = 'check-circle'; color = 'var(--dsw-alias-state-success-primary)'; }
  else if (r.conclusion && r.conclusion !== 'skipped' && r.conclusion !== 'neutral') {
    name = 'x-circle'; color = 'var(--dsw-alias-state-danger-primary)';
  }
  return <GwIcon name={name} className={spin ? 'gw-spin' : ''} style={{ color }} />;
}
