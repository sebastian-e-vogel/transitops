import { pgEnum } from 'drizzle-orm/pg-core';

// Mirrors DataSourceSchema and ProviderSchema in @transitops/contracts.
export const dataSourceEnum = pgEnum('data_source', ['LIVE', 'SIMULATED']);
export const providerEnum = pgEnum('provider', ['MBTA', 'SIMULATOR']);
