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

## API

`apps/api` is a NestJS app (ESM, tested with Vitest). It listens on port 3001 unless `PORT` is set.

```sh
pnpm --filter @transitops/api start:dev   # dev mode with watch, http://localhost:3001
pnpm --filter @transitops/api build
pnpm --filter @transitops/api start:prod  # runs dist/main, build first
pnpm --filter @transitops/api test        # unit tests
pnpm --filter @transitops/api test:e2e    # e2e tests
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
