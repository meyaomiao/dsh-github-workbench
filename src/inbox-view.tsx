/**
 * 收件箱覆盖层:只有列表。点行交给工作台切仓,这里不叠抽屉。
 */

import { useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';
import { GwIcon } from './icons.ts';
import { timeAgo } from './lib.ts';
import { Empty } from './ui.tsx';
import type { InboxItem, InboxSnapshot, InboxStore } from './inbox-store.ts';

export function useInboxSnapshot(store: InboxStore): InboxSnapshot {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
}

export interface InboxOverlayProps {
  store: InboxStore;
  snapLabel: string | null;
  onReturn: () => void;
  onJump: (item: InboxItem) => void;
}

export function InboxOverlay(props: InboxOverlayProps): ReactNode {
  const snap = useInboxSnapshot(props.store);
  const unread = snap.unreadCount;

  return (
    <div className="gw-inbox" data-gw-inbox="">
      <div className="gw-inbox-bar">
        <button className="gw-btn backbtn" onClick={props.onReturn} type="button">
          <GwIcon name="chevron-left" size={12} />
          {props.snapLabel ? `返回 ${props.snapLabel}` : '返回原仓页'}
        </button>
        <span className="gw-open-count">收件箱{unread > 0 ? ` · ${unread} 未读` : ''}</span>
        <button className="gw-btn" type="button" disabled={unread === 0}
          onClick={() => props.store.markAllRead()}>全部已读</button>
      </div>
      {snap.truncatedWatch && (
        <div className="gw-pop-hint" style={{ padding: '6px 12px' }}>
          仅监视最近推送的最多 300 个公开仓。
        </div>
      )}
      {snap.lastError && <div className="gw-errbox">{snap.lastError}</div>}
      <div className="gw-list">
        {!snap.hasToken && (
          <Empty>填 PAT 后监视你有权限的公开仓。</Empty>
        )}
        {snap.hasToken && snap.items.length === 0 && !snap.lastError && (
          <Empty>最近七天没有公开仓的新 Issue。</Empty>
        )}
        {snap.hasToken && snap.items.map((it) => (
          <button key={it.key} type="button" className={`gw-row${it.unread ? ' gw-inbox-unread' : ''}`}
            onClick={() => props.onJump(it)}>
            <span className={`gw-inbox-dot${it.unread ? ' on' : ''}`} />
            <span className="gw-rowmain">
              <span className="gw-rowtitle">{it.title}</span>
              <span className="gw-rowsub">
                {it.owner}/{it.repo} #{it.number} · {it.user} · {timeAgo(it.createdAt)}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function InboxReturnBar(props: { label: string; onReturn: () => void }): ReactNode {
  return (
    <div className="gw-inbox-return">
      <button className="gw-btn backbtn" type="button" onClick={props.onReturn}>
        <GwIcon name="chevron-left" size={12} />返回 {props.label}
      </button>
    </div>
  );
}
