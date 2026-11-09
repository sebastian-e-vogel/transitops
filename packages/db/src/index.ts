import { drizzle } from 'drizzle-orm/node-postgres';

export * from './db/schema/index.js';

export function createDb(url: string) {
  return drizzle(url);
}
