# GitHub 工作台 · 收件箱方案

> 状态:**已按本文落码**(工作台覆盖层列表 + 点行跳转 + 返回原仓页 + 未读角标;活动哨兵已删)。
> 宿主:现有 `packages/github-workbench`(侧栏 tab / 独立面板双形态)。
> 不改 DSH 源码,不新开 better-sidebar 页签。

---

## 0. 拍板(2026-09-04)

| 决策点 | 选择 |
|---|---|
| 监视范围 | Token 可见的**全部公开仓**(owner / collaborator / org member,`private=false`) |
| 点击一条 | **直接跳转**(三次拍板,取代箱内抽屉)。点行 = 关箱 + 切到该仓 Issues 详情。进箱前的仓页快照一直挂着,直到点「← 返回原仓页」 |
| 与自动跟随 | **关掉跟随,用收件箱替换**(二次拍板)。删除活动哨兵与设置项;工作台不再因任何新活动自动 `switchTab` / `applyRepo`。切仓只走人点收件箱那一行 |

不做:评论、PR、CI、关闭/重开、label 变更进箱;GitHub webhook / 服务端推送;iframe 嵌 github.com。
自动跟随也不再监视 PR / CI——那些活动继续只出现在各自页签,人要点才进去。本版不把 PR/CI 扩进收件箱。

---

## 1. 要解决的问题

公开仓有人**新建 Issue** 时,人还在看别的仓 / Code / PR,需要:

1. 收件箱列表多一条(跨仓聚合,按创建时间倒序);
2. 工作台**外面**能看出有未读(侧栏 tab 角标 + 头部按钮红点/数字 + 独立形态收起竖条);
3. 点开收件箱看列表,点一条就进该仓干活,看完能**回到进箱前的仓库页面**(仓 + 子页签 + 当时打开的详情编号)。

现有「活动哨兵」做不到这件事,而且会抢页签、时灵时不灵,见 §2——**本版直接删除,由收件箱接过「有新东西」这条路径**。

---

## 2. 关掉跟随:用收件箱的切换替换

实现现状:`src/workbench.tsx` 活动哨兵 + `api.listIssuesSince` / `listPullsSince` / `listRuns` + 设置「自动跟随仓库活动」。

### 2.1 它从来不会切仓库,跨仓新 Issue 看不见

哨兵只对**当前 `ref`** 发请求,命中后只 `switchTab` + `setDeep`。没有 `applyRepo`。
用户体感「跟随切仓库」是误读。跨仓新 Issue 正是收件箱要补的洞;跟随补不上,也不该再抢当前仓的页签。

### 2.2 为什么「不是一直生效」(按代码,删掉的理由)

| # | 机制 | 后果 |
|---|---|---|
| 1 | `if (!visible \|\| !ref \|\| !autoFollow) return` | 侧栏切走 / 面板折叠 → 轮询停掉,事件窗口滑走 |
| 2 | 清理只设 `dead=true`,interval 靠 1s 探活清 | 定时器漏停,新旧 tick 交错 |
| 3 | `baselinedRef` / `lastSinceRef` / `seenRef` **换仓不重置** | 误抢页签或漏事件 |
| 4 | `listIssuesSince` 的 `since=` = **updated_at** | 评论/关单也当新活动 |
| 5 | toast 只在面板内 | 看不见工作台时等于没通知 |

修这些不如删:收件箱已经有未读角标 + 点行切仓 + 「返回原仓页」。再留一套自动 `switchTab` 等于系统替你点行。

### 2.3 落码时删除(同一 PR,独立 diff 也行)

从 `workbench.tsx` 删掉整段活动哨兵 effect、`autoFollow` state、设置复选框、`cleanupFns` / `__gwSelfMark` 里只服务跟随的部分。
从 `config.ts` 删除 `gw.autoFollow`(读到残留 key 忽略即可,不必迁移)。
从 `api.ts` 删除 `listIssuesSince` / `listPullsSince`(若无其它调用)。
`createIssue` 的 self-mark 改挂收件箱 store(`owner/repo#n`),不再写 `window.__gwSelfMark`。

