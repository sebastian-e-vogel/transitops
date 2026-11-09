---
name: drizzle-db
description: Rules for changing the database in packages/db (Drizzle ORM 1.0 rc, PostgreSQL + PostGIS). Use before touching the schema, migrations or drizzle.config.ts.
---

# Drizzle in packages/db

`@transitops/db` uses drizzle-orm and drizzle-kit `1.0.0-rc.x` on PostgreSQL 17 + PostGIS. The API differs
from Drizzle 0.x: check the official docs (https://orm.drizzle.team/docs) for the 1.0 form, not memory.
Run every command from `packages/db`, or with `pnpm --filter @transitops/db <script>`.

## Layout

- `src/db/schema/`: one file per domain (`vehicles.ts`, `users.ts`, later `incidents.ts`...).
  Shared enums live in `enums.ts`. Relations, when needed, go in `src/db/relations.ts`.
- `src/db/schema/index.ts` re-exports every domain file. `drizzle.config.ts` points `schema` at this
  file, not at the folder: with the folder, drizzle-kit loads `index.ts` and the domain files, sees every
  table twice and fails. A new domain file only counts once it is added to `index.ts`.
- `drizzle/<timestamp>_<name>/migration.sql` + `snapshot.json`: generated migrations, one folder each.

## Conventions

- Table and column names in snake_case, always given as explicit strings. TypeScript keys in camelCase.
  The config sets no `casing`, so a column without an explicit name would be created in camelCase.
- Timestamps: `timestamp('created_at', { withTimezone: true, mode: 'date' })`.
- Enum values that also exist in `@transitops/contracts` must match them exactly.
- Name CHECK constraints explicitly.

## The only way to change the database

1. Edit the schema files in `src/db/schema/`.
2. Run `pnpm db:generate --name=<snake_case_description>`.
   - If it exits 2 with missing decisions (drizzle-kit can't tell a rename from a drop + create and
     there is no TTY to ask), stop and report the list. Don't guess.
3. Read the generated `migration.sql` and report it. Watch for unexpected `DROP`s.
4. Apply it only to a throwaway database (see Verifying).

Never edit a generated `migration.sql` or any `snapshot.json` by hand, and never create a migration
folder by hand. If the SQL is wrong, fix the schema, delete the folder you just generated (only if it
is uncommitted and was never applied anywhere), and generate again.

Use `pnpm db:generate --custom --name=<name>` only for what drizzle-kit cannot generate (extensions,
data backfills). That empty `migration.sql` is the one file you write by hand, and only before it is
committed or applied.

Never modify, rename or delete a migration that is committed or that has been applied to any database.
The migrator tracks applied migrations by folder name only: an edited migration is silently skipped, a
renamed one runs again, and a deleted one breaks `generate`. Fix mistakes with a new migration.

There are no down migrations. Don't write rollback scripts.

After rebasing on `develop`, run `pnpm exec drizzle-kit check`. If it reports conflicts between
migrations from different branches, stop and report.

## Forbidden

- `drizzle-kit push`, `pull` and `up`, and `generate --fix-conflicts` (it deletes migration folders).
- Running `db:migrate` against the dev database `transitops`. That is the user's call.
- Changing files under `drizzle/` through Bash (`sed`, `rm`, `mv`, `git checkout --`). The hook only
  sees Edit and Write.
- Reading `.env` files. drizzle-kit loads `.env` through `dotenv/config`, so before any drizzle-kit
  command, check with `ls -a` that no `.env` exists in `packages/db` or the repo root. If one does, stop
  and report. Pass `DATABASE_URL` inline.
- `docker compose down -v`.

## Verifying

Use a throwaway database in the compose container and drop it afterwards:

    docker exec transitops-postgres-1 psql -U transitops -d postgres -c 'CREATE DATABASE transitops_check_<slug> TEMPLATE template0'
    DATABASE_URL=postgres://transitops:transitops@127.0.0.1:5432/transitops_check_<slug> pnpm db:migrate
    docker exec transitops-postgres-1 dropdb -U transitops transitops_check_<slug>

These are the compose default credentials. If authentication fails, stop and report: the user may have
overridden them in `.env`.

- `TEMPLATE template0` guarantees an empty database without PostGIS.
- Run `db:migrate` twice: the second run must be a no-op with exit 0.
- A schema refactor that must not change the database has to make `db:generate` report no changes,
  and `git status` must show no new folder under `drizzle/`.
- Before handing over, `git diff --name-status origin/develop -- packages/db/drizzle` must show only
  `A` (added) lines.
