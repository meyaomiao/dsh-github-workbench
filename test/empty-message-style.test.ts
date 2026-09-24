import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { GW_CSS } from '../src/styles.ts';

describe('empty-state styling', () => {
  it('preserves intentional line breaks in empty messages', () => {
    assert.match(GW_CSS, /\.gw-empty\{[^}]*white-space:pre-line/);
  });
});