**PR / Actions 页签自己的「自动刷新周期」保留**(那是列表静默 refetch,不切页签、不切仓)。

切仓的唯一入口变成收件箱**点行**:`applyRepo` + `switchTab('issues')` + `setDeep`。用户没点那一行,工作台原地不动。

---

## 3. 形态:工作台内覆盖层,不是第五个子页签,也不是新侧栏 tab

收件箱只有**一层**:列表。点行关掉这层,落到工作台自己的 Issues 详情(现成 `IssueDrawer`,不再箱内叠第二层)。

```
进箱前 A·Code                      点 🖂 只有列表
┌─────────────────────────┐        ┌─────────────────────────┐
│ 🐙 A/repo  main  🖂3 ⚙  │        │ 🐙 A/repo  main  🖂3 ⚙  │
│ Code │ Issues │ PR │ CI │        │ ← 返回原仓页  收件箱     │
│ src/api.ts              │        │ ● B/repo #12 登录失败    │
└─────────────────────────┘        │   A/repo #3  文案错字    │
                                   └─────────────────────────┘
点 B#12 之后(箱关了,工作台切到 B)   点「← 返回原仓页」
┌─────────────────────────┐        ┌─────────────────────────┐
│ 🐙 B/repo  main  🖂  ⚙  │        │ 🐙 A/repo  main  🖂  ⚙  │
│ ← 返回原仓页 A/repo     │ ←条还在 │ Code │ Issues │ PR │ CI │
│ Code │ Issues │ PR │ CI │        │ src/api.ts              │
│ #12 登录失败            │        └─────────────────────────┘
│ (工作台 Issues 详情)    │
└─────────────────────────┘
```

- 覆盖 `.gw-body`(+ 子页签条),**不盖头部**。
- 点行后覆盖层关掉,头部仓库名变成目标仓;「← 返回原仓页」改挂在头部下方一条细栏(或头部按钮旁),直到点掉或用户用仓库切换器主动离箱。
- 独立形态:同一套覆盖层;面板收起时头部按钮不可见,改走右缘竖条未读(§6.3)。

进箱 / 出箱是 `inboxOpen` 布尔,不是第五个 `Subtab`(避免和 `cfg.saveSubtab` 抢持久化)。

**为什么不用箱内抽屉**(已否决):侧栏窄,列表之上再叠预览再点「在工作台打开」= 三层。点行就是来干活的,预览层是多余的。工作台 Issues 详情已经能读正文/评论/关闭,不必做第二份。

---

## 4. 数据层

### 4.1 监视集

```
watchSet = getMyRepos()          // 已有,5 min 缓存,affiliation=owner,collaborator,organization_member
            .filter(r => !r.isPrivate && !hidden)
```

- **必须有 Token**。无 Token:头部按钮可点,空态文案「填 PAT 后监视你有权限的公开仓」;轮询不启动(匿名 60/h 会被这功能打爆)。
- 私有仓不进监视(拍板:公开仓)。
- `getMyRepos` 当前 `per_page=100` 且**不跟分页**。落码时改成跟 `Link: rel=next`,硬顶 **300** 仓(3 页),超出在收件箱页脚提示「仅监视最近推送的 300 个公开仓」。
- 隐藏名单(`gw.hiddenRepos`)生效,与仓库弹层一致。
- 当前正在看的仓若是公开仓,一定在集合里(它本就在 `/user/repos` 或用户刚搜到);若当前仓是**别人的公开仓且 token 看不到**(`getMyRepos` 无此条),仍并入 watchSet(用户正在看 = 明确关心)。

### 4.2 拉新:Search,只收「创建」,不收「更新」

GitHub 没有浏览器可用的 Issue WebSocket。所谓实时 = **可见时 15s / 不可见时 45s** 的 Search 轮询(跨仓、走独立 search 配额;不再另跑 10s 跟随)。

