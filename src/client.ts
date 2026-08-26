/**
 * 浏览器端入口:双形态挂载。
 *
 * 说明:模块级 inject 声明 betterSidebar(cordis 访问授权 + 激活顺序保证);
 * 独立安装(无 better-sidebar)时该属性为 undefined,mountWorkbench 据此
 * 自动降级为自绘右侧面板。卸载/HMR 经 ctx.effect 级联清理。
 */

import type { ClientCtx } from './types.ts';
import { mountWorkbench } from './mount.ts';

/** Cordis 插件名,loader 诊断使用。 */
const name = 'github-workbench';

/**
 * 必须显式声明注入:cordis Context 代理会拒绝未声明服务的属性访问
 * (实测错误:'cannot get property "betterSidebar" without inject')。
 * 声明后:better-sidebar 在 ⇒ 保证其先激活且可读;不在 ⇒ 属性为
 * undefined,mountWorkbench 自动走独立面板形态(官方 optional-peer 语义)。
 */
const inject = ['betterSidebar'];

/** 客户端插件体。 */
export function apply(ctx: ClientCtx): void {
  ctx.effect(() => mountWorkbench(ctx), 'github-workbench: dual-mode mount');
}

export { inject, name };
