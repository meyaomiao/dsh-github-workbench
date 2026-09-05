/**
 * 收件箱覆盖层:Issues / Pull requests / Actions 三分栏。点行交给工作台切仓。
 */

import { useState, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';
import { GwIcon, type IconName } from './icons.ts';
import { timeAgo, type InboxKind } from './lib.ts';
import { Empty } from './ui.tsx';
import type { InboxItem, InboxSnapshot, InboxStore } from './inbox-store.ts';

export function useInboxSnapshot(store: InboxStore): InboxSnapshot {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
}

const TABS: readonly { id: InboxKind; icon: IconName; label: string }[] = [
  { id: 'issue', icon: 'issue', label: 'Issues' },
  { id: 'pr', icon: 'pr', label: 'Pull requests' },
  { id: 'actions', icon: 'play', label: 'Actions' },
];

export interface InboxOverlayProps {
  store: InboxStore;
  snapLabel: string | null;
  onReturn: () => void;
  onJump: (item: InboxItem) => void;
}

export function InboxOverlay(props: InboxOverlayProps): ReactNode {
  const snap = useInboxSnapshot(props.store);
  const [tab, setTab] = useState<InboxKind>('issue');
  const unread = snap.unreadCount;
  const tabUnread = snap.unreadByKind[tab];
  const rows = snap.items.filter((it) => it.kind === tab);

  return (
    <div className="gw-inbox" data-gw-inbox="">
      <div className="gw-inbox-bar">
        <button className="gw-btn backbtn" onClick={props.onReturn} type="button">
          <GwIcon name="chevron-left" size={12} />
          {props.snapLabel ? `返回 ${props.snapLabel}` : '返回原仓页'}
        </button>
        <span className="gw-open-count">收件箱{unread > 0 ? ` · ${unread} 未读` : ''}</span>
        <button className="gw-btn" type="button" disabled={tabUnread === 0}
          onClick={() => props.store.markAllRead(tab)}>本页已读</button>
      </div>
      <div className="gw-tabs">
        {TABS.map((t) => (
          <button key={t.id} type="button" className={`gw-tab ${tab === t.id ? 'on' : ''}`}
            onClick={() => setTab(t.id)}>
            <GwIcon name={t.icon} size={13} />{t.label}
            {snap.unreadByKind[t.id] > 0 && <span className="gw-count">{snap.unreadByKind[t.id]}</span>}
          </button>
        ))}
      </div>
      {snap.truncatedWatch && tab !== 'actions' && (
        <div className="gw-pop-hint" style={{ padding: '6px 12px' }}>
          Issues / PR 仅监视最近推送的最多 300 个公开仓。
        </div>
      )}
      {tab === 'actions' && (
        <div className="gw-pop-hint" style={{ padding: '6px 12px' }}>
          Actions 只监视当前仓和最近使用的公开仓(最多 5 个)。
        </div>
      )}
      {snap.lastError && <div className="gw-errbox">{snap.lastError}</div>}
      <div className="gw-list">
        {!snap.hasToken && (
          <Empty>填 PAT 后监视你有权限的公开仓。</Empty>
        )}
        {snap.hasToken && rows.length === 0 && !snap.lastError && (
          <Empty>{emptyCopy(tab)}</Empty>
        )}
        {snap.hasToken && rows.map((it) => (
          <button key={it.key} type="button" className={`gw-row${it.unread ? ' gw-inbox-unread' : ''}`}
            onClick={() => props.onJump(it)}>
            <span className={`gw-inbox-dot${it.unread ? ' on' : ''}`} />
            <span className="gw-rowmain">
              <span className="gw-rowtitle">{it.title}</span>
              <span className="gw-rowsub">
                {it.owner}/{it.repo} {it.kind === 'actions' ? `run #${it.number}` : `#${it.number}`}
                {' · '}{it.user} · {timeAgo(it.createdAt)}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function emptyCopy(tab: InboxKind): string {
  if (tab === 'pr') return '最近七天没有公开仓的新 Pull request。';
  if (tab === 'actions') return '监视仓里最近没有新的 workflow 运行。';
  return '最近七天没有公开仓的新 Issue。';
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
