import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { chunkRepoQualifiers, inboxItemKey } from '../src/lib.ts';
import {
  createInboxStore, hitToItem, mergeIncoming, unreadByKind, unreadCountOf,
  type InboxDeps, type InboxItem,
} from '../src/inbox-store.ts';
import type { InboxSearchHit, GhRun } from '../src/api.ts';

describe('chunkRepoQualifiers', () => {
  it('空输入', () => {
    assert.deepEqual(chunkRepoQualifiers([]), []);
  });
  it('单仓一组', () => {
    assert.deepEqual(chunkRepoQualifiers(['a/b']), [['a/b']]);
  });
  it('超长切批', () => {
    const names = ['aaaa/bbbb', 'cccc/dddd', 'eeee/ffff'];
    const chunks = chunkRepoQualifiers(names, 24);
    assert.ok(chunks.length >= 2);
    assert.deepEqual(chunks.flat(), names);
  });
});

describe('inboxItemKey / mergeIncoming', () => {
  const a: InboxItem = {
    key: 'issue:o/r#1', kind: 'issue', owner: 'o', repo: 'r', number: 1, title: 'one',
    htmlUrl: 'https://github.com/o/r/issues/1', user: 'alice', createdAt: '2026-01-02T00:00:00Z', unread: true,
  };
  const b: InboxItem = {
    key: 'pr:o/r#2', kind: 'pr', owner: 'o', repo: 'r', number: 2, title: 'two',
    htmlUrl: 'https://github.com/o/r/pull/2', user: 'bob', createdAt: '2026-01-03T00:00:00Z', unread: true,
  };

  it('key 形态', () => {
    assert.equal(inboxItemKey('issue', 'o', 'r', 12), 'issue:o/r#12');
    assert.equal(inboxItemKey('pr', 'o', 'r', 12), 'pr:o/r#12');
    assert.equal(inboxItemKey('actions', 'o', 'r', 99), 'actions:o/r#99');
  });

  it('新条目按 createdAt 倒序,已有 key 不覆盖', () => {
    const { items, fresh } = mergeIncoming([a], [b, { ...a, title: 'changed' }], new Set(), new Set());
    assert.equal(items[0].key, 'pr:o/r#2');
    assert.equal(items.find((x) => x.key === 'issue:o/r#1')?.title, 'one');
    assert.deepEqual(fresh.map((x) => x.key), ['pr:o/r#2']);
  });

  it('readKeys / selfKeys 进箱但未读为 false,不算 fresh', () => {
    const { items, fresh } = mergeIncoming([], [a, b], new Set(['issue:o/r#1']), new Set(['pr:o/r#2']));
    assert.equal(items.find((x) => x.key === 'issue:o/r#1')?.unread, false);
    assert.equal(items.find((x) => x.key === 'pr:o/r#2')?.unread, false);
    assert.equal(fresh.length, 0);
  });

  it('unreadCount / unreadByKind', () => {
    assert.equal(unreadCountOf([a, { ...b, unread: false }]), 1);
    assert.deepEqual(unreadByKind([a, b]), { issue: 1, pr: 1, actions: 0 });
  });
});

describe('createInboxStore', () => {
  function mem() {
    const m = new Map<string, string>();
    return {
      getItem: (k: string) => m.get(k) ?? null,
      setItem: (k: string, v: string) => { m.set(k, v); },
    };
  }

  function deps(hits: InboxSearchHit[], opts?: Partial<InboxDeps>): InboxDeps {
    return {
      getToken: () => 'tok',
      getMyRepos: async () => [{
        fullName: 'acme/web', isPrivate: false, pushedAt: '2026-01-01T00:00:00Z',
        description: null, ownerLogin: 'acme',
      }],
      myReposTruncated: () => false,
      loadHiddenRepos: () => [],
      getViewerLogin: async () => 'me',
      searchInboxCreatedSince: async () => ({ hits, queryTruncated: false }),
      listRunsCreatedSince: async () => [] as GhRun[],
      loadRecentRepos: () => [],
      now: () => Date.parse('2026-01-10T00:00:00Z'),
      storage: mem(),
      ...opts,
    };
  }

  it('poll 插入未读,self-mark 不算未读', async () => {
    const hit: InboxSearchHit = {
      kind: 'issue', owner: 'acme', repo: 'web', number: 12, title: '登录失败',
      htmlUrl: 'https://github.com/acme/web/issues/12', user: 'ghost',
      createdAt: '2026-01-09T12:00:00Z',
    };
    const store = createInboxStore(deps([hit]));
    store.markSelfCreated('issue:acme/web#12');
    const fresh = await store.pollOnce();
    assert.equal(fresh.length, 0);
    assert.equal(store.unreadCount(), 0);
    assert.equal(store.getSnapshot().items[0]?.title, '登录失败');
  });

  it('无 token 不拉、未读为 0', async () => {
    const store = createInboxStore(deps([], { getToken: () => '' }));
    await store.pollOnce();
    assert.equal(store.getSnapshot().hasToken, false);
    assert.equal(store.unreadCount(), 0);
  });

  it('markRead / markAllRead 按 kind', async () => {
    const hits: InboxSearchHit[] = [
      {
        kind: 'issue', owner: 'acme', repo: 'web', number: 1, title: 'x',
        htmlUrl: 'https://github.com/acme/web/issues/1', user: 'a',
        createdAt: '2026-01-09T12:00:00Z',
      },
      {
        kind: 'pr', owner: 'acme', repo: 'web', number: 2, title: 'p',
        htmlUrl: 'https://github.com/acme/web/pull/2', user: 'a',
        createdAt: '2026-01-09T13:00:00Z',
      },
    ];
    const store = createInboxStore(deps(hits));
    await store.pollOnce();
    assert.equal(store.unreadCount(), 2);
    store.markAllRead('issue');
    assert.equal(store.unreadCount(), 1);
    assert.equal(store.getSnapshot().unreadByKind.pr, 1);
    store.markRead('pr:acme/web#2');
    assert.equal(store.unreadCount(), 0);
  });

  it('hitToItem', () => {
    const it = hitToItem({
      kind: 'pr', owner: 'o', repo: 'r', number: 3, title: 't', htmlUrl: 'u', user: 'u', createdAt: 'c',
    }, true);
    assert.equal(it.key, 'pr:o/r#3');
    assert.equal(it.kind, 'pr');
    assert.equal(it.unread, true);
  });
});
