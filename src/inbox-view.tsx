/**
 * 收件箱覆盖层:Issues / Pull requests / Actions 三分栏。点行交给工作台切仓。
 */

import { useState, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';
import { GwIcon, type IconName } from './icons.ts';
import { timeAgo, type InboxKind } from './lib.ts';
import { Empty } from './ui.tsx';
import type { InboxItem, InboxSnapshot, InboxStore } from './inbox-store.ts';
import { t } from './locales.ts';

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
          {props.snapLabel ? t('inbox.backTo', { label: props.snapLabel }) : t('inbox.backToRepo')}
        </button>
        <span className="gw-open-count">{t('inbox.title')}{unread > 0 ? t('inbox.unread', { count: unread }) : ''}</span>
        <button className="gw-btn" type="button" disabled={tabUnread === 0}
          onClick={() => props.store.markAllRead(tab)}>{t('inbox.markAllRead')}</button>
      </div>
      <div className="gw-tabs">
        {TABS.map((tabItem) => (
          <button key={tabItem.id} type="button" className={`gw-tab ${tab === tabItem.id ? 'on' : ''}`}
            onClick={() => setTab(tabItem.id)}>
            <GwIcon name={tabItem.icon} size={13} />{tabItem.label}
            {snap.unreadByKind[tabItem.id] > 0 && <span className="gw-count">{snap.unreadByKind[tabItem.id]}</span>}
          </button>
        ))}
      </div>
      {snap.truncatedWatch && tab !== 'actions' && (
        <div className="gw-pop-hint" style={{ padding: '6px 12px' }}>
          {t('inbox.descIssuesPRs')}
        </div>
      )}
      {tab === 'actions' && (
        <div className="gw-pop-hint" style={{ padding: '6px 12px' }}>
          {t('inbox.descActions')}
        </div>
      )}
      {snap.lastError && <div className="gw-errbox">{snap.lastError}</div>}
      <div className="gw-list">
        {!snap.hasToken && (
          <Empty>{t('empty.inboxNoPAT')}</Empty>
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
  if (tab === 'pr') return t('empty.inboxNoPRs');
  if (tab === 'actions') return t('empty.inboxNoActions');
  return t('empty.inboxNoIssues');
}

export function InboxReturnBar(props: { label: string; onReturn: () => void }): ReactNode {
  return (
    <div className="gw-inbox-return">
      <button className="gw-btn backbtn" type="button" onClick={props.onReturn}>
        <GwIcon name="chevron-left" size={12} />{t('inbox.backTo', { label: props.label })}
      </button>
    </div>
  );
}
