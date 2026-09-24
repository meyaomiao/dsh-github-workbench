import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { patchIssue } from '../src/api.ts';
import { setLocale } from '../src/locales.ts';

describe('GitHub API errors', () => {
  it('uses a localized fallback for HTTP 422 without upstream detail', async () => {
    const originalFetch = globalThis.fetch;
    setLocale('en');
    globalThis.fetch = (async () => ({
      ok: false,
      status: 422,
      headers: { get: () => null },
      json: async () => ({}),
    })) as unknown as typeof fetch;
    try {
      await assert.rejects(
        () => patchIssue({ owner: 'octo', repo: 'workbench' }, 17, { state: 'closed' }),
        (error: unknown) => {
          assert.ok(error instanceof Error);
          assert.equal(error.message, 'Request rejected by GitHub (HTTP 422): GitHub provided no details.');
          return true;
        },
      );
    } finally {
      globalThis.fetch = originalFetch;
      setLocale('en');
    }
  });
});
