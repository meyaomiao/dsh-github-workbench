/**
 * 全站样式:唯一颜色来源是宿主 --dsw-* 设计令牌(零硬编码色,自动跟随深浅主题);
 * 类名统一 gw-* 前缀隔离;构建为 TS 字符串模块由 ensureStyles() 注入一次
 * (与 better-sidebar 自身注入预设 CSS 的方式同源,规避 esbuild 的 CSS Modules 插件链)。
 *
 * 挂载填充契约:根节点 .gw-root 用常规流式(width/height 100% + relative),
 * **绝不用 absolute inset 0**——宿主 TabContent 不一定是定位元素,绝对定位会
 * 逃逸到 [data-dsh-panel-host] 固定层盖住整个侧边栏框架(实测事故),同时让
 * 容器查询误读视口宽度导致自适应失效。独立面板形态同样以流式撑满壳内。
 */

export const GW_CSS = `
.gw-root{position:relative;width:100%;height:100%;min-height:0;display:flex;flex-direction:column;min-width:280px;
  background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);
  font-size:var(--gw-body-size, 12px);line-height:1.5;
  container-type:inline-size}
.gw-root *,.gw-root *::before,.gw-root *::after{box-sizing:border-box}
.gw-icon{display:block;flex:none}

/* ---------- 头部 ---------- */
.gw-header{display:flex;align-items:center;gap:8px;padding:9px 12px;border-bottom:1px solid var(--dsw-alias-border-l2);position:relative}
.gw-repo-btn{appearance:none;background:none;border:none;color:inherit;font:inherit;font-weight:600;
  display:flex;align-items:center;gap:5px;cursor:pointer;padding:3px 6px;border-radius:6px;min-width:0}
.gw-repo-btn:hover{background:var(--dsw-alias-interactive-bg-hover)}
.gw-repo-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px}
.gw-chip{font-size:10px;padding:1px 7px;border-radius:999px;border:1px solid var(--dsw-alias-border-l1);
  color:var(--dsw-alias-label-secondary);flex:none;display:inline-flex;align-items:center;gap:4px}
.gw-select{margin-left:auto;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);
  border:1px solid var(--dsw-alias-border-l1);border-radius:6px;padding:2px 20px 2px 7px;
  font-size:11px;max-width:150px;appearance:none;-webkit-appearance:none;outline:none;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path fill='%23888f9c' d='M12.78 5.22a.749.749 0 00-1.06 0L8 9.44 4.28 5.72a.749.749 0 10-1.06 1.06l4.25 4.25c.146.147.338.22.53.22s.384-.072.53-.22l4.25-4.25a.749.749 0 000-1.06z'/></svg>");
  background-repeat:no-repeat;background-position:right 5px center;background-size:10px}
.gw-hbtn{width:26px;height:26px;border:none;background:none;color:var(--dsw-alias-label-secondary);
  border-radius:6px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex:none;padding:0}
.gw-hbtn:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.gw-dot{width:8px;height:8px;border-radius:50%;flex:none;background:var(--dsw-alias-label-tertiary)}
.gw-dot.ok{background:var(--dsw-alias-state-success-primary)}
.gw-dot.bad{background:var(--dsw-alias-state-danger-primary)}

/* ---------- 弹层(仓库切换 / 设置)---------- */
.gw-pop{position:absolute;top:calc(100% + 4px);z-index:40;width:min(320px,calc(100vw - 24px));
  background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);border-radius:10px;
  box-shadow:0 10px 32px rgba(0,0,0,.35);padding:8px}
.gw-pop.left{left:10px}.gw-pop.right{right:10px}
.gw-pop-title{font-size:10px;color:var(--dsw-alias-label-tertiary);padding:2px 6px 6px}
.gw-pop-item{display:flex;align-items:center;gap:8px;width:100%;text-align:left;appearance:none;background:none;
  border:none;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;padding:6px;border-radius:6px;
  cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.gw-pop-item:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.gw-pop-item.cur{color:var(--dsw-alias-label-primary)}
.gw-pop-item.cur .gw-dot{background:var(--dsw-alias-state-success-primary)}
.gw-pop-cur{margin-left:auto;font-size:9px;color:var(--dsw-alias-accent-primary);
  border:1px solid var(--dsw-alias-accent-primary);padding:0 5px;border-radius:999px;flex:none}
.gw-x{display:none;margin-left:6px;flex:none;cursor:pointer;color:var(--dsw-alias-label-tertiary);
  border:1px solid var(--dsw-alias-border-l1);border-radius:5px;padding:2px;line-height:0}
.gw-x:hover{color:var(--dsw-alias-state-danger-primary);border-color:var(--dsw-alias-state-danger-primary)}
.gw-pop-item:hover .gw-x{display:inline-flex}
.gw-pop-divider{height:1px;background:var(--dsw-alias-border-l1);margin:6px 2px}
.gw-input{width:100%;min-width:0;background:var(--dsw-alias-bg-base,#111);border:1px solid var(--dsw-alias-border-l1);
  border-radius:6px;color:var(--dsw-alias-label-primary);padding:5px 8px;font-size:11px;outline:none;font-family:inherit}
.gw-input:focus{border-color:var(--dsw-alias-accent-primary)}
.gw-pop-hint{font-size:10px;color:var(--dsw-alias-label-tertiary);padding:6px 4px 2px;line-height:1.55}
.gw-formrow{display:flex;gap:6px;padding:2px}
.gw-field{display:flex;flex-direction:column;gap:3px;padding:4px 2px}
.gw-field>label{font-size:10px;color:var(--dsw-alias-label-secondary)}

/* ---------- 子页签 ---------- */
.gw-tabs{display:flex;border-bottom:1px solid var(--dsw-alias-border-l2);padding:0 8px;overflow-x:auto}
.gw-tab{appearance:none;background:none;border:none;color:var(--dsw-alias-label-secondary);cursor:pointer;
  font-size:11px;font-family:inherit;padding:8px 10px;border-bottom:2px solid transparent;
  display:flex;gap:5px;align-items:center;white-space:nowrap}
.gw-tab:hover{color:var(--dsw-alias-label-primary)}
.gw-tab.on{color:var(--dsw-alias-label-primary);border-bottom-color:var(--dsw-alias-accent-primary)}
.gw-count{background:var(--dsw-alias-interactive-bg-active);border-radius:999px;padding:0 6px;font-size:10px;line-height:16px}

/* ---------- 主体 / 页脚 ---------- */
.gw-body{flex:1;min-height:0;position:relative;display:flex}
.gw-footer{display:flex;justify-content:space-between;gap:12px;padding:5px 12px;
  border-top:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-tertiary);font-size:10px}

/* ---------- 按钮 ---------- */
.gw-btn{appearance:none;display:inline-flex;align-items:center;gap:5px;border:1px solid var(--dsw-alias-border-l1);
  background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);border-radius:6px;
  padding:3px 10px;font-size:11px;font-family:inherit;cursor:pointer;white-space:nowrap}
.gw-btn:hover{background:var(--dsw-alias-interactive-bg-hover)}
.gw-btn.primary{background:transparent;border-color:var(--dsw-alias-accent-primary);color:var(--dsw-alias-accent-primary)}
.gw-btn.primary:hover{background:var(--dsw-alias-interactive-bg-hover)}
.gw-btn.danger{border-color:var(--dsw-alias-state-danger-primary);color:var(--dsw-alias-state-danger-primary)}
.gw-btn:disabled{opacity:.45;cursor:not-allowed}
.gw-btn.backbtn{margin-bottom:6px}
.gw-link{color:var(--dsw-alias-accent-primary);text-decoration:none}
.gw-link:hover{text-decoration:underline}

/* ---------- 列表(Code 外三页签共用)---------- */
.gw-colpane{flex-direction:column}
.gw-toolbar{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:7px 12px;
  border-bottom:1px solid var(--dsw-alias-border-l2);flex:none}
.gw-open-count{color:var(--dsw-alias-label-tertiary);font-size:11px}
.gw-list{flex:1;min-height:0;overflow:auto}
.gw-row{display:flex;gap:9px;padding:9px 12px;border-bottom:1px solid var(--dsw-alias-border-l2);
  cursor:pointer;align-items:flex-start;width:100%;text-align:left;background:none;border-left:none;border-right:none;border-top:none;font-family:inherit;color:inherit;font-size:inherit}
.gw-row:hover{background:var(--dsw-alias-interactive-bg-hover)}
.gw-stateic{flex:none;margin-top:1px}
.gw-rowmain{flex:1;min-width:0}
.gw-rowtitle{font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.gw-rowsub{color:var(--dsw-alias-label-secondary);font-size:11px;margin-top:2px;
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:flex;align-items:center;gap:6px}
.gw-meta{flex:none;text-align:right;color:var(--dsw-alias-label-tertiary);font-size:11px}
.gw-created{display:none;margin-left:10px}
.gw-label-chip{display:inline-block;font-size:10px;padding:0 7px;border-radius:999px;line-height:17px;margin-right:4px}
.gw-branch-chip{background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);
  border-radius:5px;padding:0 5px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:10px}
.gw-diffstat-add{color:var(--dsw-alias-state-success-primary)}
.gw-diffstat-del{color:var(--dsw-alias-state-danger-primary)}
.gw-checkdot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:5px;vertical-align:baseline}
.gw-hoverbar{display:none;gap:6px;margin-top:6px;flex-wrap:wrap}
.gw-row:hover .gw-hoverbar{display:flex}

/* ---------- Code 双栏 ---------- */
.gw-codepane{flex:1;min-height:0;display:flex}
.gw-tree{width:190px;flex:none;border-right:1px solid var(--dsw-alias-border-l2);overflow:auto;padding:6px 4px}
.gw-tree-item{display:flex;align-items:center;gap:4px;padding:2px 6px;border-radius:5px;cursor:pointer;
  color:var(--dsw-alias-label-secondary);white-space:nowrap;overflow:hidden;font-size:12px;
  appearance:none;-webkit-appearance:none;background:none;border:none;font-family:inherit;
  text-align:left;width:100%;min-width:0}
.gw-tree-item:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.gw-tree-item.sel{color:var(--dsw-alias-accent-primary);background:var(--dsw-alias-interactive-bg-active)}
.gw-tree-name{overflow:hidden;text-overflow:ellipsis}
.gw-filepane{flex:1;min-width:0;display:flex;flex-direction:column}
.gw-crumb{padding:7px 12px;color:var(--dsw-alias-label-secondary);border-bottom:1px solid var(--dsw-alias-border-l2);
  font-size:11px;display:flex;gap:8px;align-items:center;min-width:0}
.gw-crumb-path{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}
.gw-crumb-path b{color:var(--dsw-alias-label-primary);font-weight:600}
.gw-code{flex:1;min-height:0;overflow:auto;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;
  font-size:11px;line-height:1.55;padding:8px 0}
.gw-ln{display:flex;min-width:max-content}
.gw-ln:hover{background:var(--dsw-alias-interactive-bg-hover)}
.gw-no{width:38px;flex:none;text-align:right;padding-right:10px;color:var(--dsw-alias-label-tertiary);user-select:none}

/* ---------- 详情抽屉 ---------- */
.gw-detail{position:absolute;inset:0;z-index:30;background:var(--dsw-alias-bg-layer-1);display:flex;flex-direction:column}
.gw-detail-head{padding:10px 14px;border-bottom:1px solid var(--dsw-alias-border-l2);flex:none}
.gw-detail-body{flex:1;min-height:0;overflow:auto;padding:12px 14px;color:var(--dsw-alias-label-secondary);
  line-height:1.65;white-space:pre-wrap;word-break:break-word}
.gw-comment{border-top:1px dashed var(--dsw-alias-border-l2);padding-top:10px;margin-top:10px}
.gw-comment-head{display:flex;align-items:center;gap:8px;color:var(--dsw-alias-label-tertiary);font-size:11px;margin-bottom:6px}
.gw-composer{border-top:1px solid var(--dsw-alias-border-l2);padding:8px 14px;display:flex;flex-direction:column;gap:6px;flex:none}
.gw-textarea{resize:vertical;min-height:52px;max-height:200px;font-family:inherit}
.gw-composer-row{display:flex;gap:8px;align-items:center}

/* ---------- 反馈:确认气泡 / toast / 空 / 错误 / 加载 ---------- */
.gw-scrim{position:absolute;inset:0;z-index:60;background:rgba(0,0,0,.42);display:flex;align-items:center;justify-content:center;padding:20px}
.gw-dialog{width:min(360px,100%);background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);
  border-radius:12px;padding:14px;box-shadow:0 16px 44px rgba(0,0,0,.45)}
.gw-dialog h4{margin:0 0 8px;font-size:13px;color:var(--dsw-alias-label-primary)}
.gw-dialog p{margin:0 0 12px;font-size:12px;color:var(--dsw-alias-label-secondary);line-height:1.6;white-space:pre-wrap}
.gw-dialog-actions{display:flex;gap:8px;justify-content:flex-end}
.gw-toasts{position:absolute;left:12px;right:12px;bottom:34px;z-index:70;display:flex;flex-direction:column;gap:6px;pointer-events:none}
.gw-toast{padding:7px 12px;border-radius:8px;font-size:12px;border:1px solid var(--dsw-alias-border-l1);
  background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}
.gw-toast.err{border-color:var(--dsw-alias-state-danger-primary);color:var(--dsw-alias-state-danger-primary)}
.gw-toast.ok{border-color:var(--dsw-alias-state-success-primary)}
.gw-empty{flex:1;display:flex;align-items:center;justify-content:center;color:var(--dsw-alias-label-tertiary);
  padding:28px;text-align:center;line-height:1.8}
.gw-errbox{margin:12px;padding:10px 12px;border:1px solid var(--dsw-alias-state-danger-primary);
  border-radius:8px;color:var(--dsw-alias-state-danger-primary);font-size:12px;line-height:1.6;white-space:pre-wrap}
.gw-spin{animation:gw-spin 1s linear infinite}
@keyframes gw-spin{to{transform:rotate(360deg)}}
.gw-muted{color:var(--dsw-alias-label-tertiary)}

/* ---------- 窄屏紧凑档(<600px):树变覆盖抽屉、头部换行 ---------- */
.gw-codepane{position:relative}
/* 抽屉开关(CodeView 层悬浮,宽屏隐藏);treeOpen 时变为关闭钮 */
.gw-tree-fab{display:none;position:absolute;top:8px;left:8px;z-index:26}
@container (max-width:599px){
  .gw-header{flex-wrap:wrap;row-gap:6px;padding-right:10px}
  .gw-select{margin-left:0;max-width:104px}
  .gw-tabs{padding:0 4px}
  .gw-tab{padding:8px 9px}
  .gw-codepane.tree-open .gw-tree-fab{left:auto;right:8px} /* 抽屉开着 ⇒ 变成右上角关闭位 */
  .gw-tree-fab{display:inline-flex}
  .gw-codepane:not(.tree-open) .gw-tree{display:none;width:auto;position:absolute;inset:0;z-index:25;
    background:var(--dsw-alias-bg-layer-1);border-right:none}
  .gw-rowtitle{white-space:normal;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;line-height:1.35}
  .gw-rowsub{white-space:normal;flex-wrap:wrap}
  .gw-composer-row{flex-wrap:wrap}
  .gw-crumb{flex-wrap:wrap}
}

/* ---------- 容器查询三档(<720 默认紧凑 / ≥720 / ≥1000)---------- */
@container (min-width:720px){
  .gw-tree{width:240px}
  .gw-header,.gw-toolbar{padding-left:16px;padding-right:16px}
  .gw-tab{padding:9px 14px;font-size:12px}
  .gw-row{padding:11px 16px}
}
@container (min-width:1000px){
  .gw-tree{width:290px}
  .gw-header{padding:12px 18px}
  .gw-rowsub{font-size:12px}
  .gw-code{font-size:12px;line-height:1.6}
  .gw-created{display:inline}
  .gw-pane-wrap>.gw-detail{inset:14px;border:1px solid var(--dsw-alias-border-l1);border-radius:12px;
    box-shadow:0 14px 40px rgba(0,0,0,.4)}
}
`;

let injected = false;

/** 幂等注入全局样式(幂等:HMR/重复挂载安全)。 */
export function ensureStyles(): void {
  if (injected && typeof document !== 'undefined' && document.getElementById('github-workbench-styles')) return;
  if (typeof document === 'undefined') return;
  const el = document.createElement('style');
  el.id = 'github-workbench-styles';
  el.textContent = GW_CSS;
  document.head.appendChild(el);
  injected = true;
}
