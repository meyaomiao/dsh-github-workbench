/**
 * Code 页签:左列远端目录树(git trees API 单次 recursive 拉取),
 * 右侧文件预览(contents API,<900KB 文本行号渲染;二进制/超大降级为外链卡片)。
 */

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { GwIcon } from './icons.ts';
import * as api from './api.ts';
import { buildTree, fmtSize, ghRefKey, type GhRef, type TreeNode } from './lib.ts';
import { Loading, ErrorBox } from './ui.tsx';
import { errText } from './workbench.tsx';

export interface CodeViewProps {
  ghRef: GhRef;
  branch: string;
}

export function CodeView({ ghRef, branch }: CodeViewProps): ReactNode {
  const [items, setItems] = useState<{ path: string; type: 'blob' | 'tree'; size?: number }[] | null>(null);
  const [truncated, setTruncated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<string | null>(null);
  const [treeOpen, setTreeOpen] = useState(false); // 窄屏抽屉开关(宽屏由 CSS 忽略)

  useEffect(() => {
    let dead = false;
    setItems(null); setError(null); setSelected(null); setTruncated(false);
    api.getTree(ghRef, branch)
      .then((r) => {
        if (dead) return;
        setItems(r.items);
        setTruncated(r.truncated);
        // 默认展开第一层目录
        const first = new Set<string>();
        for (const it of r.items) {
          const top = it.path.split('/')[0];
          if (it.type === 'tree' && it.path === top) first.add(top);
        }
        setExpanded(first);
      })
      .catch((e) => { if (!dead) setError(errText(e)); });
    return () => { dead = true; };
  }, [ghRef.owner, ghRef.repo, branch]);

  if (error) return <ErrorBox msg={error} onRetry={() => setReloadSelf()} />;
  if (!items) return <Loading label="拉取目录树…" />;

  const nodes = buildTree(items);

  function setReloadSelf(): void {
    setSelected(null);
    setItems(null); // 触发重载(effect 依赖不变,这里手动置空再由 key 重挂载更稳;简化:直接重新拉取)
    api.getTree(ghRef, branch)
      .then((r) => { setItems(r.items); setTruncated(r.truncated); })
      .catch((e) => setError(errText(e)));
  }

  const toggle = (path: string): void => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path); else next.add(path);
      return next;
    });
  };

  return (
    <div className={'gw-codepane' + (treeOpen ? ' tree-open' : '')}>
      <button
        className='gw-btn gw-tree-fab'
        title={treeOpen ? '关闭目录' : '目录'}
        onClick={() => setTreeOpen((v) => !v)}>
        <GwIcon name={treeOpen ? 'x-circle' : 'folder'} size={12} />
        {treeOpen ? '收起' : '目录'}
      </button>
      <div className="gw-tree">
        {truncated && (
          <div className="gw-pop-hint" style={{ padding: '2px 6px 8px' }}>
            目录过大被 GitHub 截断,仅显示部分条目。
          </div>
        )}
        {nodes.map((n) => (
          <TreeRow key={n.path} node={n} depth={0} expanded={expanded} selected={selected}
            onToggle={toggle} onSelect={(path) => { setSelected(path); setTreeOpen(false); }} />
        ))}
        {nodes.length === 0 && <div className="gw-empty">空仓库 / 空分支</div>}
      </div>
      <div className="gw-filepane">
        {selected
          ? <FilePane key={`${ghRefKey(ghRef)}@${branch}:${selected}`} ghRef={ghRef} path={selected} branch={branch}
              onClose={() => setSelected(null)} />
          : <div className="gw-empty">从左侧选择文件预览<br />二进制 / 超大文件会给出下载与 GitHub 外链</div>}
      </div>
    </div>
  );
}

