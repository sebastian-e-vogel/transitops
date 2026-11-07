import { afterEach, describe, expect, it, vi } from 'vitest';
import { installLifecycle } from './lifecycle.js';

const logger = { log: vi.fn(), error: vi.fn() };
let dispose: (() => void) | undefined;

afterEach(() => {
  dispose?.();
  vi.useRealTimers();
  vi.clearAllMocks();
});

describe('installLifecycle', () => {
  it('closes the app and exits 0', async () => {
    const app = { close: vi.fn().mockResolvedValue(undefined) };
    const exit = vi.fn();
    const handle = installLifecycle(app, { exit, logger });
    dispose = handle.dispose;
    await handle.shutdown('SIGTERM');
    expect(app.close).toHaveBeenCalledOnce();
    expect(exit).toHaveBeenCalledWith(0);
  });

  it('only shuts down once', async () => {
    const app = { close: vi.fn().mockResolvedValue(undefined) };
    const exit = vi.fn();
    const handle = installLifecycle(app, { exit, logger });
    dispose = handle.dispose;
    await handle.shutdown('SIGINT');
    await handle.shutdown('SIGTERM');
    expect(app.close).toHaveBeenCalledOnce();
  });

  it('exits 1 once when close hangs past the timeout', async () => {
    vi.useFakeTimers();
    const app = { close: vi.fn().mockReturnValue(new Promise(() => {})) };
    const exit = vi.fn();
    const handle = installLifecycle(app, {
      exit,
      logger,
      shutdownTimeoutMs: 50,
    });
    dispose = handle.dispose;
    const done = handle.shutdown('SIGTERM');
    await vi.advanceTimersByTimeAsync(50);
    await done;
    expect(exit).toHaveBeenCalledOnce();
    expect(exit).toHaveBeenCalledWith(1);
    expect(logger.error).toHaveBeenCalled();
  });

  it('exits 1 when close throws', async () => {
    const app = { close: vi.fn().mockRejectedValue(new Error('boom')) };
    const exit = vi.fn();
    const handle = installLifecycle(app, { exit, logger });
    dispose = handle.dispose;
    await handle.shutdown('SIGTERM');
    expect(exit).toHaveBeenCalledWith(1);
  });

  it('holds a ref-ed keepalive timer', () => {
    const handle = installLifecycle(
      { close: vi.fn() },
      { exit: vi.fn(), logger },
    );
    dispose = handle.dispose;
    expect(handle.keepalive.hasRef()).toBe(true);
  });
});
