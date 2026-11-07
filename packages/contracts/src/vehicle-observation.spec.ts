import { describe, expect, it } from 'vitest';
import { VehicleObservationSchema } from './index.js';

const valid = {
  eventId: 'evt-1',
  source: 'LIVE',
  provider: 'MBTA',
  providerVehicleId: 'y1234',
  routeId: 'Red',
  tripId: 'trip-1',
  lat: 42.35,
  lon: -71.06,
  bearing: 90,
  speedMps: 5.5,
  observedAt: '2026-01-15T17:00:00Z',
  receivedAt: '2026-01-15T17:00:02.123Z',
  hasProviderTimestamp: true,
};

const ok = (o: unknown) => VehicleObservationSchema.safeParse(o).success;

describe('VehicleObservationSchema', () => {
  it('accepts a valid observation', () => {
    expect(VehicleObservationSchema.parse(valid)).toEqual(valid);
  });

  it('accepts a valid simulated observation', () => {
    expect(ok({ ...valid, source: 'SIMULATED', provider: 'SIMULATOR' })).toBe(
      true,
    );
  });

  it('accepts null optionals', () => {
    expect(
      ok({
        ...valid,
        routeId: null,
        tripId: null,
        bearing: null,
        speedMps: null,
      }),
    ).toBe(true);
  });

  it.each([
    ['lat', 90.1],
    ['lat', -90.1],
    ['lon', 180.1],
    ['lon', -180.1],
    ['bearing', 360.1],
    ['bearing', -1],
    ['speedMps', -0.1],
  ])('rejects out-of-range %s = %s', (field, value) => {
    expect(ok({ ...valid, [field]: value })).toBe(false);
  });

  it('accepts boundary values', () => {
    expect(
      ok({ ...valid, lat: -90, lon: 180, bearing: 360, speedMps: 0 }),
    ).toBe(true);
  });

  it('rejects an empty eventId', () => {
    expect(ok({ ...valid, eventId: '' })).toBe(false);
  });

  it('rejects empty providerVehicleId, routeId and tripId', () => {
    expect(ok({ ...valid, providerVehicleId: '' })).toBe(false);
    expect(ok({ ...valid, routeId: '' })).toBe(false);
    expect(ok({ ...valid, tripId: '' })).toBe(false);
  });

  it('rejects an unknown source', () => {
    expect(ok({ ...valid, source: 'REPLAY' })).toBe(false);
  });

  it('rejects LIVE + SIMULATOR', () => {
    expect(ok({ ...valid, source: 'LIVE', provider: 'SIMULATOR' })).toBe(false);
  });

  it('rejects SIMULATED + MBTA', () => {
    expect(ok({ ...valid, source: 'SIMULATED', provider: 'MBTA' })).toBe(false);
  });

  it('rejects a -05:00 offset timestamp', () => {
    expect(ok({ ...valid, observedAt: '2026-01-15T12:00:00-05:00' })).toBe(
      false,
    );
    expect(ok({ ...valid, receivedAt: '2026-01-15T12:00:00-05:00' })).toBe(
      false,
    );
  });

  it('rejects an impossible date', () => {
    expect(ok({ ...valid, observedAt: '2026-02-30T12:00:00Z' })).toBe(false);
    expect(ok({ ...valid, receivedAt: '2026-13-01T12:00:00Z' })).toBe(false);
  });

  it('rejects a missing hasProviderTimestamp', () => {
    const { hasProviderTimestamp: _omit, ...rest } = valid;
    expect(ok(rest)).toBe(false);
  });
});
