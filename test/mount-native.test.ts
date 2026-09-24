import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { after, before, describe, it } from 'node:test';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';

const root = join(new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
let tempDir = '';
let mountWorkbench: (ctx: unknown) => () => void;
let originalDocument: PropertyDescriptor | undefined;
let originalWindow: PropertyDescriptor | undefined;

async function loadMountForTest(): Promise<void> {
  tempDir = await mkdtemp(join(root, 'node_modules', '.gw-mount-test-'));
  const outfile = join(tempDir, 'mount.mjs');
  await build({
    entryPoints: [join(root, 'src', 'mount.ts')],
    outfile,
    bundle: true,
    format: 'esm',
    platform: 'node',
    target: 'node20',
    plugins: [{
      name: 'runtime-stubs',
      setup(buildApi) {
        buildApi.onResolve({ filter: /^(react|react-dom)(\/.*)?$/ }, (args) => ({
          path: args.path,
          namespace: args.path.startsWith('react-dom') ? 'gw-react-dom' : 'gw-react',
        }));
        buildApi.onLoad({ filter: /.*/, namespace: 'gw-react' }, () => ({
          contents: `
            export const Fragment = Symbol('Fragment');
            export const createElement = (type, ...args) => ({ type, props: args[args.length - 1], children: args.slice(0, -1) });
            export const createContext = () => ({ Provider: () => null });
            export const useCallback = (fn) => fn;
            export const useContext = () => ({ confirm: async () => false, toast: () => undefined });
            export const useEffect = () => undefined;
            export const useMemo = (fn) => fn();
            export const useRef = (value) => ({ current: value });
            export const useState = (value) => [typeof value === 'function' ? value() : value, () => undefined];
            export const useSyncExternalStore = (_subscribe, getSnapshot) => getSnapshot();
            export const jsx = (type, props) => ({ type, props });
            export const jsxs = jsx;
          `,
          loader: 'js',
        }));
        buildApi.onLoad({ filter: /.*/, namespace: 'gw-react-dom' }, () => ({
          contents: `export const createRoot = () => ({ render() {}, unmount() {} });`,
          loader: 'js',
        }));
      },
    }],
  });
  const module = await import(`${pathToFileURL(outfile).href}?test=${Date.now()}`);
  mountWorkbench = module.mountWorkbench as (ctx: unknown) => () => void;
}

before(async () => {
  originalDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
  originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const style = { id: '', textContent: '' };
  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    value: {
      getElementById: () => null,
      createElement: () => style,
      head: { appendChild: () => undefined },
      querySelector: () => null,
      body: { appendChild: () => undefined },
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      hidden: false,
    },
  });
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {},
  });
  await loadMountForTest();
});

after(async () => {
  if (originalDocument) Object.defineProperty(globalThis, 'document', originalDocument);
  else delete (globalThis as { document?: unknown }).document;
  if (originalWindow) Object.defineProperty(globalThis, 'window', originalWindow);
  else delete (globalThis as { window?: unknown }).window;
  if (tempDir) await rm(tempDir, { recursive: true, force: true });
});

describe('sidebar mount priority', () => {
  it('registers the native surface and does not use better-sidebar when available', () => {
    const calls = {
      nativeDeps: [] as string[],
      nativeRegistrations: 0,
      betterRegistrations: 0,
      slotRegistrations: 0,
      nativeTypeDisposals: 0,
      slotDisposals: 0,
    };
    let nativeDefinition: { title?: () => string; guide?: readonly { title: () => string }[] } | undefined;
    const nativeTabs = {
      register(definition: typeof nativeDefinition) {
        calls.nativeRegistrations += 1;
        nativeDefinition = definition;
        return () => { calls.nativeTypeDisposals += 1; };
      },
    };
    const ctx = {
      effect() {},
      inject(deps: readonly string[], callback: (injected: { get: (name: string) => unknown }) => unknown) {
        calls.nativeDeps = [...deps];
        callback({ get: (name) => (name === 'sidebarRightTabs' ? nativeTabs : undefined) });
        return { dispose() {} };
      },
      slots: {
        inject(_name: string, callback: () => () => void) {
          const dispose = callback();
          return () => { calls.slotDisposals += 1; dispose(); };
        },
        register() {
          calls.slotRegistrations += 1;
          return () => undefined;
        },
      },
      betterSidebar: {
        registerTab() {
          calls.betterRegistrations += 1;
          return () => undefined;
        },
      },
    };

    const dispose = mountWorkbench(ctx);
    assert.deepEqual(calls.nativeDeps, ['sidebarRightTabs', 'sidebarRight']);
    assert.equal(calls.nativeRegistrations, 1);
    assert.equal(calls.betterRegistrations, 0);
    assert.equal(calls.slotRegistrations, 2);
    assert.equal(nativeDefinition?.title?.(), 'GitHub Workbench');
    assert.equal(nativeDefinition?.guide?.[0]?.title(), 'GitHub Workbench');
    dispose();
    assert.equal(calls.nativeTypeDisposals, 1);
    assert.equal(calls.slotDisposals, 2);
  });

  it('uses better-sidebar only when the native service is unavailable', () => {
    let betterRegistrations = 0;
    const ctx = {
      effect() {},
      betterSidebar: {
        registerTab() {
          betterRegistrations += 1;
          return () => undefined;
        },
      },
    };

    const dispose = mountWorkbench(ctx);
    assert.equal(betterRegistrations, 1);
    dispose();
  });
});