查询(一次,或按 50 仓一批拆成 `OR` 组;Search `q` 长度约 256 字符要切批):

```
is:issue is:public is:open created:>={watermark}
(repo:o1/r1 OR repo:o2/r2 OR …)     // 批
-author:{viewer}                    // 可选,viewer 取得到才加
```

- `watermark` 初始 = `now - 7d`(首屏回放一周内未读;超过一周且已读的不进箱)。
- 命中后用 `created_at` 不是 `updated_at` 判断新旧。
- 去重 key:`owner/repo#number`(稳定,不掺 updated_at)。
- 本 UI 刚 `POST /issues` 的编号走现有 `__gwSelfMark`,进箱但**默认已读、不弹 toast、不加未读数**(避免自己提单吓自己)。
- Search 限额:已登录约 30 次/分钟。15s 一轮 + 切批最多 6 次/轮 → 正常 < 24 次/分。超额:拉长到 60s,页脚提示,不打 core 配额(现有 `ghRequest` 已把 search 的 remaining 与页脚 core 分开)。

备选(实现时**不要**当主路径,只写进注释):`GET /notifications?all=false` 是订阅/参与的讨论,含 PR 评论,语义不是「公开仓有人提单」,和拍板不符。

### 4.3 本地状态(localStorage,跟 token/repo 同一套)

| key | 形状 | 说明 |
|---|---|---|
| `gw.inbox.items` | `InboxItem[]` 最多 100 | 热列表,刷新不丢未读 |
| `gw.inbox.read` | `string[]` key 最多 500 | 已读集合 |
| `gw.inbox.watermark` | ISO 时间 | 下次 `created:>=` |

```ts
interface InboxItem {
  key: string;            // owner/repo#n
  owner: string;
  repo: string;
  number: number;
  title: string;
  htmlUrl: string;
  user: string;
  createdAt: string;
  unread: boolean;
}
```

模块级 store(不止 React state):轮询在 **Workbench 未挂载 / `visible=false` 时也要跑**,否则侧栏切走就收不到——这是哨兵最大的坑。store 订阅者(头部按钮、badge、独立竖条)只读 `unreadCount`。

轮询生命周期:

- client `apply` / `mountWorkbench` 里启动,**不**绑 `visible`;
- 无 token 或 `document.hidden` 时降到 45s;可见且有 token 15s;
- HMR / 插件卸载走 `ctx.effect` disposer 停表。

### 4.4 推送(用户说的「实时通知」)

浏览器里能做的三层,全部要做:

1. **列表插入**(store);
2. **面板内 toast**「新 Issue · acme/web #12」(仅 `visible=true` 时,避免看不见的 toast);
3. **外面的未读样式**(§6),面板不可见时全靠这个。

不做 `Notification` 系统通知(权限弹窗 + 无用户明确要求)。

---

## 5. 交互

### 5.1 打开 / 点行 / 返回

进箱前拍快照。点行会切仓,所以快照会**一直挂到用户明确点返回**(或用头部仓库切换器主动离开)。再开收件箱不覆盖已有快照——连续处理几条未读时,返回目标仍是最初那页。

```ts
interface InboxReturnSnap {
  repoFull: string;
  branch: string;
  subtab: Subtab;
  detailNumber?: number;   // Issues/PR 当时打开的编号;没有则只回列表
}
```

路径:

```
A·Code ──开箱──► 收件箱列表 ──点 B#12──► B·Issues #12(箱关,snap 仍是 A)
              ◄──返回原仓页(列表也关)─────────────────────────┘
```

