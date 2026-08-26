# GitHub 工作台(github-workbench)设计方案

> 状态:**视觉稿已确认(含写操作)**——本文档为落码依据。
> 规范依据:dsh-better-sidebar 仓库 `docs/external-plugin-guide.md`(v0.12.0+ API)与 AGENTS.md;
> 目标宿主版本:已安装的 dsh-better-sidebar **0.16.1**(覆盖指南全部所需特性)。

---

## 1. 要解决的问题

在 dsh-better-sidebar 右侧面板固定一个「GitHub 工作台」tab:

- 左侧:**远端仓库目录树**(本地树内置 explorer 已有,不重复);
- 顶部子页签:**Code / Issues / Pull requests / Actions**,数据来自 api.github.com;
- **读写一体**:查看之外支持创建/评论/编辑/状态流转等写操作——人在侧边栏亲自点击,
  即天然的人类审批,无需任何额外审批链(这是比 agent 工具代写更安全的形态);
- 明确不做的:iframe 嵌 github.com 原生页(GitHub 下发 `X-Frame-Options: deny` +
  `frame-ancestors 'none'`,浏览器层强制,任何插件绕不开,已实测)。
  所以是「GitHub 原生**数据**的原生**风格**重渲染」,不是嵌网页。

## 2. 与官方接入规范的逐条对照

| 官方指南要求 | 本插件的做法 |
|---|---|
| 消费端只做 **type-only import**,禁止 value-import 别的插件(§2/§10 纯度门) | 零 value-import;类型本地最小重述(`src/types.ts`) |
| 服务就绪时序:`inject = ['betterSidebar']`(§3) | 模块级 `export const inject = ['betterSidebar']`;另加防御性 try/catch(better-sidebar 缺失时静默跳过,等价 peerDependenciesMeta.optional 的降级语义) |
| 注册必须包 `ctx.effect(...)` 返回 disposer(§3/§9,HMR-safe) | 是 |
| tab id 带包前缀,不与内置冲突(§4.4 内置清单) | `github-workbench:repo`,`single: true`,`order: 55`(browser=50 之后) |
| 组件契约 `(props: TabComponentProps) => ReactNode`(§4.2) | 只用 `scope` / `visible`;**visible=false 时暂停一切轮询**(§4.2 性能门) |
| 插件自有设置走 `settings.pluginToggles`(§8,v0.12.0+)持久化在 `pluginSettings[<id>]` | PAT / owner·repo / 默认分支 / 自动刷新周期全部走该 seam,**不用 localStorage 存 token** |
| 样式跟随皮肤:面板表面 `var(--dsw-alias-bg-layer-1)`(AGENTS.md §8)+ 既有验证结论(CSS Modules + `--dsw-alias-*` 令牌) | 全部颜色/字号/边框消费宿主令牌,零硬编码十六进制色,深浅色主题自动跟随 |
| 数据访问:页面内 fetch `/sidebar/api/*` 同源同权(§6) | 仅用于「从当前会话 cwd 自动识别仓库」:读 `.git/config` 解析 origin 远端 |

## 2.5 双形态挂载(v0.1 新增:tab 优先,独立面板兜底)

同一份 client bundle、同一个 WorkbenchApp 组件,两种宿主形态在运行时自动协商:

| 环境 | 形态 | 实现 |
|---|---|---|
| 已装 dsh-better-sidebar | 注册为侧边栏 tab(`registerTab`,行为不变) | `inject=['betterSidebar']` 正常路径 |
| 独立安装(无 better-sidebar) | 对话区右侧自绘面板,可展开/收起 | 模仿 better-sidebar 的框架实现方式:`document.body` 附着固定定位宿主层 `[data-github-workbench-host]`(z-index 40,低于宿主浮层栈)+ 右缘竖排开关按钮;**零宿主源码改动**,符合 AGENTS.md 约束 |

独立形态细节:面板默认宽 `clamp(360px, 32vw, 520px)`(拖缘可调,持久化);收起后右缘留 28px 竖条按钮(octocat 图标 + 「工作台」竖排文字);tab 形态的 `visible` 门控在此等价替换为 IntersectionObserver 可见性观察。两形态共享全部业务代码与样式,差异仅在挂载壳(~150 行)。

## 3. 数据层

- 直连 `https://api.github.com`(REST v3 对浏览器开放 CORS),请求头带
  `Authorization: Bearer <PAT>` + `X-GitHub-Api-Version: 2022-11-28`;
- PAT 权限要求(v0.1 含写操作):细粒度 token 对目标仓开
  **Contents(R)、Issues(RW)、Pull requests(RW)、Actions(RW)**;
  经典 token 则 `repo`(+改 workflow 文件才需要 `workflow`)。无 token 可浏览公开仓但匿名限额
  60 次/小时且**完全无法写**,限流/权限错误里给出明确指引;
