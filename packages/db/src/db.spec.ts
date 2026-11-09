import { DataSourceSchema, ProviderSchema } from '@transitops/contracts';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  dataSourceEnum,
  providerEnum,
  users,
  vehiclePositions,
  vehicles,
} from './index.js';
import { createTestDb } from './test-db.js';

let test: Awaited<ReturnType<typeof createTestDb>>;
beforeAll(async () => {
  test = await createTestDb();
});
afterAll(async () => {
  await test?.drop();
});

const observedAt = new Date('2026-01-15T17:00:00.000Z');
const receivedAt = new Date('2026-01-15T17:00:02.123Z');

async function insertVehicle(providerVehicleId: string) {
  const [vehicle] = await test.db
    .insert(vehicles)
    .values({ provider: 'MBTA', providerVehicleId })
    .returning();
  return vehicle!;
}

const position = (
  vehicleId: string,
  overrides: Partial<typeof vehiclePositions.$inferInsert> = {},
): typeof vehiclePositions.$inferInsert => ({
  vehicleId,
  source: 'LIVE',
  provider: 'MBTA',
  eventId: 'evt-1',
  lat: 42.35,
  lon: -71.06,
  bearing: 90.5,
  speedMps: 5.25,
  observedAt,
  receivedAt,
  hasProviderTimestamp: true,
  ...overrides,
});

describe('db', () => {
  it('applies the migrations to an empty database, with PostGIS', async () => {
    const result = await test.db.$client.query(
      'select postgis_version() as version',
    );
    expect(result.rows[0]?.version).toMatch(/^\d/);
  });

  it('round-trips a vehicle and a position', async () => {
    const vehicle = await insertVehicle('y-roundtrip');
    expect(vehicle.createdAt).toBeInstanceOf(Date);
    await test.db
      .insert(vehiclePositions)
      .values(position(vehicle.id, { eventId: 'evt-roundtrip' }));

    const rows = await test.db.select().from(vehiclePositions);
    const row = rows.find((r) => r.eventId === 'evt-roundtrip');
    expect(row).toMatchObject({
      lat: 42.35,
      lon: -71.06,
      bearing: 90.5,
      speedMps: 5.25,
      routeId: null,
    });
    expect(row?.observedAt).toEqual(observedAt);
    expect(row?.receivedAt).toEqual(receivedAt);
  });

  it('rejects a duplicate (source, provider, event_id)', async () => {
    const vehicle = await insertVehicle('y-dup');
    const values = position(vehicle.id, { eventId: 'evt-dup' });
    await test.db.insert(vehiclePositions).values(values);
    await expect(
      test.db.insert(vehiclePositions).values(values),
    ).rejects.toMatchObject({ cause: { code: '23505' } });
  });

  it('rejects a LIVE/SIMULATOR position', async () => {
    const vehicle = await insertVehicle('y-check');
    await expect(
      test.db
        .insert(vehiclePositions)
        .values(position(vehicle.id, { provider: 'SIMULATOR' })),
    ).rejects.toMatchObject({
      cause: {
        code: '23514',
        constraint: 'vehicle_positions_source_provider_check',
      },
    });
  });

  it('rejects a duplicate users.email', async () => {
    const user = { name: 'Ada', lastName: 'Lovelace', email: 'ada@example.com' };
    await test.db.insert(users).values(user);
    await expect(test.db.insert(users).values(user)).rejects.toMatchObject({
      cause: { code: '23505' },
    });
  });

  it('keeps its enums equal to @transitops/contracts', () => {
    expect(dataSourceEnum.enumValues).toEqual(DataSourceSchema.options);
    expect(providerEnum.enumValues).toEqual(ProviderSchema.options);
  });
});