- 头部 🖂:`inboxOpen=false` → 若无 snap 则拍一张,开箱;`inboxOpen=true` → 关箱但**保留 snap**(人可能只是瞄一眼列表);若 snap 在且箱已关,再点 🖂 是重新打开列表,不是返回。
- 覆盖层顶栏「← 返回原仓页」与跳转后细栏同一条路径:恢复 snap、关箱、清 snap。
- 点行:标已读 → `inboxOpen=false` → `applyRepo(owner/repo)`(已是当前仓则跳过)→ `switchTab('issues')` → `setDeep({tab:'issues', number})`。**不**清 snap。目标仓若与 snap 相同(点的是当前仓自己的 Issue),跳转后细栏仍显示「返回原仓页」,点了回到进箱前的子页签(例如从 Issues #12 回到 Code)。
- 头部仓库切换器 `applyRepo`(人点的,不是点行触发的):视为主动离箱,关箱 **并清 snap**(避免返回把刚切的仓撤掉)。
- 连续点:B#12 上看完 → 再点 🖂 打开列表(snap 仍是 A)→ 再点 C#4 → 到 C,snap 仍是 A → 最终返回 A·Code。

跳转后细栏文案:`← 返回 A/repo`(带进箱前的 full name),不要只写「返回」。

### 5.2 列表(没有箱内预览)

- 行:未读圆点、`owner/repo`、`#n`、标题、作者、`timeAgo(created_at)`。
- 点行即跳转(§5.1),不再叠抽屉,没有「在工作台打开」按钮。
- 「全部已读」清未读数,人仍留在列表。
- 空态:无 token / 无公开仓 / 七日内无新单,三句分开。
- 想扫下一条未读:再点 🖂 进列表(一层,不是从详情再返回列表再点)。这是用层数换「点行即干活」。

### 5.3 自己提单

工作台 `createIssue` 成功后 `__gwSelfMark('issues:n')` 不够跨仓。改为 `__gwSelfMark('owner/repo#n')`。store 插入时命中则 `unread=false`。

---

## 6. 外面如何看出有未读

badge 回调必须廉价(每次 tab 栏渲染都跑,抛错被宿主吞掉)。

### 6.1 工作台头部按钮(面板已打开时)

现有 `gw-hbtn` 旁加 inbox 按钮:

- 未读 = 0:普通图标,title「收件箱」;
- 未读 > 0:`gw-dot.bad` 叠在图标右上 + 数字(99+);按钮用 accent/danger 令牌,禁止硬编码色。

### 6.2 better-sidebar 页签角标(面板在、但工作台不是当前 tab)

`registerTab` 已有宿主能力 `badge`(v0.12+)。本地 `TabDescriptorLike` 补上 `badge?: (...) => string | number | null`。

```ts
badge: () => {
  const n = inboxUnread(); // store 同步读,禁止在回调里 fetch
  return n > 0 ? n : null;
}
```

宿主 tab 栏**不会**因 store 更新自动重绘。需要在 unread 变化时请宿主刷新:

- 优先:`features.includes('updateTab')` 则 `updateTab(tabId, { title })` 用「GitHub 工作台」原标题(无副作用,只为 notify);
- 否则:标题函数 `() => unread ? `GitHub 工作台 (${n})` : 'GitHub 工作台'`,并同样 `updateTab` 碰一下;
- 再否则(极老宿主):只靠头部按钮,文档注明。

`types.ts` 的 `SidebarRegistry` 补可选 `features?: readonly string[]`、`updateTab?`。没有就降级,禁止 `ctx.get` 未声明。

独立形态没有侧栏 tab,走 §6.3。

### 6.3 独立形态收起竖条

`mount.ts` 的 `edge` 按钮现文案「🐙 工作台」。订阅 store:未读 > 0 时改为「🐙 工作台 · N」并加 `data-gw-inbox-unread="N"`(CSS 用令牌画红点)。展开后头部按钮接手。

---

## 7. 文件与改动面(最小完整)

| 文件 | 做什么 |
|---|---|
| `src/inbox-store.ts` | **新建**。watermark、items、read、poll、subscribe、unreadCount。纯 TS,可单测 |
| `src/inbox-view.tsx` | **新建**。覆盖层**只有列表**(无抽屉) |
| `src/api.ts` | `searchIssuesCreatedSince(repos, iso)`(切批 OR);`getMyRepos` 跟分页顶 300;过滤 `!private` 的导出或 inbox 侧滤 |
| `src/issues-view.tsx` | 不强制导出 Drawer;点行走现成 Issues 详情 |
| `src/workbench.tsx` | 头部按钮、覆盖层、snap 细栏、点行切仓;**删除活动哨兵与 autoFollow 设置** |
| `src/styles.ts` | 按钮红点、覆盖层顶栏、未读圆点。全 `--dsw-*` |
| `src/icons.ts` | 增加 `inbox`(octicon inbox path) |
| `src/config.ts` | 读写 `gw.inbox.*`(或全放 store) |
| `src/mount.ts` | 启动/停止 poll;descriptor.badge;独立竖条订阅 |
| `src/types.ts` | badge / updateTab / features 可选字段 |
| `src/client.ts` | 不动 inject(`betterSidebar` 已声明) |
| `src/index.ts` | 不动(纯客户端) |
| `test/inbox-store.test.ts` | **新建**。去重、已读、self-mark、watermark、切批 q |
| `docs/design.md` | §7 加一句指针到本文 |
| `README.md` | 功能清单加收件箱一行 |

构建门禁照旧:`pnpm --filter @dsh-abilities/github-workbench build` 后再重启 `dsh web`。`pnpm gate`。

---

## 8. 职责对照(跟随已删除)

| | 收件箱 | 已删除的自动跟随 | PR/Actions 自动刷新(保留) |
|---|---|---|---|
| 对象 | 监视集里公开仓的**新建** Issue | 当前仓 Issue/PR/CI | 当前仓 PR 列表 / Actions runs |
| 切仓 | 点行 | 从不切仓,只抢页签 | 否 |
| 切页签 | 点行 → Issues 详情 | 会 `switchTab` | 否,只 refetch |
| 不可见时 | 慢轮询,只更新角标 | 停 | 停(`visible` 门控) |

设置弹层不再出现「自动跟随」复选框。新 Issue 的发现、提示、切仓全部走人点收件箱那一行。

---

## 9. 验收

1. 配 PAT。监视集含两个公开仓 A(当前)与 B(列表里但没在看)。
2. 浏览器另开 B 提一张 Issue(不要用工作台自己的新建)。
3. ≤15s:头部按钮出现数字;若工作台不是当前侧栏 tab,tab 上出现角标;独立收起态竖条出现 N。
4. 点按钮进入收件箱,当前仓仍显示 A,列表有 B 的那条。覆盖层里没有第二层抽屉。
5. 点行:箱关,头部变成 B,Issues 打开 #n;细栏「← 返回 A/repo」还在。
6. 点细栏:回到 A 的进箱前子页签(若进箱前在 Code,仍在 Code),细栏消失。
7. 在 B 上看完再点 🖂:列表再打开,snap 仍是 A;再点另一条仍返回 A,不会变成返回 B。
8. 工作台在 A 新建 Issue:进箱但未读不增加、不 toast。
9. 设置里没有「自动跟随」。在 B 提 Issue 或在 A 开 PR / 跑 CI,**都不会**自动抢页签;只有点收件箱那一行才会切到 B 的 Issues 详情。
10. 拔掉 token:轮询停、空态提示、角标清零。
11. 深浅色无硬编码色;HMR 禁用/启用无 already registered、无双份轮询。

---

## 10. 明确不做(本版)

- 私有仓、Fork 进来的噪音仓库(已归档的 `getMyRepos` 已滤);
- Issue 评论 / 被 @ / Review 请求(那是 GitHub Notifications,语义另一套);
- 系统桌面通知、声音;
- 服务端反代 webhook;
- 把收件箱做成 better-sidebar 第二个 tab;
- 保留或修补自动跟随(整段删除,不留开关);
- 本版把 PR / CI 扩进收件箱(若以后要「PR 也进箱」,另开方案,不混进这一版)。

后续若要「真正实时」,唯一干净的路是 host 半收 GitHub webhook 再推 client;本版不碰 host 路由,避免 `inject` 再漏 `webServer`。
