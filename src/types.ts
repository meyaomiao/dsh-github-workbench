/**
 * 本地重述的最小宿主类型(与 univer-sidebar 同策略):
 * 不 value-import dsh-better-sidebar,避免双实例与构建纯度门问题;
 * 运行时经轮询探测 ctx.betterSidebar 出现后再注册。
 */

import type { ReactNode } from 'react';

/** 客户端 cordis context 的最小切面。 */
export interface ClientCtx {
  /** 注册 fiber 级清理钩子(卸载/HMR 时自动调用返回的 disposer)。 */
  effect(fn: () => (() => void) | void, label?: string): void;
  /**
   * 运行时服务等待(cordis Context 方法,非服务属性):声明依赖并在其
   * 就绪时执行回调。DSH 0.1.5+ 用于等待官方原生右侧栏服务。
   */
  inject?(
    deps: readonly string[],
    fn: (ctx: { get(name: string): unknown }) => (() => void) | void,
  ): { dispose?: () => void };
  /** 官方座位系统(DSH web client 核心服务;原生右侧栏内容体注册需要)。 */
  slots?: {
    inject(name: string, fn: () => (() => void) | void): () => void;
    register(spec: Record<string, unknown>, component: unknown): () => void;
  };
}

/** better-sidebar 注册表的本地最小契约(registerTab + 可选 badge 刷新)。 */
export interface SidebarRegistry {
  registerTab(descriptor: TabDescriptorLike): () => void;
  features?: readonly string[];
  updateTab?(tabId: string, patch: { title?: string; path?: string; meta?: unknown }): void;
  getSnapshot?: () => {
    state?: { tabs?: readonly { id: string; type: string }[] };
    prefs?: { pluginSettings?: Record<string, Record<string, unknown>> };
  };
}

/** 会话作用域(与 better-sidebar 的 SessionScope 对齐的字段子集)。 */
export interface SessionScopeLite {
  sessionId: string;
  cwd?: string;
}

/** SidebarTab 的本地字段子集。 */
export interface SidebarTabLite {
  id: string;
  type: string;
  path?: string;
  meta?: unknown;
}

/** TabComponentProps 的本地字段子集。 */
export interface TabPropsLike {
  scope: SessionScopeLite;
  visible: boolean;
  tab: SidebarTabLite;
}

/** TabDescriptor 的本地最小契约。 */
export interface TabDescriptorLike {
  id: string;
  title: string | (() => string);
  icon?: ReactNode | ((size: number) => ReactNode);
  order?: number;
  single?: boolean;
  dedupeKey?: (tab: { id: string; type: string }) => string | undefined;
  available?: unknown;
  /** 声明式设置(pluginToggles/render),宿主侧形状,本地仅透传。 */
  settings?: unknown;
  /** 外链认领(v0.13+):命中 github.com 链接时由宿主以本类型 openTab。 */
  urlTarget?: (url: URL) => boolean;
  /** 自定义铸造(每个链接独立实例,URL 落在 tab.path)。 */
  createTab?: (state: { nextBrowser: number }) =>
    { tab: SidebarTabLite; patch?: Record<string, unknown> } | null;
  badge?: () => string | number | null | undefined;
  component: (props: TabPropsLike) => ReactNode;
}
