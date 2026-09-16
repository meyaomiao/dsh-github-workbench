/** Shared UI primitives: Loading / Error / Empty. */

import type { ReactNode } from 'react';
import { GwIcon } from './icons.ts';
import { t } from './locales.ts';

export function Loading(props: { label?: string }): ReactNode {
  return (
    <div className="gw-empty">
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <span className="gw-spin"><GwIcon name="loader" /></span>
        {props.label ?? t('loading')}
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
          <button className="gw-btn" onClick={props.onRetry}>{t('retry')}</button>
        </div>
      )}
    </div>
  );
}

export function Empty(props: { children: ReactNode }): ReactNode {
  return <div className="gw-empty">{props.children}</div>;
}
