/**
 * github-workbench 能力插件:在 dsh-better-sidebar 右侧面板提供「GitHub 工作台」tab。
 *
 * 纯客户端插件——全部能力在 lib/client.js(浏览器 bundle):
 * 远端仓库目录树(git trees API)+ Issues / Pull requests / Actions 子页签。
 * 服务端入口仅满足 cordis 装载协议,不注册工具、不起服务。
 *
 * 前置:dsh-better-sidebar 提供 ctx.betterSidebar 注册接口。
 */

/** Cordis 插件名,loader 诊断使用。 */
const name = 'github-workbench';

/** 本插件依赖的上下文服务:服务端无。 */
const inject: string[] = [];

/** Cordis 插件体:无服务端逻辑(无可配置项,故不导出 Config)。 */
export function apply(): void {}

export { inject, name };
