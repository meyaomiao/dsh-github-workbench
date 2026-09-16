/**
 * GitHub Workbench i18n locale dictionaries (zh / en).
 * Keys follow the DSH i18n convention: zh is the key source, en mirrors 1:1.
 */

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
  // Workbench title
  'workbench.title': 'GitHub 工作台',
  'workbench.titleWithCount': 'GitHub 工作台 ({count})',

  // Time formatting
  'time.justNow': '刚刚',
  'time.minutesAgo': '{n} 分钟前',
  'time.hoursAgo': '{n} 小时前',
  'time.daysAgo': '{n} 天前',
  'time.monthsAgo': '{n} 个月前',

  // API errors
  'error.tokenInvalid': 'Token 无效或已过期(HTTP 401)。请在 ⚙ 设置里检查 Personal Access Token。',
  'error.rateLimitSearch': 'GitHub Search API 限流(HTTP 403):已登录约 30 次/分钟。稍后再点「加载更多」,或改用 PAT。',
  'error.rateLimitApi': 'GitHub API 限流(HTTP 403):匿名额度仅 60 次/小时。在 ⚙ 设置填入 PAT 即提升到 5000 次/小时。',
  'error.forbidden': '权限不足(HTTP 403){detail}。写操作需要对应 RW 权限的 Token。',
  'error.notFound': '资源不存在(HTTP 404):确认 owner/repo、分支或编号正确;私有仓需 Token 具备读取权限。 {upstream}',
  'error.rejected': '请求被 GitHub 拒绝(HTTP 422):{detail}',
  'error.apiError': 'GitHub API 错误(HTTP {status}){detail}',

  // Loading & empty states
  'loading': '加载中…',
  'loadingTree': '拉取目录树…',
  'loadingFile': '读取文件…',
  'loadingComments': '加载中…',
  'loadMore': '加载更多',
  'loadMoreComments': '加载更多评论',
  'retry': '重试',
  'empty.repo': '空仓库 / 空分支',
  'empty.selectFile': '从左侧选择文件预览\n二进制 / 超大文件会给出下载与 GitHub 外链',
  'empty.noWorkflowRuns': '这个仓库还没有 workflow 运行记录。',
  'empty.inboxNoPAT': '填 PAT 后监视你有权限的公开仓。',
  'empty.inboxNoIssues': '最近七天没有公开仓的新 Issue。',
  'empty.inboxNoPRs': '最近七天没有公开仓的新 Pull request。',
  'empty.inboxNoActions': '监视仓里最近没有新的 workflow 运行。',
  'empty.noOpenIssues': '没有打开的 Issue。\n用上方按钮创建第一个。',
  'empty.noClosedIssues': '没有已关闭的 Issue。',
  'search.limit': 'Search 最多展示 1000 条，其余请上 GitHub 网页',
  'file.truncated': '超过 3000 行,已截断 —— 完整内容请到 GitHub 查看。',
  'file.tooBig': '文件超过 900KB,不在侧边栏内联渲染。',
  'file.binary': '二进制文件,无法文本预览。',
  'file.openOnGitHub': '在 GitHub 打开 ↗',

  // Directory tree
  'tree.close': '关闭目录',
  'tree.open': '目录',
  'tree.collapse': '收起',
  'tree.truncated': '目录过大被 GitHub 截断,仅显示部分条目。',
  'tree.closeFile': '关闭',

  // Tabs
  'tab.code': 'Code',
  'tab.issues': 'Issues',
  'tab.prs': 'Pull requests',
  'tab.actions': 'Actions',

  // Actions view
  'actions.recent': '最近 20 次{active}',
  'actions.active': ' · {count} 个进行中',
  'actions.refresh': '刷新',
  'actions.rerun': '重跑',
  'actions.cancel': '取消',
  'actions.rerunSuccess': '已触发重跑:{title}',
  'actions.cancelConfirm': '取消运行 #{id}?',
  'actions.cancelText': '取消运行',
  'actions.cancelSuccess': '已发送取消请求',
  'actions.duration': ' · 用时 {duration}',
  'actions.queued': '排队中',
  'actions.running': '运行中',
  'actions.openRun': '点击在新窗口打开此次运行',
  'actions.openOriginal': '原页',

  // Issues view
  'issues.sortCreated': '最新创建',
  'issues.sortUpdated': '最近更新',
  'issues.filterOpen': '开放',
  'issues.filterClosed': '已关闭',
  'issues.new': '新建 Issue',
  'issues.newTitle': '新建 Issue',
  'issues.titlePlaceholder': '标题(必填)',
  'issues.bodyPlaceholder': '正文(Markdown)',
  'issues.create': '创建',
  'issues.creating': '创建中…',
  'issues.created': 'Issue #{number} 已创建',
  'issues.closeConfirm': '关闭 Issue #{number}?',
  'issues.closeText': '关闭',
  'issues.closed': 'Issue #{number} 已关闭',
  'issues.reopened': 'Issue #{number} 已重新打开',
  'issues.saveSuccess': '已保存',
  'issues.saveEdit': '保存修改',
  'issues.edit': '编辑',
  'issues.open': '开放',
  'issues.closedLabel': '已关闭',
  'issues.noBody': '(无正文)',
  'issues.closeIssue': '关闭 Issue',
  'issues.reopenIssue': '重新打开',
  'issues.backToList': '返回列表',
  'issues.updated': '更新',
  'issues.createdAt': '创建于',

  // Comments
  'comments.count': '—— 评论 {count}{extra} ——',
  'comments.deleteConfirm': '删除这条评论?',
  'comments.deleteText': '删除',
  'comments.deleted': '评论已删除',
  'comments.updated': '评论已更新',
  'comments.save': '保存',
  'comments.cancel': '取消',
  'comments.editTitle': '编辑评论',
  'comments.deleteTitle': '删除评论',
  'comments.writePlaceholder': '写下评论…(Markdown)',
  'comments.posted': '评论已发表',

  // Inbox
  'inbox.title': '收件箱',
  'inbox.unread': ' · {count} 未读',
  'inbox.markAllRead': '本页已读',
  'inbox.backToRepo': '返回原仓页',
  'inbox.backTo': '返回 {label}',
  'inbox.descIssuesPRs': 'Issues / PR 仅监视最近推送的最多 300 个公开仓。',
  'inbox.descActions': 'Actions 只监视当前仓和最近使用的公开仓(最多 5 个)。',

  // File info
  'file.openNewTab': '在新 Tab 中打开',

  // Confirm dialog
  'confirm.yes': '确认',
  'confirm.no': '取消',

  // Mount
  'mount.standaloneTitle': 'GitHub 工作台',
  'mount.settingsToken': '接管聊天中的 GitHub 链接到工作台',
  'mount.settingsHttps': '接管 https:// 链接',
  'mount.settingsAutoRefresh': '自动刷新周期(秒)',
} satisfies Record<string, string>

