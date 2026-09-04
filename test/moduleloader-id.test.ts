import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('ModuleLoader id gate', () => {
  it('lib/client.js id and cordis.patch.yml insert.name equal package.json name', () => {
    const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as { name: string };
    const pkgName = pkg.name;

    const client = readFileSync(join(root, 'lib/client.js'), 'utf8');
    const idMatch = client.match(/window\.__ModuleLoader__\.load\(\{\s*id:\s*"([^"]+)"/);
    assert.ok(idMatch, 'lib/client.js must contain window.__ModuleLoader__.load({ id: "..." })');
    const loaderId = idMatch[1];

    const yaml = readFileSync(join(root, 'cordis.patch.yml'), 'utf8');
    const withoutComments = yaml
      .split('\n')
      .filter((line) => !/^\s*#/.test(line))
      .join('\n');
    const insertMatch = withoutComments.match(/- insert:[\s\S]*?^\s+name:\s*(\S+)/m);
    assert.ok(insertMatch, 'cordis.patch.yml must have insert name: under - insert:');
    const insertName = insertMatch[1];

    assert.equal(loaderId, pkgName);
    assert.equal(insertName, pkgName);
  });
});
