import assert from 'node:assert/strict';
import { after, beforeEach, describe, it } from 'node:test';

/** Small chai-style expect adapter for node:test. */
function expect(actual: unknown) {
  return {
    toEqual(expected: unknown) { assert.deepEqual(actual, expected); },
    toMatchObject(expected: Record<string, unknown>) {
      for (const [k, v] of Object.entries(expected)) assert.deepEqual((actual as Record<string, unknown>)[k], v);
    },
    toBeNull() { assert.equal(actual, null); },
  };
}
import {
  buildTree, parseGithubUrl, clamp, decodeBase64Utf8, labelTextColor,
  parseGithubRemote, parseLinkNext, parseRepoInput, qs, timeAgo,
} from '../src/lib.ts';
import { setLocale } from '../src/locales.ts';

describe('parseGithubRemote(.git/config)', () => {
  it('parses an HTTPS remote', () => {
    const text = '[remote "origin"]\n\turl = https://github.com/xzb/atlas-console.git\n\tfetch = +refs/heads/*:refs/remotes/origin/*\n';
    assert.deepEqual(parseGithubRemote(text), { owner: 'xzb', repo: 'atlas-console' });
  });

  it('prefers origin over other SSH remotes', () => {
    const text = '[remote "upstream"]\n\turl = git@github.com:a/b.git\n[remote "origin"]\n\turl = git@github.com:xzb/atlas.git\n';
    assert.deepEqual(parseGithubRemote(text), { owner: 'xzb', repo: 'atlas' });
  });

  it('returns null without a GitHub remote', () => {
    assert.equal(parseGithubRemote('[remote "o"]\n\turl = https://gitlab.com/a/b.git'), null);
  });
});

describe('parseRepoInput', () => {
  it('owner/repo', () => {
    assert.deepEqual(parseRepoInput(' xzb/atlas-console '), { owner: 'xzb', repo: 'atlas-console' });
  });
  it('accepts full URLs and .git suffixes', () => {
    assert.deepEqual(parseRepoInput('https://github.com/o/r.git/tree/main'), { owner: 'o', repo: 'r' });
    assert.deepEqual(parseRepoInput('git@github.com:o2/r2.git'), { owner: 'o2', repo: 'r2' });
  });
  it('rejects invalid input', () => {
    assert.equal(parseRepoInput('   '), null);
    assert.equal(parseRepoInput('just-a-word'), null);
  });
});

describe('buildTree', () => {
  const nodes = buildTree([
    { path: 'README.md', type: 'blob', size: 12 },
    { path: 'src/client/api.ts', type: 'blob', size: 3 },
    { path: 'src/index.ts', type: 'blob', size: 1 },
    { path: 'src/client', type: 'tree' },
  ]);
  it('sorts directories first and names within a type', () => {
    assert.equal(nodes[0].type, 'tree');
    assert.equal(nodes[0].name, 'src');
    assert.equal(nodes[1].name, 'README.md');
  });
  it('nests children and deduplicates directories', () => {
    const src = nodes[0];
    assert.deepEqual(src.children?.map((c) => c.name), ['client', 'index.ts']);
    const client = src.children![0];
    assert.equal(client.children?.length, 1);
    assert.equal(client.children![0].path, 'src/client/api.ts');
  });
});

describe('timeAgo', () => {
  const now = Date.parse('2026-01-10T12:00:00Z');
  beforeEach(() => setLocale('zh'));
  after(() => setLocale('en'));
  it('formats minutes, hours, and days in Chinese', () => {
    assert.equal(timeAgo(new Date(now - 30_000).toISOString(), now), '\u521a\u521a');
    assert.equal(timeAgo(new Date(now - 5 * 60_000).toISOString(), now), '5 \u5206\u949f\u524d');
    assert.equal(timeAgo(new Date(now - 3 * 3600_000).toISOString(), now), '3 \u5c0f\u65f6\u524d');
    assert.equal(timeAgo(new Date(now - 2 * 86400_000).toISOString(), now), '2 \u5929\u524d');
  });
});

describe('utility helpers', () => {
  it('decodes UTF-8 and line breaks with decodeBase64Utf8', () => {
    const b64 = Buffer.from('hello world').toString('base64')
      .replace(/(.{4})/g, '$1\n');
    assert.equal(decodeBase64Utf8(b64), 'hello world');
  });
  it('skips empty query values', () => {
    assert.equal(qs({ a: 1, b: undefined, c: '' }), '?a=1');
  });
  it('reads rel=next and otherwise returns null', () => {
    const link = '<https://api.github.com/search/issues?q=r&page=2>; rel="next", <https://api.github.com/search/issues?q=r&page=9>; rel="last"';
    assert.equal(parseLinkNext(link), 'https://api.github.com/search/issues?q=r&page=2');
    assert.equal(parseLinkNext('<https://api.github.com/x?page=3>; rel="last"'), null);
    assert.equal(parseLinkNext(null), null);
    assert.equal(parseLinkNext(''), null);
  });
  it('chooses readable label text colors', () => {
    assert.match(labelTextColor('#f0f0f0'), /^#000/);
    assert.match(labelTextColor('#123456'), /^#fff/i);
  });
  it('clamp', () => {
    assert.equal(clamp(9, 0, 5), 5);
    assert.equal(clamp(-1, 0, 5), 0);
    assert.equal(clamp(3, 0, 5), 3);
  });
});

describe('parseGithubUrl', () => {
  it('extracts coordinates from a repository URL', () => {
    expect(parseGithubUrl('https://github.com/xzb/atlas')).toEqual({ ref: { owner: 'xzb', repo: 'atlas' } });
  });
  it('extracts issue and pull deep-link numbers', () => {
    expect(parseGithubUrl('https://github.com/xzb/atlas/issues/142'))
      .toMatchObject({ ref: { owner: 'xzb', repo: 'atlas' }, kind: 'issues', number: 142 });
    expect(parseGithubUrl('https://github.com/xzb/atlas/pull/7?diff=split'))
      .toMatchObject({ kind: 'pulls', number: 7 });
  });
  it('rejects non-GitHub hosts', () => {
    expect(parseGithubUrl('https://gitlab.com/a/b')).toBeNull();
  });
});