- 错误归一:401(token 失效)/ 403+`x-ratelimit-remaining: 0`(限流)/ 404 / 422(校验失败,
  展示 GitHub 返回的 message)分别给出中文可操作提示;
- 写操作统一交互:**按钮点击即执行的人操作**,破坏性动作(合并/关闭/取消运行)弹自定义确认气泡;
  成功后局部 refetch(列表项或详情),失败以行内 banner 展示 GitHub 的错误 message。

### 端点清单

**读:**

| 页签 | 端点 |
|---|---|
| 头部 | `GET /repos/{o}/{r}`、`GET /branches?per_page=50`、仓库切换弹层 `GET /user/repos`(同前,5min 缓存,下拉即列前 20)+ 公开仓库发现 `GET /search/repositories?q=<q> in:name&sort=stars&per_page=8`(输入 ≥3 字符 450ms 去抖触发) |
| Code-目录树 | `GET /repos/{o}/{r}/git/trees/{branch}?recursive=1`(`truncated:true` 时提示并降级逐级 contents) |
| Code-文件预览 | `GET /repos/{o}/{r}/contents/{path}?ref={branch}`(<900KB 文本;base64→UTF-8;二进制/超大给外链降级) |
| Issues | `GET /issues?state=open&sort=updated&per_page=30`(过滤 `pull_request` 项)、`GET /issues/{n}` + `GET /issues/{n}/comments` |
| Pull requests | `GET /pulls?state=open&per_page=30`、`GET /pulls/{n}`、`GET /commits/{sha}/check-runs` |
| Actions | `GET /actions/runs?per_page=20` |

**写(v0.1 全部包含):**

| 动作 | 端点 | 确认门 |
|---|---|---|
| 新建 Issue | `POST /issues`(title+body) | 否 |
| 编辑 Issue 标题/正文 | `PATCH /issues/{n}` | 否 |
| 评论 Issue/PR | `POST /issues/{n}/comments` | 否 |
| 关闭/重开 Issue·PR | `PATCH /issues/{n}` 或 `/pulls/{n}`(`state`) | 关闭需确认 |
| 编辑评论 | `PATCH /issues/comments/{id}` | 否 |
| 删除评论 | `DELETE /issues/comments/{id}` | 需确认 |
| 新建 PR | `POST /pulls`(head/base 下拉取自 branches,title+body) | 否 |
| 合并 PR | `PUT /pulls/{n}/merge`(merge_method: merge/squash/rebase 三选) | **强确认**:展示将产生的提交标题与方法 |
| 重跑 Workflow Run | `POST /actions/runs/{id}/rerun` | 否 |
| 取消运行 | `POST /actions/runs/{id}/cancel` | 需确认 |

## 4. 目录结构

```
packages/github-workbench/
├── package.json            # dsh.bundle.patch + dsh.client(platform web)
├── cordis.patch.yml        # - insert: - id: github-workbench
├── scripts/build.mjs       # esbuild 双入口:host(esm/node20) + client(cjs/browser, ModuleLoader 包装)
├── src/
│   ├── index.ts            # host 半:空实现(纯客户端插件)
│   ├── types.ts            # 宿主类型本地最小重述(零跨包运行时依赖)
│   ├── lib.ts              # 纯函数:.git/config 解析、repo 输入解析、树构建、timeAgo、base64 解码
│   ├── api.ts              # gh() 封装:鉴权头、限流/错误归一、上表全部端点的类型化函数
│   ├── workbench.tsx       # 主组件:头部 + 子页签路由 + 共享确认气泡/toast
│   ├── code-view.tsx       # 目录树 + 文件预览
│   ├── issues-view.tsx     # 列表 + 详情抽屉(正文/评论区/编辑/新建表单)
│   ├── pulls-view.tsx      # 列表 + 详情(check-runs 摘要/评论/合并三法/关闭)+ 新建 PR 表单
│   ├── actions-view.tsx    # runs 列表(行悬停 ⟳ 重跑 / ✕ 取消)
│   ├── client.ts           # 注册入口:inject + apply(ctx.effect(registerTab))
│   └── workbench.module.css# CSS Modules,全量 --dsw-* 令牌
└── test/lib.test.ts        # node:test 纯函数单测
```

## 5. 设置项(settings.pluginToggles,齿轮弹窗)

| key | 控件 | 说明 |
|---|---|---|
| `token` | text | PAT(见 §3 权限要求);仅存宿主 prefs 的 pluginSettings |
| `repo` | text | `owner/repo` 或仓库 URL;首开自动用会话 cwd 的 `.git/config` 预填 |
| `branch` | text | 缺省取 default_branch |
| `autoRefreshSec` | number(0–120) | PR/Actions 列表自动刷新周期,0=关;受 `visible` 门控 |
| `fontSize`(组件内 ⚙,localStorage) | select | 正文字号:跟随 DSH(s-14,默认)/ 13 / 14 / 15;经 `--gw-body-size` 覆写根字号,次级文字随令牌层级同步 |

