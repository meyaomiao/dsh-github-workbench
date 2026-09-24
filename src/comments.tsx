/**
 * Shared comments block used by Issue and Pull request detail drawers.
 * Delete controls are shown only for the authenticated user's own comments
 * and require confirmation; inline editing is supported.
 */

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { GwIcon } from './icons.ts';
import * as api from './api.ts';
import { timeAgo, type GhRef } from './lib.ts';
import { errText, useUI } from './workbench.tsx';
import { t } from './locales.ts';

export function CommentsBlock(props: {
  ghRef: GhRef; number: number;
  comments: api.GhComment[];
  onChanged: () => void;
  nextUrl?: string | null;
  loadingMore?: boolean;
  onLoadMore?: () => void;
}): ReactNode {
  const ui = useUI();
  const [viewer, setViewer] = useState<string | null>(null);

  useEffect(() => { api.getViewerLogin().then(setViewer); }, []);

  async function del(c: api.GhComment): Promise<void> {
    if (!(await ui.confirm({
      title: t('comments.deleteConfirm'),
      body: c.body.slice(0, 120),
      confirmText: t('comments.deleteText'), danger: true,
    }))) return;
    try {
      await api.deleteComment(props.ghRef, c.id);
      ui.toast(t('comments.deleted'));
      props.onChanged();
    } catch (e) { ui.toast(errText(e), 'err'); }
  }

  if (props.comments.length === 0 && !props.nextUrl) return null;

  return (
    <div>
      <div className="gw-pop-divider" style={{ margin: '14px 0 4px' }} />
      <div className="gw-muted" style={{ fontSize: 11, marginBottom: 2 }}>
        {t('comments.count', { count: props.comments.length, extra: props.nextUrl ? '+' : '' })}
      </div>
      {props.comments.map((c) => (
        <CommentRow key={c.id} comment={c} mine={viewer != null && c.user?.login === viewer}
          ghRef={props.ghRef} onChanged={props.onChanged} onDelete={() => del(c)} />
      ))}
      {props.nextUrl && props.onLoadMore && (
        <div className="gw-more">
          <button className="gw-btn" disabled={props.loadingMore} onClick={props.onLoadMore}>
            {props.loadingMore ? t('loading') : t('loadMoreComments')}
          </button>
        </div>
      )}
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
              ui.toast(t('comments.updated')); setEditing(false); props.onChanged();
            } catch (e) { ui.toast(errText(e), 'err'); }
            finally { setBusy(false); }
          }}>{t('comments.save')}</button>
          <button className="gw-btn" onClick={() => { setEditing(false); setText(props.comment.body); }}>{t('comments.cancel')}</button>
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
            <button className="gw-hbtn" title={t('comments.editTitle')} onClick={() => setEditing(true)}>
              <GwIcon name="pencil" size={12} />
            </button>
            <button className="gw-hbtn" title={t('comments.deleteTitle')} onClick={props.onDelete}>
              <GwIcon name="trash" size={12} />
            </button>
          </span>
        )}
      </div>
      <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{props.comment.body}</div>
    </div>
  );
}

/** Comment composer (bottom bar). */
export function CommentComposer(props: { ghRef: GhRef; number: number; onDone: () => void }): ReactNode {
  const ui = useUI();
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);

  return (
    <textarea className="gw-input gw-textarea" placeholder={t('comments.writePlaceholder')}
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
      ui.toast(t('comments.posted'));
      setText('');
      props.onDone();
    } catch (e) { ui.toast(errText(e), 'err'); }
    finally { setBusy(false); }
  }
}
