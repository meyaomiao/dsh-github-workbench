import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('..', import.meta.url)));
const sourceRoot = join(root, 'src');

function collectSourceFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...collectSourceFiles(path));
    else if (/\.(ts|tsx)$/.test(entry.name)) files.push(path);
  }
  return files;
}

describe('source language guard', () => {
  it('keeps non-locale source free of CJK text', () => {
    const offenders: string[] = [];
    for (const file of collectSourceFiles(sourceRoot)) {
      if (file === join(sourceRoot, 'locales.ts')) continue;
      const lines = readFileSync(file, 'utf8').split(/\r?\n/);
      lines.forEach((line, index) => {
        if (/[\u3400-\u9fff]/u.test(line)) offenders.push(`${relative(root, file)}:${index + 1}`);
      });
    }
    assert.deepEqual(offenders, []);
  });
});
