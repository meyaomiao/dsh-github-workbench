/**
 * 双形态挂载(tab 优先,独立面板兜底):
 * - ctx.betterSidebar 可用 → registerTab 注册侧边栏页签(官方路径);
 * - 不可用(独立安装)→ 模仿 better-sidebar 的框架方式自绘右侧可展开/收起面板:
 *   body 附着固定定位宿主层 + 右缘竖条开关 + 拖缘调宽,零宿主源码改动。
 * 时序策略(实测教训):本 bundle 可能早于 better-sidebar 的 client half 激活,
 * 服务 provide 会迟到——因此以宿主 DOM 标记 [data-dsh-better-sidebar] 判定环境:
 * 标记在 ⇒ 无限等服务(上限 60s);标记始终缺席才降级独立面板;兜底后服务迟到
 * 则自动卸载面板切换为 tab(收敛保证,杜绝双挂载)。
 */

import { createElement, useEffect, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import type { ClientCtx, SidebarRegistry, TabDescriptorLike } from './types.ts';
import { iconFor } from './icons.ts';
import { WorkbenchApp } from './workbench.tsx';
import { ensureStyles } from './styles.ts';
import { loadPanelWidth, savePanelWidth } from './config.ts';
import { getInboxStore } from './inbox-store.ts';

export const TAB_ID = 'github-workbench:repo';

function lookup(ctx: ClientCtx): SidebarRegistry | undefined {
  try {
    const svc = (ctx as { betterSidebar?: Partial<SidebarRegistry> }).betterSidebar;
    if (svc && typeof svc.registerTab === 'function') return svc as SidebarRegistry;
  } catch { /* 服务未就绪 */ }
  return undefined;
}

export function mountWorkbench(ctx: ClientCtx): () => void {
  ensureStyles();
  const stopInbox = getInboxStore().start();

  /** 挂载状态(声明先于形态〇:seat 回调可能同步触发,避免 TDZ)。 */
  let tabDisposer: (() => void) | null = null;
  let standaloneDisposer: (() => void) | null = null;
  let settled = false; // 已收敛到最终形态?
  const started = Date.now();

  // ---------- 形态〇:官方原生右侧栏(DSH 0.1.5+,最高优先) ----------
  // 参照 better-sidebar 0.19 native/index.ts:座位声明早于服务 provide,
  // 必须等 sidebarRightTabs 服务本身,不能靠声明触发。
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

        // 双入口仲裁:native 后到时,收掉可能已挂的 betterSidebar 页签 /
        // 独立面板(收敛保证,杜绝双挂载)。
        try { tabDisposer?.(); tabDisposer = null; } catch { /* 已清理 */ }
        try { standaloneDisposer?.(); standaloneDisposer = null; } catch { /* 已清理 */ }
        settled = true;

        const disposeType = tabs.register({
          id: 'dsh-github-workbench',
          kind: 'github-workbench',
          priority: 'extension',
          title: () => inboxTitle(),
          guide: [{
            order: 55,
            title: () => 'GitHub 工作台',
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
          console.warn('[github-workbench] ctx.slots 不可用,原生内容体未注册');
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
      console.warn('[github-workbench] 原生右侧栏等待启动失败:', error);
    }
  }

  const immediate = nativeDisposer === null ? lookup(ctx) : undefined;
  if (immediate) {
    const disposeTab = mountAsTab(ctx, immediate);
    return () => { stopInbox(); disposeTab(); seatDisposer?.(); };
  }


  // 运行时诊断探针(临时):暴露挂载决策的每一环,便于远程定位
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

  // 环境探测:better-sidebar 宿主标记出现 ⇒ 这是侧边栏环境,必须等服务
  // (其 client half 的 provide 可能晚于本 bundle 数秒),绝不降级独立面板。
  const sidebarMarker = (): boolean =>
    typeof document !== 'undefined' && !!document.querySelector('[data-dsh-better-sidebar]');

  const timer = setInterval(() => {
    const d = dbg.__GW_DEBUG__!;
    d.ticks = (d.ticks as number) + 1;
    d.marker = typeof document !== 'undefined' && !!document.querySelector('[data-dsh-better-sidebar]');
    // ① 服务就绪 → 官方 tab 路径(最高优先;若此前误挂独立面板则先撤再切)
    //    原生右侧栏已激活 ⇒ 本形态让位(防双入口)
    const reg = nativeDisposer === null ? probeLookup() : undefined;
    if (reg) {
      clearInterval(timer);
      if (standaloneDisposer) {
        console.info('[github-workbench] betterSidebar 服务迟到:卸载独立面板,切换为侧边栏页签');
        standaloneDisposer();
        standaloneDisposer = null;
      }
      tabDisposer = mountAsTab(ctx, reg);
      settled = true;
      d.settled = 'tab';
      return;
    }
    if (settled) return;

    // ② 侧边栏环境 ⇒ 继续等服务(防御上限 60s),永不降级
    if (d.marker) return;

    // ③ 确认非侧边栏环境且超过宽限期 ⇒ 独立面板兜底(原生栏已激活则永不)
    if (Date.now() - started > 5_000 && nativeDisposer === null) {
      clearInterval(timer);
      standaloneDisposer = mountStandalone();
      settled = true;
      d.settled = 'standalone';
      // 兜底后低频守望:better-sidebar 若之后才就绪,自动切换为 tab
      const lateCheck = setInterval(() => {
        const lateReg = nativeDisposer === null ? lookup(ctx) : undefined;
        if (lateReg && standaloneDisposer) {
          clearInterval(lateCheck);
          console.info('[github-workbench] 独立面板运行中检测到 betterSidebar,自动切换为侧边栏页签');
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
  return n > 0 ? `GitHub 工作台 (${n})` : 'GitHub 工作台';
}

/** 原生座位的内容体:框架注入 sessionId(会话作用域);恒可见。 */
function NativeBody(props: { sessionId?: string }): React.ReactNode {
  return createElement(WorkbenchApp, {
    sessionId: props.sessionId ?? '',
    visible: true,
  });
}

/** 原生座位的标签标题:订阅 inbox store,未读数实时进标题。 */
function NativeTitle(): React.ReactNode {
  const [title, setTitle] = useState(inboxTitle());
  useEffect(() => getInboxStore().subscribe(() => setTitle(inboxTitle())), []);
  return title;
}

function bindInboxBadge(registry: SidebarRegistry): () => void {
  const paint = (): void => {
    const n = getInboxStore().unreadCount();
    const title = n > 0 ? `GitHub 工作台 (${n})` : 'GitHub 工作台';
    const tabs = registry.getSnapshot?.().state?.tabs ?? [];
    const ours = tabs.filter((t) => t.type === TAB_ID);
    if (ours.length === 0) {
      try { registry.updateTab?.(TAB_ID, { title }); } catch { /* 无已开 tab */ }
      return;
    }
    for (const t of ours) {
      try { registry.updateTab?.(t.id, { title }); } catch { /* 忽略单条失败 */ }
    }
  };
  return getInboxStore().subscribe(paint);
}

// ---------- 形态一:better-sidebar tab ----------

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
    // 认领聊天中的 github.com 链接(需宿主「接管外链」开关开启):
    // 每个链接铸造独立实例,URL 落在 tab.path,由 WorkbenchApp 解析深链
    urlTarget: (url) => /(^|\.)github\.com$/.test(url.hostname),
    createTab: (state) => ({
      tab: {
        id: `${TAB_ID}:link:${state.nextBrowser}`,
        type: TAB_ID,
        title: 'GitHub 工作台',
      },
      patch: { nextBrowser: (state.nextBrowser ?? 0) + 1 },
    }),
    // 原生齿轮设置:token 兜底来源与自动刷新周期(值经 absorbHostToken 合并进组件)
    settings: {
      toggles: [
        { key: 'browserInterceptLinks', title: '接管聊天中的 GitHub 链接到工作台' },
        { key: 'browserInterceptHttps', title: '接管 https:// 链接' },
      ],
      pluginToggles: [
        { key: 'token', title: 'GitHub Token(PAT)', type: 'text' },
        { key: 'autoRefreshSec', title: '自动刷新周期(秒)', type: 'number', min: 0, max: 120 },
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
    console.warn('[github-workbench] registerTab 失败:', error);
  }
  const unsubBadge = bindInboxBadge(registry);
  return () => { unsubBadge(); disposer?.(); };
}

// ---------- 形态二:独立右侧面板 ----------

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

  // 收起/展开开关(贴分隔线左缘)
  const toggle = document.createElement('button');
  toggle.title = '收起 GitHub 工作台';
  toggle.textContent = '‹';
  toggle.style.cssText = [
    'position:absolute', 'left:-13px', 'top:50%', 'transform:translateY(-50%)', 'z-index:5',
    'width:26px', 'height:52px', 'border:1px solid var(--dsw-alias-border-l1,rgba(128,128,128,.25))',
    'border-radius:8px', 'background:var(--dsw-alias-bg-layer-2,#1c1f26)',
    'color:var(--dsw-alias-label-secondary,#9aa1ab)', 'cursor:pointer', 'font-size:14px', 'padding:0',
  ].join(';');
  panel.appendChild(toggle);

  // 右缘竖条(收起态显示)
  const edge = document.createElement('button');
  edge.textContent = '🐙 工作台';
  edge.title = '展开 GitHub 工作台';
  edge.style.cssText = [
    'position:fixed', 'right:0', 'top:50%', 'transform:translateY(-50%)', 'z-index:41',
    'writing-mode:vertical-rl', 'padding:16px 7px', 'letter-spacing:.18em', 'font-size:12px',
    'border:1px solid var(--dsw-alias-border-l1,rgba(128,128,128,.25))', 'border-right:none',
    'border-radius:10px 0 0 10px', 'background:var(--dsw-alias-bg-layer-2,#1c1f26)',
    'color:var(--dsw-alias-label-secondary,#9aa1ab)', 'cursor:pointer', 'display:none', 'pointer-events:auto',
  ].join(';');
  document.body.appendChild(edge);

  // 拖缘调宽
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
      sessionId: '', // 独立形态无会话上下文:跳过工作区自动识别,由用户手动输入仓库
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

  // 可见性观察(等价 tab 形态的 visible 门控)
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
    edge.textContent = n > 0 ? `🐙 工作台 · ${n}` : '🐙 工作台';
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
