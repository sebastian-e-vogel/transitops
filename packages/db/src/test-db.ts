import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Client } from 'pg';

const adminUrl =
  process.env.TEST_DATABASE_URL ??
  'postgres://transitops:transitops@127.0.0.1:5432/postgres';

/** Creates an empty database (from template0, so no PostGIS), migrates it and returns a client. */
export async function createTestDb() {
  const admin = new Client({ connectionString: adminUrl });
  try {
    await admin.connect();
  } catch (error) {
    throw new Error(
      'Cannot reach the test database: start it with `docker compose up -d --wait` ' +
        `or set TEST_DATABASE_URL. ${String(error)}`,
    );
  }
  const name = `transitops_test_${randomUUID().replaceAll('-', '')}`;
  await admin.query(`CREATE DATABASE ${name} WITH TEMPLATE template0`);
  const url = new URL(adminUrl);
  url.pathname = `/${name}`;
  const db = drizzle(url.toString());
  try {
    await migrate(db, {
      migrationsFolder: fileURLToPath(new URL('../drizzle', import.meta.url)),
    });
  } catch (error) {
    await db.$client.end();
    await admin.query(`DROP DATABASE ${name} WITH (FORCE)`);
    await admin.end();
    throw error;
  }
  return {
    db,
    drop: async () => {
      await db.$client.end();
      await admin.query(`DROP DATABASE ${name} WITH (FORCE)`);
      await admin.end();
    },
  };
}