function TreeRow(props: {
  node: TreeNode; depth: number;
  expanded: Set<string>; selected: string | null;
  onToggle: (path: string) => void; onSelect: (path: string) => void;
}): ReactNode {
  const { node, depth } = props;
  const isOpen = props.expanded.has(node.path);
  return (
    <>
      <button
        className={`gw-tree-item ${props.selected === node.path ? 'sel' : ''}`}
        style={{ paddingLeft: 6 + depth * 13 }}
        title={node.path}
        onClick={() => (node.type === 'tree' ? props.onToggle(node.path) : props.onSelect(node.path))}>
        {node.type === 'tree'
          ? <GwIcon name={isOpen ? 'chevron-down' : 'chevron-right'} size={11}
              style={{ color: 'var(--dsw-alias-label-tertiary)' }} />
          : null}
        <GwIcon name={node.type === 'tree' ? (isOpen ? 'folder-open' : 'folder') : 'file'} size={13}
          style={{ color: node.type === 'tree' ? 'var(--dsw-alias-accent-primary)' : 'var(--dsw-alias-label-tertiary)' }} />
        <span className="gw-tree-name">{node.name}</span>
        {node.type === 'blob' && node.size !== undefined && (
          <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--dsw-alias-label-tertiary)' }}>
            {fmtSize(node.size)}
          </span>
        )}
      </button>
      {node.type === 'tree' && isOpen && node.children?.map((c) => (
        <TreeRow key={c.path} node={c} depth={depth + 1} expanded={props.expanded} selected={props.selected}
          onToggle={props.onToggle} onSelect={props.onSelect} />
      ))}
    </>
  );
}

function FilePane(props: { ghRef: GhRef; path: string; branch: string; onClose: () => void }): ReactNode {
  const [data, setData] = useState<api.ContentResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let dead = false;
    setData(null); setError(null);
    api.getFileContent(props.ghRef, props.path, props.branch)
      .then((r) => { if (!dead) setData(r); })
      .catch((e) => { if (!dead) setError(errText(e)); });
    return () => { dead = true; };
  }, [props.ghRef.owner, props.ghRef.repo, props.path, props.branch]);

  const name = props.path.split('/').pop() ?? props.path;
  const dir = props.path.includes('/') ? props.path.slice(0, props.path.lastIndexOf('/')) + ' / ' : '';

  return (
    <>
      <div className="gw-crumb">
        <span className="gw-crumb-path">{dir}<b>{name}</b></span>
        {data && <span className="gw-muted">{fmtSize(data.size)}</span>}
        {data && (
          <a className="gw-link" href={data.htmlUrl} target="_blank" rel="noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginLeft: 'auto', flex: 'none' }}>
            <GwIcon name="external-link" size={11} />GitHub
          </a>
        )}
        <button className="gw-hbtn" title="关闭" onClick={props.onClose}>
          <GwIcon name="x-circle" size={13} />
        </button>
      </div>
      {error && <ErrorBox msg={error} />}
      {!error && !data && <Loading label="读取文件…" />}
      {data?.kind === 'text' && (
        <div className="gw-code">
          {(data.text ?? '').split('\n').map((line, i) => (
            <div className="gw-ln" key={i}>
              <span className="gw-no">{i + 1}</span>
              <span style={{ whiteSpace: 'pre' }}>{line || ' '}</span>
            </div>
          ))}
          {data.truncatedLines && (
            <div className="gw-pop-hint" style={{ padding: '6px 12px' }}>
              超过 3000 行,已截断 —— 完整内容请到 GitHub 查看。
            </div>
          )}
        </div>
      )}
      {data && data.kind !== 'text' && (
        <div className="gw-empty">
          <div>
            {data.kind === 'too-big' ? '文件超过 900KB,不在侧边栏内联渲染。' : '二进制文件,无法文本预览。'}
            <br />
            <a className="gw-link" href={data.htmlUrl} target="_blank" rel="noreferrer">在 GitHub 打开 ↗</a>
          </div>
        </div>
      )}
    </>
  );
}
