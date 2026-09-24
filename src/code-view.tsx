/**
 * Code tab: remote directory tree on the left and file preview on the right.
 * The contents API renders text under 900 KB with line numbers; binary and
 * oversized files fall back to an external link.
 */

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { GwIcon } from './icons.ts';
import * as api from './api.ts';
import { buildTree, fmtSize, ghRefKey, type GhRef, type TreeNode } from './lib.ts';
import { Loading, ErrorBox } from './ui.tsx';
import { errText } from './workbench.tsx';
import { t } from './locales.ts';

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
  const [treeOpen, setTreeOpen] = useState(false); // Narrow-screen drawer toggle; CSS ignores it on wide screens.

  useEffect(() => {
    let dead = false;
    setItems(null); setError(null); setSelected(null); setTruncated(false);
    api.getTree(ghRef, branch)
      .then((r) => {
        if (dead) return;
        setItems(r.items);
        setTruncated(r.truncated);
        // Expand top-level directories by default.
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
  if (!items) return <Loading label={t('loadingTree')} />;

  const nodes = buildTree(items);

  function setReloadSelf(): void {
    setSelected(null);
    setItems(null);
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
        title={treeOpen ? t('tree.close') : t('tree.open')}
        onClick={() => setTreeOpen((v) => !v)}>
        <GwIcon name={treeOpen ? 'x-circle' : 'folder'} size={12} />
        {treeOpen ? t('tree.collapse') : t('tree.open')}
      </button>
      <div className="gw-tree">
        {truncated && (
          <div className="gw-pop-hint" style={{ padding: '2px 6px 8px' }}>
            {t('tree.truncated')}
          </div>
        )}
        {nodes.map((n) => (
          <TreeRow key={n.path} node={n} depth={0} expanded={expanded} selected={selected}
            onToggle={toggle} onSelect={(path) => { setSelected(path); setTreeOpen(false); }} />
        ))}
        {nodes.length === 0 && <div className="gw-empty">{t('empty.repo')}</div>}
      </div>
      <div className="gw-filepane">
        {selected
          ? <FilePane key={`${ghRefKey(ghRef)}@${branch}:${selected}`} ghRef={ghRef} path={selected} branch={branch}
              onClose={() => setSelected(null)} />
          : <div className="gw-empty">{t('empty.selectFile')}</div>}
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
        <button className="gw-hbtn" title={t('tree.closeFile')} onClick={props.onClose}>
          <GwIcon name="x-circle" size={13} />
        </button>
      </div>
      {error && <ErrorBox msg={error} />}
      {!error && !data && <Loading label={t('loadingFile')} />}
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
              {t('file.truncated')}
            </div>
          )}
        </div>
      )}
      {data && data.kind !== 'text' && (
        <div className="gw-empty">
          <div>
            {data.kind === 'too-big' ? t('file.tooBig') : t('file.binary')}
            <br />
            <a className="gw-link" href={data.htmlUrl} target="_blank" rel="noreferrer">{t('file.openOnGitHub')}</a>
          </div>
        </div>
      )}
    </>
  );
}
