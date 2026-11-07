# TransitOps

A local-first observability platform for public transit. It shows vehicles on a live map, flags possible
anomalies, and lets you replay past activity or simulate events.

It starts with the [MBTA](https://www.mbta.com/) network in Boston. This is a personal project, not
affiliated with the MBTA.

**Status:** early development.

## Prerequisites

- Node.js 24 (`>=24 <25`). The exact version used is in `.nvmrc` (`24.22.2`). With nvm: `nvm install && nvm use`.
- pnpm 12.18.0, pinned in `package.json` (`packageManager`). Install it with one of:
  - `npm install -g pnpm@12.18.0`
  - `corepack enable` (corepack then uses the pinned version automatically)

Installing on another Node major version fails with `ERR_PNPM_UNSUPPORTED_ENGINE`.

## Setup

```sh
nvm use
pnpm install
```

## Environment variables

Backend configuration lives in a root `.env` file. It is gitignored; `.env.example` is the template.

```sh
cp .env.example .env
```

The API loads the root `.env` on start (`start:dev` and `start:prod`). The file is optional, and variables
already set in the environment win over it. Values are validated at startup: if one is invalid, the API
prints the variable name (never its value) and exits with code 1. An empty value counts as unset.

| Variable                                                             | Used by        | Notes                                                                                         |
| -------------------------------------------------------------------- | -------------- | --------------------------------------------------------------------------------------------- |
| `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `POSTGRES_PORT` | Docker Compose | Defaults as in `docker-compose.yml`. `POSTGRES_PASSWORD` is secret.                           |
| `PORT`                                                               | API            | Optional, default `3001`.                                                                     |
| `DATABASE_URL`                                                       | API            | Optional for now, must be a valid URL when set. Contains the password, so treat it as secret. |
| `MBTA_API_KEY`                                                       | API            | Optional, secret, backend only. Not used yet.                                                 |

Web variables do not come from the root file: Next.js only loads env files from `apps/web`.

## Database

PostgreSQL with PostGIS runs in Docker. Docker must be running.

```sh
docker compose up -d --wait   # start and wait until healthy
docker compose down           # stop, keeps the data volume
```

The image (`postgis/postgis:17-3.5`) has no arm64 build, so on Apple Silicon it runs emulated
(`platform: linux/amd64`) and the first start is slow.

Defaults, overridable with environment variables: `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
(all `transitops`) and `POSTGRES_PORT` (`5432`). The port is bound to `127.0.0.1` only. The Compose
project is named `transitops`, so every worktree shares one database and one port.

`POSTGRES_PASSWORD` (like the user and database name) only applies on first init of the volume. Changing
it later needs a new volume, which deletes the data: `docker compose down -v`.

## API

`apps/api` is a NestJS app (ESM, tested with Vitest). It listens on port 3001 unless `PORT` is set. All routes live under the `/api/v1` prefix (set in `configureApp`). `GET /api/v1/health` returns `{ "status": "ok" }`.

```sh
pnpm --filter @transitops/api start:dev   # dev mode with watch, http://localhost:3001
pnpm --filter @transitops/api build
pnpm --filter @transitops/api start:prod  # runs dist/main, build first
pnpm --filter @transitops/api test        # unit tests
pnpm --filter @transitops/api test:e2e    # e2e tests
pnpm --filter @transitops/api lint        # type-aware oxlint
pnpm --filter @transitops/api format      # write Prettier formatting
pnpm --filter @transitops/api format:check
```

## Worker

`apps/worker` is a NestJS standalone application context (no HTTP, ESM, tested with Vitest). It is empty for now: it logs on startup, stays alive with a keepalive timer, and shuts down cleanly on SIGINT or SIGTERM (exit code 0; if shutdown hangs past the 10 second timeout or fails, it logs an error and exits 1). It needs no environment variables.

```sh
pnpm --filter @transitops/worker start:dev   # dev mode with watch
pnpm --filter @transitops/worker build
pnpm --filter @transitops/worker start:prod  # runs dist/main, build first
pnpm --filter @transitops/worker test
pnpm --filter @transitops/worker lint
pnpm --filter @transitops/worker format      # write Prettier formatting
pnpm --filter @transitops/worker format:check
```

## Contracts

`packages/contracts` (`@transitops/contracts`) holds the Zod schemas shared by the apps (ESM, tested with Vitest). It currently exports `DataSourceSchema`, `ProviderSchema` and `VehicleObservationSchema` with their inferred types. Timestamps (`observedAt`, `receivedAt`) must be ISO 8601 UTC with a `Z` suffix; converting provider offsets such as `-05:00` is the normalizer's job.

Its exports point at `dist`, which is gitignored. Build it with:

```sh
pnpm --filter @transitops/contracts build
```

Dependents must build it first (for their own build, tests and type checks). To build everything a package depends on, without the package itself:

```sh
pnpm --filter "<dependent>^..." build
```

```sh
pnpm --filter @transitops/contracts test
pnpm --filter @transitops/contracts lint
pnpm --filter @transitops/contracts format      # write Prettier formatting
pnpm --filter @transitops/contracts format:check
```

## Web

`apps/web` is a Next.js app (App Router, tested with Vitest). It listens on port 3000 by default.

```sh
pnpm --filter @transitops/web dev           # dev server, http://localhost:3000
pnpm --filter @transitops/web build
pnpm --filter @transitops/web start         # serves the build, build first
pnpm --filter @transitops/web test
pnpm --filter @transitops/web lint
pnpm --filter @transitops/web format        # write Prettier formatting
pnpm --filter @transitops/web format:check
```
