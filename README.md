# TransitOps

A local-first observability platform for public transit. It shows vehicles on a live map, flags possible
anomalies, and lets you replay past activity or simulate events.

It starts with the [MBTA](https://www.mbta.com/) network in Boston. This is a personal project, not
affiliated with the MBTA.

**Status:** early development. There is no application code yet.

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
