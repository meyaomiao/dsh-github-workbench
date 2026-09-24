/**
 * Minimal local host types, following the univer-sidebar strategy.
 * dsh-better-sidebar is not imported as a runtime value, avoiding duplicate
 * instances and keeping the build purity gate intact. The runtime waits for
 * ctx.betterSidebar before registering a fallback tab.
 */

import type { ReactNode } from 'react';

/** Minimal client-side Cordis context surface. */
export interface ClientCtx {
  /** Registers a fiber-level cleanup hook for unload and HMR. */
  effect(fn: () => (() => void) | void, label?: string): void;
  /** Waits for runtime services and invokes the callback when they are ready. */
  inject?(
    deps: readonly string[],
    fn: (ctx: { get(name: string): unknown }) => (() => void) | void,
  ): { dispose?: () => void };
  /** Official slot system used to register native sidebar content. */
  slots?: {
    inject(name: string, fn: () => (() => void) | void): () => void;
    register(spec: Record<string, unknown>, component: unknown): () => void;
  };
}

/** Minimal better-sidebar registry contract. */
export interface SidebarRegistry {
  registerTab(descriptor: TabDescriptorLike): () => void;
  features?: readonly string[];
  updateTab?(tabId: string, patch: { title?: string; path?: string; meta?: unknown }): void;
  getSnapshot?: () => {
    state?: { tabs?: readonly { id: string; type: string }[] };
    prefs?: { pluginSettings?: Record<string, Record<string, unknown>> };
  };
}

/** Session scope fields aligned with better-sidebar. */
export interface SessionScopeLite {
  sessionId: string;
  cwd?: string;
}

/** Minimal SidebarTab field subset. */
export interface SidebarTabLite {
  id: string;
  type: string;
  path?: string;
  meta?: unknown;
}

/** Minimal TabComponentProps field subset. */
export interface TabPropsLike {
  scope: SessionScopeLite;
  visible: boolean;
  tab: SidebarTabLite;
}

/** Minimal TabDescriptor field subset. */
export interface TabDescriptorLike {
  id: string;
  title: string | (() => string);
  icon?: ReactNode | ((size: number) => ReactNode);
  order?: number;
  single?: boolean;
  dedupeKey?: (tab: { id: string; type: string }) => string | undefined;
  available?: unknown;
  /** Declarative host settings passed through unchanged. */
  settings?: unknown;
  /** Claims matching GitHub links when the host setting is enabled. */
  urlTarget?: (url: URL) => boolean;
  /** Creates an independent tab for each claimed link. */
  createTab?: (state: { nextBrowser: number }) =>
    { tab: SidebarTabLite; patch?: Record<string, unknown> } | null;
  badge?: () => string | number | null | undefined;
  component: (props: TabPropsLike) => ReactNode;
}
