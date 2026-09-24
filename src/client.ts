/**
 * Browser entry point with three mount modes: the official native sidebar,
 * a better-sidebar tab, and a standalone right panel.
 *
 * Module-level inject declares betterSidebar and slots for Cordis access and
 * activation ordering. Slots provide the official native sidebar seat. When
 * better-sidebar is absent, mountWorkbench falls back to the standalone panel.
 * ctx.effect cleans up normal unload and HMR paths.
 */

import type { ClientCtx } from './types.ts';
import { mountWorkbench } from './mount.ts';

/** Cordis plugin name used by loader diagnostics. */
const name = 'github-workbench';

/**
 * Explicit injection is required because Cordis rejects undeclared service
 * access. betterSidebar is optional; slots is the official native sidebar
 * registration path.
 */
const inject = ['slots', 'betterSidebar'];

/** Client plugin body. */
export function apply(ctx: ClientCtx): void {
  ctx.effect(() => mountWorkbench(ctx), 'github-workbench: dual-mode mount');
}

export { inject, name };
