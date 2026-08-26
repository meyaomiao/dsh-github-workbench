/**
 * 评论区共享块:评论列表 + 发表框(Issue 与 PR 详情抽屉复用)。
 * 删除仅对「当前鉴权用户本人的评论」显示且需确认;支持行内编辑。
 */

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { GwIcon } from './icons.ts';
import * as api from './api.ts';
import { timeAgo, type GhRef } from './lib.ts';
import { errText, useUI } from './workbench.tsx';

export function CommentsBlock(props: {
  ghRef: GhRef; number: number;
  comments: api.GhComment[];
  onChanged: () => void;
}): ReactNode {
  const ui = useUI();
  const [viewer, setViewer] = useState<string | null>(null);

  useEffect(() => { api.getViewerLogin().then(setViewer); }, []);

  async function del(c: api.GhComment): Promise<void> {
    if (!(await ui.confirm({
      title: '删除这条评论?',
      body: c.body.slice(0, 120),
      confirmText: '删除', danger: true,
    }))) return;
    try {
      await api.deleteComment(props.ghRef, c.id);
      ui.toast('评论已删除');
      props.onChanged();
    } catch (e) { ui.toast(errText(e), 'err'); }
  }

  if (props.comments.length === 0) return null;

  return (
    <div>
      <div className="gw-pop-divider" style={{ margin: '14px 0 4px' }} />
      <div className="gw-muted" style={{ fontSize: 11, marginBottom: 2 }}>
        —— 评论 {props.comments.length} ——
      </div>
      {props.comments.map((c) => (
        <CommentRow key={c.id} comment={c} mine={viewer != null && c.user?.login === viewer}
          ghRef={props.ghRef} onChanged={props.onChanged} onDelete={() => del(c)} />
      ))}
    </div>
  );
}

function CommentRow(props: {
  comment: api.GhComment; mine: boolean;
  ghRef: GhRef; onChanged: () => void; onDelete: () => void;
}): ReactNode {
  const ui = useUI();
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(props.comment.body);
  const [busy, setBusy] = useState(false);

  if (editing) {
    return (
      <div className="gw-comment">
        <textarea className="gw-input gw-textarea" value={text} onChange={(e) => setText(e.target.value)} autoFocus />
        <div className="gw-composer-row" style={{ marginTop: 6 }}>
          <button className="gw-btn primary" disabled={busy || !text.trim()} onClick={async () => {
            setBusy(true);
            try {
              await api.editComment(props.ghRef, props.comment.id, text);
              ui.toast('评论已更新'); setEditing(false); props.onChanged();
            } catch (e) { ui.toast(errText(e), 'err'); }
            finally { setBusy(false); }
          }}>保存</button>
          <button className="gw-btn" onClick={() => { setEditing(false); setText(props.comment.body); }}>取消</button>
        </div>
      </div>
    );
  }

  return (
    <div className="gw-comment">
      <div className="gw-comment-head">
        <strong style={{ color: 'var(--dsw-alias-label-secondary)' }}>{props.comment.user?.login ?? 'ghost'}</strong>
        <span>{timeAgo(props.comment.created_at)}</span>
        {props.mine && (
          <span style={{ marginLeft: 'auto', display: 'inline-flex', gap: 4 }}>
            <button className="gw-hbtn" title="编辑评论" onClick={() => setEditing(true)}>
              <GwIcon name="pencil" size={12} />
            </button>
            <button className="gw-hbtn" title="删除评论" onClick={props.onDelete}>
              <GwIcon name="trash" size={12} />
            </button>
          </span>
        )}
      </div>
      <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{props.comment.body}</div>
    </div>
  );
}

/** 底部发表框(受控于父级刷新回调)。 */
export function CommentComposer(props: { ghRef: GhRef; number: number; onDone: () => void }): ReactNode {
  const ui = useUI();
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);

  return (
    <textarea className="gw-input gw-textarea" placeholder="写下评论…(Markdown)"
      value={text} onChange={(e) => setText(e.target.value)}
      onKeyDown={(e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && text.trim() && !busy) {
          e.preventDefault();
          submit();
        }
      }}
    />
  );

  async function submit(): Promise<void> {
    setBusy(true);
    try {
      await api.addComment(props.ghRef, props.number, text.trim());
      ui.toast('评论已发表');
      setText('');
      props.onDone();
    } catch (e) { ui.toast(errText(e), 'err'); }
    finally { setBusy(false); }
  }
}
