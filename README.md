<div align="center">

# 🐙 dsh-github-workbench · GitHub 工作台

**把 GitHub 装进 [DeepSeek Harness](https://github.com/deepseek-ai) 的侧边栏:仓库目录树 + Issues / Pull requests / Actions 页签,读之外直接建 Issue、发 PR、评论、合并、重跑 CI。**

[![Awesome DSH Plugin](https://awesome-dsh-plugin.com/badge.svg)](https://awesome-dsh-plugin.com)
[![dsh-plugin](https://img.shields.io/badge/dsh-plugin-4d6bfe)](https://github.com/topics/dsh-plugin)
[![dsh-better-sidebar](https://img.shields.io/badge/生态-dsh--better--sidebar-4d6bfe)](https://github.com/topics/dsh-better-sidebar)
[![npm](https://img.shields.io/npm/v/dsh-github-workbench)](https://www.npmjs.com/package/dsh-github-workbench)
[![license](https://img.shields.io/badge/license-MIT-green)](./LICENSE)
![node](https://img.shields.io/badge/node-%E2%89%A522-blue)

*人在面板里亲自点按钮 = 天然的人类审批,无需任何额外审批链。*

</div>

---

## ✨ 截图速览

| Code:远端目录树 + 文件预览 | Issues 列表 |
|---|---|
| ![Code](screenshots/01-code.png) | ![Issues](screenshots/02-issues.png) |

| Issue 详情 + 评论/编辑/关闭 | Pull requests(checks 摘要 / 合并三法) |
|---|---|
| ![Issue Detail](screenshots/03-issue-detail.png) | ![Pulls](screenshots/04-pulls.png) |

| Actions(runs 列表,悬停 重跑/取消) | 仓库切换弹层(自动拉取 + 公开仓搜索) |
|---|---|
| ![Actions](screenshots/05-actions.png) | ![Switcher](screenshots/06-repo-switcher.png) |

| ⚙ 设置(Token / 自动刷新 / 字号) |
|---|
| ![Settings](screenshots/07-settings.png) |

## 🚀 核心能力

- **双形态挂载**:已装 [dsh-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar) → 注册为侧边栏页签;独立安装 → 自动降级为**对话区右侧可展开/收起的自绘面板**(同一套组件,运行时自动协商)
- **Code**:目录树一次拉取(`git/trees?recursive=1`)+ 文本文件行号预览(<900KB);二进制/超大文件降级为 GitHub 外链;<600px 时树自动收进「目录」抽屉
- **Issues / PR 全量列表**:Search API(`is:issue` / `is:pr`)不被 PR 占坑;默认按最新创建排序,可切最近更新;页签角标与工具条显示真实总数;底部「加载更多」翻页;PR 拆成开放 / 已关闭(未合并) / 已合并
- **写操作全家桶**:新建 Issue / 新建 PR(head·base 可选)/ 评论 / 编辑标题正文 / 编辑删除评论 / 关闭重开 —— 关闭与删评有确认门
- **合并三法强确认**:merge / squash / rebase 下拉选择,执行前弹窗展示方法与目标分支
- **CI 控制**:runs 列表实时状态图标,行悬停 ⟳ 重跑、✕ 取消(取消需确认),点击直达原 run 页
- **仓库切换器**:打开即列出 Token 可见全部仓库(owner/协作/组织,滤 archived,按推送排序)+ 输入实时过滤 + **公开仓库搜索**(≥3 字符去抖触发,⭐ 排序)+ 最近使用置顶 + 首次打开自动识别当前工作区 `.git/config`;他人的仓可一键从列表移除(本地隐藏,管理页可恢复)
- **🔗 聊天链接接管**:在 ⚙ 开启「接管聊天中的 GitHub 链接」后,对话里出现的任何 `github.com` 链接点击即在工作台打开——自动切仓、自动落到对应 Issues/PR 详情;每个链接独立实例互不干扰(需 better-sidebar v0.13+,开关位于本插件侧边卡片齿轮内)
- **🛰 活动哨兵(自动跟随)**:工作台每 10s 轻量轮询当前仓库的新 Issue / PR / CI 活动,发现即自动切换到对应页签并打开详情——agent 用 gh CLI 或任何方式产生的变更都能被捕获;⚙ 内可关闭;面板不可见时暂停
- **↗ 浏览器直达**:顶部工具栏一键在系统浏览器打开当前仓库
- **原生观感**:全站唯一 16px octicon 风格 SVG 图标集;颜色全部消费宿主 `--dsw-*` 设计令牌,深浅主题与皮肤自动跟随;字号默认跟随 DSH 侧边栏(12px),⚙ 内可调 13/14

## 🔑 Token 与隐私

⚙ 设置里填 Personal Access Token(**仅存浏览器 localStorage / 宿主 pluginSettings**,不经过任何服务端、不进会话上下文):

| Token 类型 | 权限 |
|---|---|
| 细粒度(推荐) | Contents **R** · Issues **RW** · Pull requests **RW** · Actions **RW** |
| 经典 | `repo`(需要改 workflow 文件时另加 `workflow`) |

无 Token 可浏览公开仓(匿名 60 次/h,不可写);页脚实时显示 core 限额剩余。

## 📦 安装

```bash
# 方式〇:npm 安装(推荐)
npm i -g dsh-github-workbench   # 或 pnpm add -g
dsh plugin --profile web add dsh-github-workbench

# 方式一:从 GitHub 直接装(dsh CLI,免 npm)
dsh plugin --profile web add github:meyaomiao/dsh-github-workbench

# 方式二:克隆后本地挂载
git clone https://github.com/meyaomiao/dsh-github-workbench.git
cd dsh-github-workbench && pnpm install && pnpm build
dsh plugin --profile web add .

# 然后在 ~/.dsh/profiles/web/cordis.patch.yml 启用:
#   - insert:
#       - id: github-workbench
#         name: 'dsh-github-workbench'
# 重启 dsh web + 浏览器硬刷新
```

也可在 [dshmarket](https://www.npmjs.com/package/dshmarket) 或 better-sidebar「添加插件」中搜索 `dsh-github-workbench`。

## 🧩 平台集成细节(给插件开发者)

- 消费 [`ctx.betterSidebar`](https://github.com/omdsh-dev/DSH-better-sidebar/blob/main/docs/external-plugin-guide.md):`inject=['betterSidebar']`(cordis 访问授权)+ `package.json dsh.client.inject` 声明 bundle 依赖 `dsh-better-sidebar`(loader 加载顺序)——**两层缺一不可**,否则服务访问被代理拒绝或模块被跳过(踩坑实录见源码注释)
- 根节点流式撑满 TabContent(不用 absolute inset:0,避免逃逸覆盖侧边栏框架)
- 容器查询三档自适应(<600 抽屉态 / ≥720 / ≥1000);`visible=false` 时暂停轮询省配额

## 🛠 开发

```bash
pnpm install
pnpm build        # esbuild 双入口:host(esm) + client(ModuleLoader 包装 cjs)
pnpm typecheck    # tsc --noEmit(strict)
pnpm test         # node:test 纯函数单测
```

设计文档与交互视觉稿:[docs/design.md](./docs/design.md) · [design/mockup.html](./design/mockup.html)

## License

[MIT](./LICENSE) © meyaomiao