/** The namespace key union. */
export type WorkbenchKey = keyof typeof zh

/** Active locale: 'en' | 'zh'. Auto-detected from browser, overridable. */
let activeLocale: 'en' | 'zh' = detectLocale()

function detectLocale(): 'en' | 'zh' {
  try {
    const lang = navigator.language || (navigator as { userLanguage?: string }).userLanguage || ''
    return lang.startsWith('zh') ? 'zh' : 'en'
  } catch {
    return 'en'
  }
}

/** Set the active locale at runtime. */
export function setLocale(locale: 'en' | 'zh'): void {
  activeLocale = locale
}

/** Get the current active locale. */
export function getLocale(): 'en' | 'zh' {
  return activeLocale
}

/** English dictionary, checked complete against the zh key set. */
export const en: Record<WorkbenchKey, string> = {
  // Workbench title
  'workbench.title': 'GitHub Workbench',
  'workbench.titleWithCount': 'GitHub Workbench ({count})',

  // Time formatting
  'time.justNow': 'just now',
  'time.minutesAgo': '{n} min ago',
  'time.hoursAgo': '{n} h ago',
  'time.daysAgo': '{n} d ago',
  'time.monthsAgo': '{n} mo ago',

  // API errors
  'error.tokenInvalid': 'Token is invalid or expired (HTTP 401). Check your Personal Access Token in Settings.',
  'error.rateLimitSearch': 'GitHub Search API rate limited (HTTP 403): ~30 requests/min when logged in. Wait and try "Load more" again, or use a PAT.',
  'error.rateLimitApi': 'GitHub API rate limited (HTTP 403): anonymous quota is 60 requests/hour. Enter a PAT in Settings to raise it to 5,000/hour.',
  'error.forbidden': 'Insufficient permissions (HTTP 403){detail}. Write operations require a Token with corresponding RW permissions.',
  'error.notFound': 'Resource not found (HTTP 404): verify owner/repo, branch, or number; private repos require a Token with read access. {upstream}',
  'error.rejected': 'Request rejected by GitHub (HTTP 422):{detail}',
  'error.apiError': 'GitHub API error (HTTP {status}){detail}',

  // Loading & empty states
  'loading': 'Loading…',
  'loadingTree': 'Loading directory tree…',
  'loadingFile': 'Reading file…',
  'loadingComments': 'Loading…',
  'loadMore': 'Load more',
  'loadMoreComments': 'Load more comments',
  'retry': 'Retry',
  'empty.repo': 'Empty repo / empty branch',
  'empty.selectFile': 'Select a file from the tree to preview\nBinary / oversized files show a download link',
  'empty.noWorkflowRuns': 'No workflow runs for this repository yet.',
  'empty.inboxNoPAT': 'Enter a PAT to monitor public repos you have access to.',
  'empty.inboxNoIssues': 'No new Issues from public repos in the last seven days.',
  'empty.inboxNoPRs': 'No new Pull requests from public repos in the last seven days.',
  'empty.inboxNoActions': 'No new workflow runs in monitored repos.',
  'empty.noOpenIssues': 'No open Issues.\nUse the button above to create one.',
  'empty.noClosedIssues': 'No closed Issues.',
  'search.limit': 'Search shows at most 1,000 results — see GitHub for the rest',
  'file.truncated': 'Over 3,000 lines — truncated. See the full file on GitHub.',
  'file.tooBig': 'File exceeds 900 KB — not rendered inline in the sidebar.',
  'file.binary': 'Binary file — text preview unavailable.',
  'file.openOnGitHub': 'Open on GitHub ↗',

  // Directory tree
  'tree.close': 'Close tree',
  'tree.open': 'Tree',
  'tree.collapse': 'Collapse',
  'tree.truncated': 'Directory tree truncated by GitHub — showing partial entries.',
  'tree.closeFile': 'Close',

  // Tabs
  'tab.code': 'Code',
  'tab.issues': 'Issues',
  'tab.prs': 'Pull requests',
  'tab.actions': 'Actions',

  // Actions view
  'actions.recent': 'Last 20 runs{active}',
  'actions.active': ' · {count} in progress',
  'actions.refresh': 'Refresh',
  'actions.rerun': 'Rerun',
  'actions.cancel': 'Cancel',
  'actions.rerunSuccess': 'Rerun triggered: {title}',
  'actions.cancelConfirm': 'Cancel run #{id}?',
  'actions.cancelText': 'Cancel run',
  'actions.cancelSuccess': 'Cancel request sent',
  'actions.duration': ' · {duration}',
  'actions.queued': 'queued',
  'actions.running': 'running',
  'actions.openRun': 'Click to open this run in a new window',
  'actions.openOriginal': 'Original',

  // Issues view
  'issues.sortCreated': 'Newest',
  'issues.sortUpdated': 'Recently updated',
  'issues.filterOpen': 'Open',
  'issues.filterClosed': 'Closed',
  'issues.new': 'New Issue',
  'issues.newTitle': 'New Issue',
  'issues.titlePlaceholder': 'Title (required)',
  'issues.bodyPlaceholder': 'Description (Markdown)',
  'issues.create': 'Create',
  'issues.creating': 'Creating…',
  'issues.created': 'Issue #{number} created',
  'issues.closeConfirm': 'Close Issue #{number}?',
  'issues.closeText': 'Close',
  'issues.closed': 'Issue #{number} closed',
  'issues.reopened': 'Issue #{number} reopened',
  'issues.saveSuccess': 'Saved',
  'issues.saveEdit': 'Save changes',
  'issues.edit': 'Edit',
  'issues.open': 'Open',
  'issues.closedLabel': 'Closed',
  'issues.noBody': '(no body)',
  'issues.closeIssue': 'Close Issue',
  'issues.reopenIssue': 'Reopen',
  'issues.backToList': 'Back to list',
  'issues.updated': 'Updated',
  'issues.createdAt': 'opened',

  // Comments
  'comments.count': '—— Comments {count}{extra} ——',
  'comments.deleteConfirm': 'Delete this comment?',
  'comments.deleteText': 'Delete',
  'comments.deleted': 'Comment deleted',
  'comments.updated': 'Comment updated',
  'comments.save': 'Save',
  'comments.cancel': 'Cancel',
  'comments.editTitle': 'Edit comment',
  'comments.deleteTitle': 'Delete comment',
  'comments.writePlaceholder': 'Write a comment… (Markdown)',
  'comments.posted': 'Comment posted',

  // Inbox
  'inbox.title': 'Inbox',
  'inbox.unread': ' · {count} unread',
  'inbox.markAllRead': 'Mark all read',
  'inbox.backToRepo': 'Back to repo',
  'inbox.backTo': 'Back to {label}',
  'inbox.descIssuesPRs': 'Issues / PR monitors up to 300 recently-pushed public repos.',
  'inbox.descActions': 'Actions monitors only the current repo and up to 5 recently-used public repos.',

  // File info
  'file.openNewTab': 'Open in New Tab',

  // Confirm dialog
  'confirm.yes': 'Confirm',
  'confirm.no': 'Cancel',

  // Mount
  'mount.standaloneTitle': 'GitHub Workbench',
  'mount.settingsToken': 'Intercept GitHub links from chat into the workbench',
  'mount.settingsHttps': 'Intercept https:// links',
  'mount.settingsAutoRefresh': 'Auto-refresh interval (seconds)',
} satisfies Record<WorkbenchKey, string>

const dictionaries = { zh, en } as const

/**
 * Translate a key with optional interpolation.
 * Usage: t('time.minutesAgo', { n: 5 })
 */
export function t(key: WorkbenchKey, params?: Record<string, string | number>): string {
  const dict = dictionaries[activeLocale]
  let text = dict[key] ?? en[key] ?? key
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v))
    }
  }
  return text
}
