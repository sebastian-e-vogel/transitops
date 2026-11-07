# TransitOps

Local-first public transit observability platform: real-time vehicles, incident detection, historical
replay and event simulation.

Application code is just starting: only the `apps/api` NestJS starter exists. M0 was validated in a
separate prototype that is not part of this repo, so work starts at M1.

## Architecture

pnpm monorepo. This is the planned layout: if something doesn't exist yet, don't assume it does.

- `apps/web`: Next.js dashboard with a MapLibre map.
- `apps/api`: NestJS modular monolith, REST and WebSocket gateway.
- `apps/worker`: NestJS standalone process for MBTA ingestion and simulation.
- `packages/contracts`: Zod schemas shared by the apps.
- `packages/db`: Drizzle schema and migrations, on PostgreSQL + PostGIS.
- `packages/config`: shared TypeScript and lint config.
- `docker-compose.yml`: local infrastructure.

Data flow: MBTA or simulator → worker → PostgreSQL → API → browser (REST snapshot, then WebSocket
deltas). Redis and BullMQ are added only when a ticket needs them.

## Rules

- Everything is in English: code, commits, tickets, PRs, UI and conversation.
- Never modify anything inside `node_modules`.
- Never read `.env` files. Never commit secrets.
- `develop` is the base branch: work branches from it and PRs target it.
- Never push to `main` or `develop`, force-push or merge a PR. The user merges.
- GitHub is the source of truth for ticket status.

## Docs

`.docs/` is local and gitignored. It holds the product plan, the detailed architecture and the feature catalog with its IDs. It does not exist in agent worktrees.

## GitHub

Repository: https://github.com/sebastian-e-vogel/transitops

Board: https://github.com/users/sebastian-e-vogel/projects/1 (owner `sebastian-e-vogel`, project number
`1`). Status column values: Todo, In Progress, In Review, Done.

Labels: `backend`, `frontend`.
