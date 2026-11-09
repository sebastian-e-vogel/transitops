import { sql } from 'drizzle-orm';
import {
  bigint,
  boolean,
  check,
  doublePrecision,
  index,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';

// Mirrors DataSourceSchema and ProviderSchema in @transitops/contracts.
export const dataSourceEnum = pgEnum('data_source', ['LIVE', 'SIMULATED']);
export const providerEnum = pgEnum('provider', ['MBTA', 'SIMULATOR']);

const timestamptz = (name: string) =>
  timestamp(name, { withTimezone: true, mode: 'date' });

export const vehicles = pgTable(
  'vehicles',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    provider: providerEnum('provider').notNull(),
    providerVehicleId: text('provider_vehicle_id').notNull(),
    createdAt: timestamptz('created_at').notNull().defaultNow(),
  },
  (t) => [unique().on(t.provider, t.providerVehicleId)],
);

// Immutable by convention: no updated_at and no update path.
export const vehiclePositions = pgTable(
  'vehicle_positions',
  {
    id: bigint('id', { mode: 'bigint' })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    vehicleId: uuid('vehicle_id')
      .notNull()
      .references(() => vehicles.id, { onDelete: 'restrict' }),
    source: dataSourceEnum('source').notNull(),
    provider: providerEnum('provider').notNull(),
    eventId: text('event_id').notNull(),
    routeId: text('route_id'),
    tripId: text('trip_id'),
    lat: doublePrecision('lat').notNull(),
    lon: doublePrecision('lon').notNull(),
    bearing: doublePrecision('bearing'),
    speedMps: doublePrecision('speed_mps'),
    observedAt: timestamptz('observed_at').notNull(),
    receivedAt: timestamptz('received_at').notNull(),
    hasProviderTimestamp: boolean('has_provider_timestamp').notNull(),
  },
  (t) => [
    unique().on(t.source, t.provider, t.eventId),
    index().on(t.vehicleId, t.observedAt.desc()),
    check(
      'vehicle_positions_source_provider_check',
      sql`(${t.source} = 'LIVE' AND ${t.provider} = 'MBTA') OR (${t.source} = 'SIMULATED' AND ${t.provider} = 'SIMULATOR')`,
    ),
  ],
);

export const vehicleCurrentState = pgTable(
  'vehicle_current_state',
  {
    vehicleId: uuid('vehicle_id')
      .notNull()
      .references(() => vehicles.id, { onDelete: 'restrict' }),
    source: dataSourceEnum('source').notNull(),
    provider: providerEnum('provider').notNull(),
    routeId: text('route_id'),
    tripId: text('trip_id'),
    lat: doublePrecision('lat').notNull(),
    lon: doublePrecision('lon').notNull(),
    bearing: doublePrecision('bearing'),
    speedMps: doublePrecision('speed_mps'),
    observedAt: timestamptz('observed_at').notNull(),
    receivedAt: timestamptz('received_at').notNull(),
    hasProviderTimestamp: boolean('has_provider_timestamp').notNull(),
    isActive: boolean('is_active').notNull().default(true),
    updatedAt: timestamptz('updated_at').notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.vehicleId, t.source] })],
);
