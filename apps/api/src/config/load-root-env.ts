import { fileURLToPath } from 'node:url';

// This file lives in apps/api/src/config (or apps/api/dist/config once built),
// so the repo root is four levels up. pnpm runs scripts from apps/api, so the
// path cannot be relative to the working directory.
export const ROOT_ENV_PATH = fileURLToPath(
  new URL('../../../../.env', import.meta.url),
);

/**
 * Loads the root .env into process.env. A missing file is fine, and values
 * already in the environment win.
 */
export function loadRootEnv(path: string = ROOT_ENV_PATH): void {
  try {
    process.loadEnvFile(path);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
  }
}
