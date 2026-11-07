import { Logger } from '@nestjs/common';

export interface Closable {
  close(): Promise<void>;
}

export const KEEPALIVE_INTERVAL_MS = 60_000;
export const SHUTDOWN_TIMEOUT_MS = 10_000;

export interface LifecycleOptions {
  shutdownTimeoutMs?: number;
  exit?: (code: number) => void;
  logger?: Pick<Logger, 'log' | 'error'>;
}

export interface Lifecycle {
  keepalive: NodeJS.Timeout;
  dispose: () => void;
  shutdown: (signal: string) => Promise<void>;
}

/**
 * Keeps the process alive and wires SIGINT/SIGTERM to a clean shutdown.
 * A standalone Nest context holds no handle, so an explicit timer is needed.
 * Nest's enableShutdownHooks() is deliberately not used: it re-raises the
 * signal after close, which would exit with 143/130 instead of 0.
 */
export function installLifecycle(
  app: Closable,
  options: LifecycleOptions = {},
): Lifecycle {
  const {
    shutdownTimeoutMs = SHUTDOWN_TIMEOUT_MS,
    exit = (code: number) => process.exit(code),
    logger = new Logger('Worker'),
  } = options;

  const keepalive = setInterval(() => {}, KEEPALIVE_INTERVAL_MS);
  let shuttingDown = false;

  const shutdown = async (signal: string): Promise<void> => {
    if (shuttingDown) return;
    shuttingDown = true;
    logger.log(`Received ${signal}, shutting down`);
    clearInterval(keepalive);

    let timer: NodeJS.Timeout | undefined;
    const timeout = new Promise<'timeout'>((resolve) => {
      timer = setTimeout(() => resolve('timeout'), shutdownTimeoutMs);
    });
    let code = 0;
    try {
      const result = await Promise.race([
        app.close().then(() => 'closed' as const),
        timeout,
      ]);
      if (result === 'timeout') {
        logger.error(
          `Shutdown did not finish within ${shutdownTimeoutMs}ms, exiting with code 1`,
        );
        code = 1;
      }
    } catch (error) {
      logger.error(`Error during shutdown: ${String(error)}`);
      code = 1;
    } finally {
      clearTimeout(timer);
    }
    exit(code);
  };

  const onSigint = () => void shutdown('SIGINT');
  const onSigterm = () => void shutdown('SIGTERM');
  process.on('SIGINT', onSigint);
  process.on('SIGTERM', onSigterm);

  const dispose = () => {
    clearInterval(keepalive);
    process.off('SIGINT', onSigint);
    process.off('SIGTERM', onSigterm);
  };

  return { keepalive, dispose, shutdown };
}
