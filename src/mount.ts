/**
 * Three-mode mount: official native right sidebar first, better-sidebar tab
 * second, and a standalone right panel only as a fallback.
 *
 * The native sidebarRightTabs service has priority. A better-sidebar service
 * is used only when native registration is unavailable, and a late service
 * removes an already-mounted fallback to prevent duplicate surfaces.
 */

import { createElement, useEffect, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import type { ClientCtx, SidebarRegistry, TabDescriptorLike } from './types.ts';
import { iconFor } from './icons.ts';
import { WorkbenchApp } from './workbench.tsx';
import { ensureStyles } from './styles.ts';
import { loadPanelWidth, savePanelWidth } from './config.ts';
import { getInboxStore } from './inbox-store.ts';
import { t } from './locales.ts';

export const TAB_ID = 'github-workbench:repo';

function lookup(ctx: ClientCtx): SidebarRegistry | undefined {
  try {
    const svc = (ctx as { betterSidebar?: Partial<SidebarRegistry> }).betterSidebar;
    if (svc && typeof svc.registerTab === 'function') return svc as SidebarRegistry;
  } catch { /* Service is not ready. */ }
  return undefined;
}

export function mountWorkbench(ctx: ClientCtx): () => void {
  ensureStyles();
  const stopInbox = getInboxStore().start();

  /** Mount state. */
  let tabDisposer: (() => void) | null = null;
  let standaloneDisposer: (() => void) | null = null;
  let settled = false; // Whether the final mount has settled
  const started = Date.now();

  // ---------- Native official right sidebar (highest priority) ----------
  // The seat must be declared before the service is provided; wait for the
  // native service itself rather than treating the declaration as activation.
  let nativeDisposer: (() => void) | null = null;
  let seatDisposer: (() => void) | undefined;
  if (typeof ctx.inject === 'function') {
    try {
      const seat = ctx.inject(['sidebarRightTabs', 'sidebarRight'], (injected) => {
        const tabs = injected.get('sidebarRightTabs') as
          | {
            register(definition: {
              id: string; kind: string;
              priority?: 'extension' | 'builtin' | 'fallback';
              title: (address: string) => string;
              guide?: readonly { order: number; title: () => string; icon?: unknown }[];
            }): () => void;
          }
          | undefined;
        if (tabs === undefined || typeof tabs.register !== 'function') return;

        // A late native service wins over any fallback already mounted.
        try { tabDisposer?.(); tabDisposer = null; } catch { /* Already cleaned up. */ }
        try { standaloneDisposer?.(); standaloneDisposer = null; } catch { /* Already cleaned up. */ }
        settled = true;

        const disposeType = tabs.register({
          id: 'dsh-github-workbench',
          kind: 'github-workbench',
          priority: 'extension',
          title: () => inboxTitle(),
          guide: [{
            order: 55,
            title: () => t('workbench.title'),
            icon: (props: { size?: number }) => iconFor('octo')(props.size ?? 16),
          }],
        });

        const slots = ctx.slots;
        const disposeSlots: (() => void)[] = [];
        if (slots !== undefined) {
          disposeSlots.push(
            slots.inject('sidebar.right.pane.tab', () => slots.register({
              name: 'sidebar.right.pane.tab',
              key: 'dsh-github-workbench',
              inject: (sessionId: string) => ({ sessionId }),
            }, NativeBody)),
            slots.inject('sidebar.right.pane.tab.title', () => slots.register({
              name: 'sidebar.right.pane.tab.title',
              key: 'dsh-github-workbench',
              inject: () => ({}),
            }, NativeTitle)),
          );
        } else {
          console.warn('[github-workbench] ctx.slots is unavailable; native body was not registered');
        }

        nativeDisposer = (): void => {
          for (const dispose of disposeSlots.reverse()) dispose();
          disposeType();
          nativeDisposer = null;
        };
        return nativeDisposer;
      });
      seatDisposer = typeof seat?.dispose === 'function' ? () => seat.dispose?.() : undefined;
    } catch (error) {
      console.warn('[github-workbench] native right-sidebar wait failed:', error);
    }
  }

  const immediate = nativeDisposer === null ? lookup(ctx) : undefined;
  if (immediate) {
    const disposeTab = mountAsTab(ctx, immediate);
    return () => { stopInbox(); disposeTab(); seatDisposer?.(); };
  }


  // Runtime diagnostic probe for mount decisions.
  const dbg = (window as unknown as { __GW_DEBUG__?: Record<string, unknown> });
  dbg.__GW_DEBUG__ = {
    startedAt: new Date().toISOString(),
    ticks: 0, lookupOk: false, marker: false,
    lastLookupError: '', settled: '',
    ctxKeysAttempted: [] as string[],
  };
  const probeLookup = (): ReturnType<typeof lookup> => {
    try {
      const svc = (ctx as { betterSidebar?: Partial<SidebarRegistry> }).betterSidebar;
      dbg.__GW_DEBUG__!.lookupOk = !!(svc && typeof (svc as { registerTab?: unknown }).registerTab === 'function');
      return svc && typeof (svc as { registerTab?: unknown }).registerTab === 'function'
        ? (svc as SidebarRegistry) : undefined;
    } catch (e) {
      dbg.__GW_DEBUG__!.lastLookupError = String(e);
      return undefined;
    }
  };

  // The host marker identifies a sidebar environment where the service must be awaited.
  const sidebarMarker = (): boolean =>
    typeof document !== 'undefined' && !!document.querySelector('[data-dsh-better-sidebar]');

  const timer = setInterval(() => {
    const d = dbg.__GW_DEBUG__!;
    d.ticks = (d.ticks as number) + 1;
    d.marker = typeof document !== 'undefined' && !!document.querySelector('[data-dsh-better-sidebar]');
    // A ready service uses the official tab path; native remains higher priority.
    const reg = nativeDisposer === null ? probeLookup() : undefined;
    if (reg) {
      clearInterval(timer);
      if (standaloneDisposer) {
        console.info('[github-workbench] betterSidebar arrived late; switching from standalone panel to sidebar tab');
        standaloneDisposer();
        standaloneDisposer = null;
      }
      tabDisposer = mountAsTab(ctx, reg);
      settled = true;
      d.settled = 'tab';
      return;
    }
    if (settled) return;

    // A sidebar environment must keep waiting for the service.
    if (d.marker) return;

    // Only a confirmed non-sidebar environment may use the standalone fallback.
    if (Date.now() - started > 5_000 && nativeDisposer === null) {
      clearInterval(timer);
      standaloneDisposer = mountStandalone();
      settled = true;
      d.settled = 'standalone';
      // Watch for a late better-sidebar service after the fallback mounts.
      const lateCheck = setInterval(() => {
        const lateReg = nativeDisposer === null ? lookup(ctx) : undefined;
        if (lateReg && standaloneDisposer) {
          clearInterval(lateCheck);
          console.info('[github-workbench] betterSidebar detected; switching from standalone panel to sidebar tab');
          standaloneDisposer?.();
          standaloneDisposer = null;
          tabDisposer = mountAsTab(ctx, lateReg);
        } else if (!standaloneDisposer) {
          clearInterval(lateCheck);
        }
      }, 2_000);
    }
  }, 250);

  return () => {
    clearInterval(timer);
    stopInbox();
    tabDisposer?.();
    standaloneDisposer?.();
    nativeDisposer?.();
    seatDisposer?.();
  };
}

function inboxTitle(): string {
  const n = getInboxStore().unreadCount();
  return n > 0 ? t('workbench.titleWithCount', { count: n }) : t('workbench.title');
}

/** Native seat body; the host injects the session scope and keeps it visible. */
function NativeBody(props: { sessionId?: string }): React.ReactNode {
  return createElement(WorkbenchApp, {
    sessionId: props.sessionId ?? '',
    visible: true,
  });
}

/** Native seat title; subscribe to inbox changes for the live unread count. */
function NativeTitle(): React.ReactNode {
  const [title, setTitle] = useState(inboxTitle());
  useEffect(() => getInboxStore().subscribe(() => setTitle(inboxTitle())), []);
  return title;
}

function bindInboxBadge(registry: SidebarRegistry): () => void {
  const paint = (): void => {
    const n = getInboxStore().unreadCount();
    const title = n > 0 ? t('workbench.titleWithCount', { count: n }) : t('workbench.title');
    const tabs = registry.getSnapshot?.().state?.tabs ?? [];
    const ours = tabs.filter((tab) => tab.type === TAB_ID);
    if (ours.length === 0) {
      try { registry.updateTab?.(TAB_ID, { title }); } catch { /* No matching open tab. */ }
      return;
    }
    for (const tab of ours) {
      try { registry.updateTab?.(tab.id, { title }); } catch { /* Ignore a single tab update failure. */ }
    }
  };
  return getInboxStore().subscribe(paint);
}

// ---------- better-sidebar tab ----------

function mountAsTab(ctx: ClientCtx, registry: SidebarRegistry): () => void {
  const descriptor: TabDescriptorLike = {
    id: TAB_ID,
    title: inboxTitle,
    icon: iconFor('octo'),
    order: 55,
    badge: () => {
      const n = getInboxStore().unreadCount();
      return n > 0 ? n : null;
    },
    // Claim GitHub links from chat when the host setting is enabled.
    urlTarget: (url) => /(^|\.)github\.com$/.test(url.hostname),
    createTab: (state) => ({
      tab: {
        id: `${TAB_ID}:link:${state.nextBrowser}`,
        type: TAB_ID,
        title: t('workbench.title'),
      },
      patch: { nextBrowser: (state.nextBrowser ?? 0) + 1 },
    }),
    settings: {
      toggles: [
        { key: 'browserInterceptLinks', title: t('mount.settingsToken') },
        { key: 'browserInterceptHttps', title: t('mount.settingsHttps') },
      ],
      pluginToggles: [
        { key: 'token', title: t('workbench.patTitle'), type: 'text' },
        { key: 'autoRefreshSec', title: t('mount.settingsAutoRefresh'), type: 'number', min: 0, max: 120 },
      ],
    },
    component: (props) => createElement(WorkbenchApp, {
      sessionId: props.scope.sessionId,
      cwd: props.scope.cwd,
      visible: props.visible,
      seedUrl: props.tab.path,
    }),
  };
  let disposer: (() => void) | undefined;
  try {
    disposer = registry.registerTab(descriptor);
  } catch (error) {
    console.warn('[github-workbench] registerTab failed:', error);
  }
  const unsubBadge = bindInboxBadge(registry);
  return () => { unsubBadge(); disposer?.(); };
}

// ---------- Standalone right panel ----------

interface StandaloneState {
  root: Root;
  host: HTMLDivElement;
  observer: IntersectionObserver | null;
  visible: boolean;
  collapsed: boolean;
}

function mountStandalone(): () => void {
  const host = document.createElement('div');
  host.setAttribute('data-github-workbench-host', '');
  host.style.cssText = [
    'position:fixed', 'top:0', 'right:0', 'bottom:0', 'z-index:40',
    'display:flex', 'align-items:stretch', 'pointer-events:none',
  ].join(';');
  document.body.appendChild(host);

  const width = loadPanelWidth();
  const panel = document.createElement('div');
  panel.style.cssText = [
    'pointer-events:auto', 'width:100%', 'height:100%', 'position:relative',
    'display:flex', 'flex-direction:column',
    'background:var(--dsw-alias-bg-layer-1,#16181d)',
    'border-left:1px solid var(--dsw-alias-border-l1,rgba(128,128,128,.2))',
    'box-shadow:-12px 0 32px rgba(0,0,0,.22)',
    'color:var(--dsw-alias-label-primary,#e6edf3)',
    `font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif`,
  ].join(';');
  host.appendChild(panel);

  const inner = document.createElement('div');
  inner.style.cssText = 'flex:1;min-height:0;position:relative';
  panel.appendChild(inner);

  // Collapse/expand toggle beside the divider.
  const toggle = document.createElement('button');
  toggle.title = t('mount.collapseWorkbench');
  toggle.textContent = '‹';
  toggle.style.cssText = [
    'position:absolute', 'left:-13px', 'top:50%', 'transform:translateY(-50%)', 'z-index:5',
    'width:26px', 'height:52px', 'border:1px solid var(--dsw-alias-border-l1,rgba(128,128,128,.25))',
    'border-radius:8px', 'background:var(--dsw-alias-bg-layer-2,#1c1f26)',
    'color:var(--dsw-alias-label-secondary,#9aa1ab)', 'cursor:pointer', 'font-size:14px', 'padding:0',
  ].join(';');
  panel.appendChild(toggle);

  // Right-edge handle shown while collapsed.
  const edge = document.createElement('button');
  edge.textContent = '🐙 ' + t('workbench.title');
  edge.title = t('mount.expandWorkbench');
  edge.style.cssText = [
    'position:fixed', 'right:0', 'top:50%', 'transform:translateY(-50%)', 'z-index:41',
    'writing-mode:vertical-rl', 'padding:16px 7px', 'letter-spacing:.18em', 'font-size:12px',
    'border:1px solid var(--dsw-alias-border-l1,rgba(128,128,128,.25))', 'border-right:none',
    'border-radius:10px 0 0 10px', 'background:var(--dsw-alias-bg-layer-2,#1c1f26)',
    'color:var(--dsw-alias-label-secondary,#9aa1ab)', 'cursor:pointer', 'display:none', 'pointer-events:auto',
  ].join(';');
  document.body.appendChild(edge);

  // Drag the divider to resize.
  const resizer = document.createElement('div');
  resizer.style.cssText = [
    'position:absolute', 'left:-3px', 'top:0', 'bottom:0', 'width:6px',
    'cursor:col-resize', 'z-index:6', 'pointer-events:auto',
  ].join(';');
  panel.appendChild(resizer);

  const state: StandaloneState = {
    root: createRoot(inner), host, observer: null, visible: true, collapsed: false,
  };

  function render(): void {
    state.root.render(createElement(WorkbenchApp, {
      sessionId: '', // Standalone mode has no session context; the user enters a repository.
      visible: state.visible,
    }));
  }

  function setCollapsed(v: boolean): void {
    state.collapsed = v;
    host.style.display = v ? 'none' : 'flex';
    edge.style.display = v ? 'inline-flex' : 'none';
  }
  toggle.addEventListener('click', () => setCollapsed(true));
  edge.addEventListener('click', () => setCollapsed(false));

  let dragStartX = 0, startWidth = width;
  function onDown(e: PointerEvent): void {
    dragStartX = e.clientX; startWidth = panel.getBoundingClientRect().width;
    resizer.setPointerCapture(e.pointerId);
    e.preventDefault();
  }
  function onMove(e: PointerEvent): void {
    if (!resizer.hasPointerCapture(e.pointerId)) return;
    const w = Math.min(720, Math.max(320, Math.round(startWidth + (dragStartX - e.clientX))));
    host.style.width = `${w}px`;
  }
  function onUp(e: PointerEvent): void {
    if (!resizer.hasPointerCapture(e.pointerId)) return;
    resizer.releasePointerCapture(e.pointerId);
    savePanelWidth(panel.getBoundingClientRect().width);
  }
  resizer.addEventListener('pointerdown', onDown);
  resizer.addEventListener('pointermove', onMove);
  resizer.addEventListener('pointerup', onUp);

  // Observe visibility to mirror the tab's visible gate.
  if (typeof IntersectionObserver !== 'undefined') {
    state.observer = new IntersectionObserver((entries) => {
      state.visible = entries[0]?.isIntersecting ?? true;
      render();
    }, { threshold: 0 });
    state.observer.observe(panel);
  }

  host.style.width = `${width}px`;
  render();

  const paintEdge = (): void => {
    const n = getInboxStore().unreadCount();
    edge.textContent = `🐙 ${t('workbench.title')}${n > 0 ? t('inbox.unread', { count: n }) : ''}`;
    if (n > 0) edge.setAttribute('data-gw-inbox-unread', String(n));
    else edge.removeAttribute('data-gw-inbox-unread');
  };
  paintEdge();
  const unsubEdge = getInboxStore().subscribe(paintEdge);

  return () => {
    unsubEdge();
    state.observer?.disconnect();
    state.root.unmount();
    host.remove();
    edge.remove();
  };
}
