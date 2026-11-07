import { z } from 'zod';

// An empty string counts as unset.
const emptyToUndefined = (value: unknown) => (value === '' ? undefined : value);

const envSchema = z.object({
  PORT: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().min(1).max(65535).default(3001),
  ),
  // Optional until the first ticket that uses the database makes it required.
  DATABASE_URL: z.preprocess(emptyToUndefined, z.url().optional()),
  // Secret, backend only.
  MBTA_API_KEY: z.preprocess(emptyToUndefined, z.string().optional()),
});

export type Env = z.infer<typeof envSchema>;

export class EnvValidationError extends Error {
  constructor(readonly variables: string[]) {
    super(`Invalid environment variables: ${variables.join(', ')}`);
    this.name = 'EnvValidationError';
  }
}

/**
 * Validates the environment. On failure it throws an EnvValidationError that
 * only names the bad variables, never their values.
 */
export function parseEnv(source: NodeJS.ProcessEnv = process.env): Env {
  const result = envSchema.safeParse(source);
  if (result.success) return result.data;
  const names = new Set(result.error.issues.map((i) => String(i.path[0])));
  throw new EnvValidationError([...names]);
}
