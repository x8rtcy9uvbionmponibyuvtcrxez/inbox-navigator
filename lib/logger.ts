/**
 * Structured logging system for better debugging and monitoring
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

export interface LogContext {
  userId?: string;
  sessionId?: string;
  orderId?: string;
  workspaceId?: string;
  clientId?: string;
  requestId?: string;
  userAgent?: string;
  ip?: string;
  [key: string]: any;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  metadata?: Record<string, any>;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isProduction = process.env.NODE_ENV === 'production';

  private formatLog(level: LogLevel, message: string, context?: LogContext, error?: Error, metadata?: Record<string, any>): LogEntry {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      metadata
    };

    if (error) {
      logEntry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack
      };
    }

    return logEntry;
  }

  private shouldLog(level: LogLevel): boolean {
    if (this.isDevelopment) {
      return true; // Log everything in development
    }

    if (this.isProduction) {
      // In production, only log INFO and above
      return level === LogLevel.INFO || level === LogLevel.WARN || level === LogLevel.ERROR;
    }

    return true;
  }

  private output(level: LogLevel, message: string, context?: LogContext, error?: Error, metadata?: Record<string, any>): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const logEntry = this.formatLog(level, message, context, error, metadata);

    if (this.isDevelopment) {
      // Pretty print in development
      const emoji = {
        [LogLevel.DEBUG]: '🐛',
        [LogLevel.INFO]: 'ℹ️',
        [LogLevel.WARN]: '⚠️',
        [LogLevel.ERROR]: '❌'
      }[level];

      console.log(`${emoji} [${logEntry.timestamp}] ${message}`, {
        context: logEntry.context,
        error: logEntry.error,
        metadata: logEntry.metadata
      });
    } else {
      // JSON format in production for log aggregation
      console.log(JSON.stringify(logEntry));
    }
  }

  debug(message: string, context?: LogContext, metadata?: Record<string, any>): void {
    this.output(LogLevel.DEBUG, message, context, undefined, metadata);
  }

  info(message: string, context?: LogContext, metadata?: Record<string, any>): void {
    this.output(LogLevel.INFO, message, context, undefined, metadata);
  }

  warn(message: string, context?: LogContext, metadata?: Record<string, any>): void {
    this.output(LogLevel.WARN, message, context, undefined, metadata);
  }

  error(message: string, error?: Error, context?: LogContext, metadata?: Record<string, any>): void {
    this.output(LogLevel.ERROR, message, context, error, metadata);
  }

  // Convenience methods for common scenarios
  apiRequest(method: string, path: string, context?: LogContext, metadata?: Record<string, any>): void {
    this.info(`API Request: ${method} ${path}`, context, metadata);
  }

  apiResponse(method: string, path: string, statusCode: number, duration: number, context?: LogContext): void {
    this.info(`API Response: ${method} ${path} - ${statusCode} (${duration}ms)`, context);
  }

  apiError(method: string, path: string, error: Error, statusCode: number, context?: LogContext): void {
    this.error(`API Error: ${method} ${path} - ${statusCode}`, error, context);
  }

  databaseQuery(operation: string, table: string, duration: number, context?: LogContext): void {
    this.debug(`Database Query: ${operation} on ${table} (${duration}ms)`, context);
  }

  databaseError(operation: string, table: string, error: Error, context?: LogContext): void {
    this.error(`Database Error: ${operation} on ${table}`, error, context);
  }

  userAction(action: string, userId: string, context?: LogContext, metadata?: Record<string, any>): void {
    this.info(`User Action: ${action}`, { ...context, userId }, metadata);
  }

  businessEvent(event: string, context?: LogContext, metadata?: Record<string, any>): void {
    this.info(`Business Event: ${event}`, context, metadata);
  }

  securityEvent(event: string, context?: LogContext, metadata?: Record<string, any>): void {
    this.warn(`Security Event: ${event}`, context, metadata);
  }

  performanceMetric(metric: string, value: number, unit: string, context?: LogContext): void {
    this.info(`Performance: ${metric} = ${value}${unit}`, context);
  }
}

// Export singleton instance
export const logger = new Logger();

// Export convenience functions
export const log = {
  debug: (message: string, context?: LogContext, metadata?: Record<string, any>) => logger.debug(message, context, metadata),
  info: (message: string, context?: LogContext, metadata?: Record<string, any>) => logger.info(message, context, metadata),
  warn: (message: string, context?: LogContext, metadata?: Record<string, any>) => logger.warn(message, context, metadata),
  error: (message: string, error?: Error, context?: LogContext, metadata?: Record<string, any>) => logger.error(message, error, context, metadata),
  apiRequest: (method: string, path: string, context?: LogContext, metadata?: Record<string, any>) => logger.apiRequest(method, path, context, metadata),
  apiResponse: (method: string, path: string, statusCode: number, duration: number, context?: LogContext) => logger.apiResponse(method, path, statusCode, duration, context),
  apiError: (method: string, path: string, error: Error, statusCode: number, context?: LogContext) => logger.apiError(method, path, error, statusCode, context),
  databaseQuery: (operation: string, table: string, duration: number, context?: LogContext) => logger.databaseQuery(operation, table, duration, context),
  databaseError: (operation: string, table: string, error: Error, context?: LogContext) => logger.databaseError(operation, table, error, context),
  userAction: (action: string, userId: string, context?: LogContext, metadata?: Record<string, any>) => logger.userAction(action, userId, context, metadata),
  businessEvent: (event: string, context?: LogContext, metadata?: Record<string, any>) => logger.businessEvent(event, context, metadata),
  securityEvent: (event: string, context?: LogContext, metadata?: Record<string, any>) => logger.securityEvent(event, context, metadata),
  performanceMetric: (metric: string, value: number, unit: string, context?: LogContext) => logger.performanceMetric(metric, value, unit, context)
};
