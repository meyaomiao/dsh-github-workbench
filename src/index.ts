/**
 * GitHub Workbench capability plugin for the dsh-better-sidebar right panel.
 *
 * This is a client-only plugin. All functionality is bundled in lib/client.js:
 * a remote repository tree plus Issues, Pull requests, and Actions tabs.
 * The server entry satisfies the Cordis loading protocol without registering
 * tools or starting services.
 */

/** Cordis plugin name used by loader diagnostics. */
const name = 'github-workbench';

/** Server-side context dependencies: none. */
const inject: string[] = [];

/** Server-side plugin body: no logic or configurable services. */
export function apply(): void {}

export { inject, name };