组件读取:`service.getSnapshot().prefs` 的 pluginSettings blob + `subscribeState` 订阅变更
(以 0.16.1 的 `lib/types/client/service.d.ts` 实际形状为准,不透出则回退 store 订阅,对外行为不变)。

## 6. UI 结构(详见 design/mockup.html 可交互稿)

> **挂载填充契约**:tab 形态下组件根节点以 `absolute inset:0` 撑满 better-sidebar 的
> TabContent(宽/高 100%,`min-height:0` 弹性链),**不自带圆角、描边、投影**——面板外框
> 属于宿主;内部再按容器查询三档自适应。视觉稿默认呈现的圆角卡片 + 宽度滑杆是「独立演示壳」,
> 用顶栏按钮可切到「sidebar 内嵌态」预览真实的撑满效果。

```
┌────────────────────────────────────────────────┐
│ 🐙 owner/repo [private]  main ▾   ⟳  ⚙  ●     │ ← 头部:仓库、分支、刷新、设置、token 状态灯
│ Code │ Issues ⑫ │ Pull requests ③ │ Actions   │ ← 子页签(下划线激活态 + 计数角标)
├──────────────┬─────────────────────────────────┤
│ ▾ src        │  src/client/api.ts              │ ← Code:左树右文,行号预览
│   · api.ts   │  1 import …                     │
├──────────────┴─────────────────────────────────┤
│ Issues 列表工具条:  4 open          [+ 新建]   │ ← 各列表页签都有工具条
│ 详情抽屉:标题/正文/评论区 + 底部评论框         │
│   [关闭 Issue] [编辑]            [发表评论]     │ ← 写操作按钮区
│ PR 详情:[merge ▾(merge/squash/rebase)] [关闭] │ ← 合并有强确认气泡
│ Actions 行悬停:⟳ 重跑   ✕ 取消                │ ← 取消有确认
└──────────────────────────────────────────────────┘
```

### 图标系统(审查修订:全局统一)

全站唯一图标集:**16px octicon 风格、单色 fill、继承 currentColor**,封装为一个 `GwIcon` 组件(name → path 注册表);页签、按钮、行状态、弹层一律走它,**禁止文本字形图标**(此前 ▾/⟳/⚙/✓/✗/◐ 混用已废弃)。语义色圆点(token 状态灯、checks 汇总点、仓库列表当前点)是指示器而非图标,保留 CSS 圆点并统一 8px 规格。

### 响应式(审查修订:流体宽度 + 容器查询)

面板宽度从固定 440px 改为**流体**:`width:100%` 跟随承载容器(better-sidebar 面板拖宽、独立面板拖宽、底部面板横条均成立);内部以 CSS **container queries** 分三档:

| 承载宽度 | 适配 |
|---|---|
| <720px(默认紧凑档) | 目录树 172px,行距紧凑 |
| ≥720px | 树 230px,工具条/头部留白加大,页签字号升一档 |
| ≥1000px | 树 280px,行副标题升字号,行尾浮现「创建时间」列,详情抽屉由全覆盖改为内嵌卡片(inset 12px + 圆角描边) |

视觉稿顶部有**宽度滑杆(340–1300px)**,可实时拖动验证三档切换;`?w=<px>` 直达指定宽度供截图。

### 令牌映射(唯一允许的颜色来源)

| 元素 | 令牌 |
|---|---|
| 面板表面 | `--dsw-alias-bg-layer-1` |
| 主/次/弱文字 | `--dsw-alias-label-primary / secondary / tertiary` |
| 边框 | `--dsw-alias-border-l1 / l2` |
| 行悬停/激活底 | `--dsw-alias-interactive-bg-hover / active` |
| 主按钮/链接 | `--dsw-alias-accent-primary` |
| 成功/危险/注意状态 | `--dsw-alias-state-success/danger/attention-primary` |
| 字号 | `--dsw-font-s-14 / xs-13 / xxxs-11` |

## 7. 范围与边界

- **v0.1(本次)= 读 + 上表全部写操作**;不做:release 管理、code review 逐行评论、
  项目板/Pages/仓库设置类管理(后续版本按需加);
- 已知限制:超大仓 recursive tree 可能 truncated(有降级);写操作依赖 token 权限,
  无权时按钮置灰并在 tooltip 说明缺哪个权限;
- 验收:硬刷新后 `+` 菜单出现「GitHub 工作台」;四页签可切换;真实建一个 issue、发一条评论、
  squash 合并一个测试 PR、重跑一次 CI 全链路走通;深浅主题无违和;HMR 反复禁用/启用无
  "already registered" 报错。
