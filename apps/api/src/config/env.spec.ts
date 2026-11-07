import { EnvValidationError, parseEnv } from './env.js';

describe('parseEnv', () => {
  it('accepts valid values', () => {
    expect(
      parseEnv({
        PORT: '4000',
        DATABASE_URL: 'postgres://u:p@localhost:5432/db',
        MBTA_API_KEY: 'key',
      }),
    ).toEqual({
      PORT: 4000,
      DATABASE_URL: 'postgres://u:p@localhost:5432/db',
      MBTA_API_KEY: 'key',
    });
  });

  it('defaults PORT and leaves the other optionals unset', () => {
    expect(parseEnv({})).toEqual({ PORT: 3001 });
  });

  it('treats empty strings as unset', () => {
    expect(parseEnv({ PORT: '', DATABASE_URL: '', MBTA_API_KEY: '' })).toEqual({
      PORT: 3001,
    });
  });

  it.each(['abc', '0', '70000', '1.5', '-1'])('rejects PORT=%s', (port) => {
    expect(() => parseEnv({ PORT: port })).toThrow(EnvValidationError);
  });

  it('rejects an invalid DATABASE_URL', () => {
    expect(() => parseEnv({ DATABASE_URL: 'not a url' })).toThrow(
      EnvValidationError,
    );
  });

  it('names every bad variable once and never leaks the value', () => {
    const sentinel = 'SENTINEL_SECRET_VALUE';
    let error: unknown;
    try {
      parseEnv({ PORT: sentinel, DATABASE_URL: sentinel });
    } catch (e) {
      error = e;
    }
    expect(error).toBeInstanceOf(EnvValidationError);
    const err = error as EnvValidationError;
    expect([...err.variables].sort()).toEqual(['DATABASE_URL', 'PORT']);
    expect(err.message).toContain('DATABASE_URL');
    expect(err.message).not.toContain(sentinel);
  });
});
