/**
 * Client-side logger that doesn't use Node.js dependencies
 * Falls back to console logging when running in the browser
 */

interface LogContext {
  [key: string]: unknown;
}

interface ClientLogger {
  info: (message: string, context?: LogContext) => void;
  error: (message: string, context?: LogContext) => void;
  warn: (message: string, context?: LogContext) => void;
  debug: (message: string, context?: LogContext) => void;
  http: (message: string, context?: LogContext) => void;
  performance: (
    operation: string,
    duration: number,
    metadata?: LogContext
  ) => void;
  startTimer: (operation: string, metadata?: LogContext) => string;
  endTimer: (timerId: string) => void;
}

// Simple timer tracking for performance monitoring
const timers = new Map<
  string,
  { startTime: number; operation: string; metadata?: LogContext }
>();

const createClientLogger = (): ClientLogger => {
  const log = (level: string, message: string, context?: LogContext) => {
    const timestamp = new Date().toISOString();

    // Use appropriate console method based on level
    switch (level) {
      case 'error':
        console.error(`[${timestamp}] ERROR: ${message}`, context || '');
        break;
      case 'warn':
        console.warn(`[${timestamp}] WARN: ${message}`, context || '');
        break;
      case 'debug':
        console.debug(`[${timestamp}] DEBUG: ${message}`, context || '');
        break;
      case 'http':
        console.log(`[${timestamp}] HTTP: ${message}`, context || '');
        break;
      default:
        console.log(`[${timestamp}] INFO: ${message}`, context || '');
    }
  };

  return {
    info: (message: string, context?: LogContext) =>
      log('info', message, context),
    error: (message: string, context?: LogContext) =>
      log('error', message, context),
    warn: (message: string, context?: LogContext) =>
      log('warn', message, context),
    debug: (message: string, context?: LogContext) =>
      log('debug', message, context),
    http: (message: string, context?: LogContext) =>
      log('http', message, context),
    performance: (
      operation: string,
      duration: number,
      metadata?: LogContext,
    ) => {
      log(
        'info',
        `Performance: ${operation} completed in ${duration}ms`,
        metadata,
      );
    },
    startTimer: (operation: string, metadata?: LogContext): string => {
      const timerId = `${operation}_${Date.now()}_${Math.random()}`;
      timers.set(timerId, {
        startTime: performance.now(),
        operation,
        metadata,
      });
      return timerId;
    },
    endTimer: (timerId: string): void => {
      const timer = timers.get(timerId);
      if (timer) {
        const duration = performance.now() - timer.startTime;
        log(
          'info',
          `Timer: ${timer.operation} completed in ${duration.toFixed(2)}ms`,
          timer.metadata,
        );
        timers.delete(timerId);
      }
    },
  };
};

export const clientLogger = createClientLogger();
