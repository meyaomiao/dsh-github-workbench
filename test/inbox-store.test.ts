import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { chunkRepoQualifiers, inboxItemKey } from '../src/lib.ts';
import {
  createInboxStore, hitToItem, mergeIncoming, unreadByKind, unreadCountOf,
  type InboxDeps, type InboxItem,
} from '../src/inbox-store.ts';
import type { InboxSearchHit, GhRun } from '../src/api.ts';

describe('chunkRepoQualifiers', () => {
  it('handles an empty input', () => {
    assert.deepEqual(chunkRepoQualifiers([]), []);
  });
  it('keeps a single repository in one group', () => {
    assert.deepEqual(chunkRepoQualifiers(['a/b']), [['a/b']]);
  });
  it('splits oversized input into batches', () => {
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

  it('uses stable item keys', () => {
    assert.equal(inboxItemKey('issue', 'o', 'r', 12), 'issue:o/r#12');
    assert.equal(inboxItemKey('pr', 'o', 'r', 12), 'pr:o/r#12');
    assert.equal(inboxItemKey('actions', 'o', 'r', 99), 'actions:o/r#99');
  });

  it('sorts new items by createdAt without replacing existing keys', () => {
    const { items, fresh } = mergeIncoming([a], [b, { ...a, title: 'changed' }], new Set(), new Set());
    assert.equal(items[0].key, 'pr:o/r#2');
    assert.equal(items.find((x) => x.key === 'issue:o/r#1')?.title, 'one');
    assert.deepEqual(fresh.map((x) => x.key), ['pr:o/r#2']);
  });

  it('keeps read and self-created items out of the fresh set', () => {
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

  it('inserts polled items as unread unless self-marked', async () => {
    const hit: InboxSearchHit = {
      kind: 'issue', owner: 'acme', repo: 'web', number: 12, title: 'Login failed',
      htmlUrl: 'https://github.com/acme/web/issues/12', user: 'ghost',
      createdAt: '2026-01-09T12:00:00Z',
    };
    const store = createInboxStore(deps([hit]));
    store.markSelfCreated('issue:acme/web#12');
    const fresh = await store.pollOnce();
    assert.equal(fresh.length, 0);
    assert.equal(store.unreadCount(), 0);
    assert.equal(store.getSnapshot().items[0]?.title, 'Login failed');
  });

  it('does not poll without a token', async () => {
    const store = createInboxStore(deps([], { getToken: () => '' }));
    await store.pollOnce();
    assert.equal(store.getSnapshot().hasToken, false);
    assert.equal(store.unreadCount(), 0);
  });

  it('marks items read by kind', async () => {
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
