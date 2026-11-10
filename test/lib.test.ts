import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

/** node:test 轻量 expect 适配(chai 风格子集)。 */
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
  formatGhErrorDetail, isRestIssuesListUrl, isRestPullsListUrl,
  excludePullsFromIssueList, filterPullsByMerged,
} from '../src/lib.ts';

describe('parseGithubRemote(.git/config)', () => {
  it('https remote', () => {
    const text = '[remote "origin"]\n\turl = https://github.com/xzb/atlas-console.git\n\tfetch = +refs/heads/*:refs/remotes/origin/*\n';
    assert.deepEqual(parseGithubRemote(text), { owner: 'xzb', repo: 'atlas-console' });
  });

  it('ssh remote 且 origin 优先于其他 remote', () => {
    const text = '[remote "upstream"]\n\turl = git@github.com:a/b.git\n[remote "origin"]\n\turl = git@github.com:xzb/atlas.git\n';
    assert.deepEqual(parseGithubRemote(text), { owner: 'xzb', repo: 'atlas' });
  });

  it('无 GitHub remote → null', () => {
    assert.equal(parseGithubRemote('[remote "o"]\n\turl = https://gitlab.com/a/b.git'), null);
  });
});

describe('parseRepoInput', () => {
  it('owner/repo', () => {
    assert.deepEqual(parseRepoInput(' xzb/atlas-console '), { owner: 'xzb', repo: 'atlas-console' });
  });
  it('完整 URL 与 .git 后缀', () => {
    assert.deepEqual(parseRepoInput('https://github.com/o/r.git/tree/main'), { owner: 'o', repo: 'r' });
    assert.deepEqual(parseRepoInput('git@github.com:o2/r2.git'), { owner: 'o2', repo: 'r2' });
  });
  it('非法输入 → null', () => {
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
  it('目录在前、同型按名排序', () => {
    assert.equal(nodes[0].type, 'tree');
    assert.equal(nodes[0].name, 'src');
    assert.equal(nodes[1].name, 'README.md');
  });
  it('嵌套正确且目录去重', () => {
    const src = nodes[0];
    assert.deepEqual(src.children?.map((c) => c.name), ['client', 'index.ts']);
    const client = src.children![0];
    assert.equal(client.children?.length, 1);
    assert.equal(client.children![0].path, 'src/client/api.ts');
  });
});

describe('timeAgo', () => {
  const now = Date.parse('2026-01-10T12:00:00Z');
  it('分钟 / 小时 / 天', () => {
    assert.equal(timeAgo(new Date(now - 30_000).toISOString(), now), '刚刚');
    assert.equal(timeAgo(new Date(now - 5 * 60_000).toISOString(), now), '5 分钟前');
    assert.equal(timeAgo(new Date(now - 3 * 3600_000).toISOString(), now), '3 小时前');
    assert.equal(timeAgo(new Date(now - 2 * 86400_000).toISOString(), now), '2 天前');
  });
});

describe('杂项', () => {
  it('decodeBase64Utf8 处理 UTF-8 与换行', () => {
    const b64 = Buffer.from('hello 中文').toString('base64')
      .replace(/(.{4})/g, '$1\n');
    assert.equal(decodeBase64Utf8(b64), 'hello 中文');
  });
  it('qs 跳过空值', () => {
    assert.equal(qs({ a: 1, b: undefined, c: '' }), '?a=1');
  });
  it('parseLinkNext 取 rel=next,没有则 null', () => {
    const link = '<https://api.github.com/search/issues?q=r&page=2>; rel="next", <https://api.github.com/search/issues?q=r&page=9>; rel="last"';
    assert.equal(parseLinkNext(link), 'https://api.github.com/search/issues?q=r&page=2');
    assert.equal(parseLinkNext('<https://api.github.com/x?page=3>; rel="last"'), null);
    assert.equal(parseLinkNext(null), null);
    assert.equal(parseLinkNext(''), null);
  });
  it('labelTextColor 亮底黑字、暗底白字', () => {
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
  it('仓库主页 → 仅坐标', () => {
    expect(parseGithubUrl('https://github.com/xzb/atlas')).toEqual({ ref: { owner: 'xzb', repo: 'atlas' } });
  });
  it('issue / pull 深链带编号', () => {
    expect(parseGithubUrl('https://github.com/xzb/atlas/issues/142'))
      .toMatchObject({ ref: { owner: 'xzb', repo: 'atlas' }, kind: 'issues', number: 142 });
    expect(parseGithubUrl('https://github.com/xzb/atlas/pull/7?diff=split'))
      .toMatchObject({ kind: 'pulls', number: 7 });
  });
  it('非 github 域 → null', () => {
    expect(parseGithubUrl('https://gitlab.com/a/b')).toBeNull();
  });
});

describe('formatGhErrorDetail(GitHub 422 JSON)', () => {
  it('空 q:message + Search.q missing', () => {
    const body = {
      message: 'Validation Failed',
      errors: [{ resource: 'Search', field: 'q', code: 'missing' }],
    };
    assert.equal(formatGhErrorDetail(body), 'Validation Failed · Search.q missing');
  });
  it('无权搜仓:拼上 errors[].message,不再只剩 Validation Failed', () => {
    const body = {
      message: 'Validation Failed',
      errors: [{
        message: 'The listed users and repositories cannot be searched either because the resources do not exist or you do not have permission to view them.',
        resource: 'Search', field: 'q', code: 'invalid',
      }],
    };
    const s = formatGhErrorDetail(body);
    assert.match(s, /Validation Failed/);
    assert.match(s, /cannot be searched/);
    assert.ok(s.length > 'Validation Failed'.length);
  });
  it('非对象 → 空串', () => {
    assert.equal(formatGhErrorDetail(null), '');
    assert.equal(formatGhErrorDetail('oops'), '');
  });
});

describe('REST 列表 URL 与过滤', () => {
  it('isRestIssuesListUrl 认仓库列表,不认 Search 或单条', () => {
    assert.equal(isRestIssuesListUrl('/repos/o/r/issues?state=open'), true);
    assert.equal(isRestIssuesListUrl('https://api.github.com/repositories/99/issues?page=2'), true);
    assert.equal(isRestIssuesListUrl('/search/issues?q=repo:o/r'), false);
    assert.equal(isRestIssuesListUrl('/repos/o/r/issues/12'), false);
  });
  it('isRestPullsListUrl 认仓库列表,不认单条', () => {
    assert.equal(isRestPullsListUrl('/repos/o/r/pulls'), true);
    assert.equal(isRestPullsListUrl('https://api.github.com/repositories/1/pulls?page=2'), true);
    assert.equal(isRestPullsListUrl('/repos/o/r/pulls/3'), false);
  });
  it('excludePullsFromIssueList 去掉带 pull_request 的项', () => {
    const items = [
      { number: 1, title: 'issue' },
      { number: 2, title: 'pr', pull_request: { url: 'https://api.github.com/repos/o/r/pulls/2' } },
    ];
    assert.deepEqual(excludePullsFromIssueList(items).map((x) => x.number), [1]);
  });
  it('filterPullsByMerged 拆 closed / merged', () => {
    const items = [
      { number: 1, merged_at: '2026-01-01T00:00:00Z' },
      { number: 2, merged_at: null },
      { number: 3 },
    ];
    assert.deepEqual(filterPullsByMerged(items, true).map((x) => x.number), [1]);
    assert.deepEqual(filterPullsByMerged(items, false).map((x) => x.number), [2, 3]);
  });
});
