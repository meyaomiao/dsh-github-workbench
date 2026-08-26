/** 视图层共享原语:加载 / 错误 / 空状态。 */

import type { ReactNode } from 'react';
import { GwIcon } from './icons.ts';

export function Loading(props: { label?: string }): ReactNode {
  return (
    <div className="gw-empty">
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <span className="gw-spin"><GwIcon name="loader" /></span>
        {props.label ?? '加载中…'}
      </span>
    </div>
  );
}

export function ErrorBox(props: { msg: string; onRetry?: () => void }): ReactNode {
  return (
    <div className="gw-errbox">
      {props.msg}
      {props.onRetry && (
        <div style={{ marginTop: 8 }}>
          <button className="gw-btn" onClick={props.onRetry}>重试</button>
        </div>
      )}
    </div>
  );
}

export function Empty(props: { children: ReactNode }): ReactNode {
  return <div className="gw-empty">{props.children}</div>;
}
