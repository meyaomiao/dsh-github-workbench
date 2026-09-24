import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';
import { en, getLocale, setLocale, t, zh } from '../src/locales.ts';

describe('locale dictionaries', () => {
  afterEach(() => setLocale('en'));

  it('looks up Chinese and English copy', () => {
    setLocale('zh');
    assert.equal(t('workbench.title'), 'GitHub \u5de5\u4f5c\u53f0');
    setLocale('en');
    assert.equal(t('workbench.title'), en['workbench.title']);
    assert.equal(zh['workbench.title'], 'GitHub \u5de5\u4f5c\u53f0');
  });

  it('selects the active locale explicitly', () => {
    setLocale('zh');
    assert.equal(getLocale(), 'zh');
    setLocale('en');
    assert.equal(getLocale(), 'en');
  });

  it('interpolates parameters in both dictionaries', () => {
    setLocale('zh');
    assert.equal(t('workbench.titleWithCount', { count: 3 }), 'GitHub \u5de5\u4f5c\u53f0 (3)');
    setLocale('en');
    assert.equal(t('workbench.titleWithCount', { count: 3 }), 'GitHub Workbench (3)');
  });

  it('keeps the standalone unread label free of a separator', () => {
    setLocale('en');
    assert.equal(t('inbox.unreadCount', { count: 4 }), '4 unread');
    assert.ok(t('inbox.unread', { count: 4 }).startsWith(' '));
  });
});
