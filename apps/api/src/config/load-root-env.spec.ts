import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join } from 'node:path';
import { ROOT_ENV_PATH, loadRootEnv } from './load-root-env.js';

describe('loadRootEnv', () => {
  let dir: string;
  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'env-'));
  });
  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
    delete process.env.TEST_LOAD_A;
    delete process.env.TEST_LOAD_B;
  });

  it('points at .env in the repo root, not in apps/api', () => {
    expect(basename(ROOT_ENV_PATH)).toBe('.env');
    expect(basename(dirname(dirname(ROOT_ENV_PATH)))).not.toBe('apps');
    expect(dirname(ROOT_ENV_PATH)).not.toContain('/apps/');
  });

  it('does not throw when the file is missing', () => {
    expect(() => loadRootEnv(join(dir, 'missing.env'))).not.toThrow();
  });

  it('loads values but real environment values win', () => {
    const file = join(dir, '.env');
    writeFileSync(file, 'TEST_LOAD_A=from-file\nTEST_LOAD_B=from-file\n');
    process.env.TEST_LOAD_B = 'from-env';
    loadRootEnv(file);
    expect(process.env.TEST_LOAD_A).toBe('from-file');
    expect(process.env.TEST_LOAD_B).toBe('from-env');
  });
});
