import { build } from 'esbuild';
import { mkdir, readFile, rm } from 'node:fs/promises';

const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

await rm('lib', { recursive: true, force: true });
await mkdir('lib', { recursive: true });

// 1) 服务端入口:空实现,仅满足 cordis 装载协议
await build({
  entryPoints: ['src/index.ts'],
  outfile: 'lib/index.js',
  bundle: true,
  format: 'esm',
  platform: 'node',
  target: 'node20',
  sourcemap: true,
});

// 2) 浏览器端:ModuleLoader 工厂包装(与 dsh-better-sidebar / univer-sidebar 同格式)。
//    react 与平台模块不打包,由宿主 loader 的 require 解析。
//    Desktop 2.0.5 checks ModuleLoader id === package.json name.
const banner = [
  `window.__ModuleLoader__.load({ id: ${JSON.stringify(pkg.name)}, factory: (require) => {`,
  'var module = { exports: {} };',
  'var exports = module.exports;',
].join('\n');
const footer = '\nreturn module.exports;\n}});';

await build({
  entryPoints: ['src/client.ts'],
  outfile: 'lib/client.js',
  bundle: true,
  format: 'cjs',
  platform: 'browser',
  target: ['es2022'],
  jsx: 'automatic',
  external: ['react', 'react-dom/*', '@deepseek-ai/*'],
  banner: { js: banner },
  footer: { js: footer },
});

console.log('github-workbench: lib/index.js + lib/client.js 构建完成');
