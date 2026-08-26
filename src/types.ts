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
}

/** better-sidebar 注册表的本地最小契约(只用 registerTab)。 */
export interface SidebarRegistry {
  registerTab(descriptor: TabDescriptorLike): () => void;
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
  component: (props: TabPropsLike) => ReactNode;
}
