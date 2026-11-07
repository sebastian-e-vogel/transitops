import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const apiDir = fileURLToPath(new URL('..', import.meta.url));

// Needs a build first: `pnpm --filter @transitops/api build`.
describe('startup env validation (subprocess)', () => {
  it('exits non-zero naming the variable, without leaking its value', () => {
    const sentinel = 'SENTINEL_9f3a_NOT_A_URL';
    const result = spawnSync('node', ['dist/main'], {
      cwd: apiDir,
      env: { ...process.env, DATABASE_URL: sentinel },
      encoding: 'utf8',
      timeout: 20000,
    });
    expect(result.status).not.toBeNull();
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('DATABASE_URL');
    expect(result.stdout).not.toContain(sentinel);
    expect(result.stderr).not.toContain(sentinel);
    expect(result.stderr).not.toContain('ZodError');
  });
});
