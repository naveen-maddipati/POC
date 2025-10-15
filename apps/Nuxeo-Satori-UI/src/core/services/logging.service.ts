/**
 * Enterprise Logging Service
 * Comprehensive logging solution with multiple levels and structured output
 * Supports console, remote logging, and performance monitoring
 */

import { Injectable } from '@angular/core';
import { environment } from '../../../../../src/environments/environment';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  source?: string;
  data?: any;
  stack?: string | undefined;
  userId?: string;
  sessionId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  private readonly maxLogEntries = 1000;
  private logEntries: LogEntry[] = [];
  private readonly logLevels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  };

  private currentLogLevel: LogLevel = environment.app.logLevel;
  private sessionId: string = this.generateSessionId();

  constructor() {
    this.info('LoggingService initialized', { 
      environment: environment.name,
      logLevel: this.currentLogLevel,
      sessionId: this.sessionId
    });
  }

  /**
   * Log debug messages (development only)
   */
  debug(message: string, data?: any, source?: string): void {
    this.log('debug', message, data, source);
  }

  /**
   * Log informational messages
   */
  info(message: string, data?: any, source?: string): void {
    this.log('info', message, data, source);
  }

  /**
   * Log warning messages
   */
  warn(message: string, data?: any, source?: string): void {
    this.log('warn', message, data, source);
  }

  /**
   * Log error messages with optional stack trace
   */
  error(message: string, error?: Error | any, source?: string): void {
    const logData = error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack
    } : error;

    this.log('error', message, logData, source, error?.stack);
  }

  /**
   * Log Nuxeo API operations
   */
  logNuxeoOperation(operation: string, params?: any, duration?: number): void {
    this.info(`Nuxeo Operation: ${operation}`, {
      operation,
      params,
      duration: duration ? `${duration}ms` : undefined,
      timestamp: new Date().toISOString()
    }, 'NuxeoService');
  }

  /**
   * Log Nuxeo API errors
   */
  logNuxeoError(operation: string, error: any, params?: any): void {
    this.error(`Nuxeo Operation Failed: ${operation}`, {
      operation,
      params,
      error: this.sanitizeError(error),
      timestamp: new Date().toISOString()
    }, 'NuxeoService');
  }

  /**
   * Log performance metrics
   */
  logPerformance(operation: string, startTime: number, endTime?: number): void {
    const duration = (endTime || performance.now()) - startTime;
    this.info(`Performance: ${operation}`, {
      operation,
      duration: `${duration.toFixed(2)}ms`,
      timestamp: new Date().toISOString()
    }, 'PerformanceMonitor');
  }

  /**
   * Get all log entries
   */
  getAllLogs(): LogEntry[] {
    return [...this.logEntries];
  }

  /**
   * Get logs by level
   */
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logEntries.filter(entry => entry.level === level);
  }

  /**
   * Get recent logs (last N entries)
   */
  getRecentLogs(count = 50): LogEntry[] {
    return this.logEntries.slice(-count);
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logEntries = [];
    this.info('Log entries cleared');
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logEntries, null, 2);
  }

  /**
   * Set current log level
   */
  setLogLevel(level: LogLevel): void {
    this.currentLogLevel = level;
    this.info(`Log level changed to: ${level}`);
  }

  /**
   * Core logging method
   */
  private log(level: LogLevel, message: string, data?: any, source?: string, stack?: string): void {
    // Check if we should log at this level
    if (this.logLevels[level] < this.logLevels[this.currentLogLevel]) {
      return;
    }

    const logEntry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      source: source || 'Unknown',
      data: data ? this.sanitizeData(data) : undefined,
      stack,
      sessionId: this.sessionId
    };

    // Add to internal log storage
    this.logEntries.push(logEntry);

    // Maintain max log entries
    if (this.logEntries.length > this.maxLogEntries) {
      this.logEntries = this.logEntries.slice(-this.maxLogEntries);
    }

    // Console output with formatting
    this.outputToConsole(logEntry);

    // In production, could send to remote logging service
    if (environment.production && level === 'error') {
      this.sendToRemoteLogging(logEntry);
    }
  }

  /**
   * Format console output with colors and structure
   */
  private outputToConsole(entry: LogEntry): void {
    const timestamp = new Date(entry.timestamp).toLocaleTimeString();
    const prefix = `[${timestamp}] [${entry.level.toUpperCase()}] [${entry.source}]`;
    
    const styles = {
      debug: 'color: #888',
      info: 'color: #2196F3',
      warn: 'color: #FF9800',
      error: 'color: #F44336; font-weight: bold'
    };

    switch (entry.level) {
      case 'debug':
        console.debug(`%c${prefix}`, styles.debug, entry.message, entry.data || '');
        break;
      case 'info':
        console.info(`%c${prefix}`, styles.info, entry.message, entry.data || '');
        break;
      case 'warn':
        console.warn(`%c${prefix}`, styles.warn, entry.message, entry.data || '');
        break;
      case 'error':
        console.error(`%c${prefix}`, styles.error, entry.message, entry.data || '');
        if (entry.stack) {
          console.error('Stack trace:', entry.stack);
        }
        break;
    }
  }

  /**
   * Sanitize data for logging (remove sensitive information)
   */
  private sanitizeData(data: any): any {
    if (!data) return data;

    const sanitized = { ...data };
    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'authorization'];
    
    for (const key of sensitiveKeys) {
      if (sanitized[key]) {
        sanitized[key] = '***REDACTED***';
      }
    }

    return sanitized;
  }

  /**
   * Sanitize error objects for logging
   */
  private sanitizeError(error: any): any {
    if (error instanceof Error) {
      return {
        name: error.name,
        message: error.message,
        stack: error.stack
      };
    }

    if (error && typeof error === 'object') {
      return this.sanitizeData(error);
    }

    return { error: String(error) };
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  /**
   * Send logs to remote logging service (placeholder for production)
   */
  private sendToRemoteLogging(entry: LogEntry): void {
    // In a real application, this would send logs to a remote service
    // like ElasticSearch, Splunk, or a cloud logging service
    if (environment.app.debug) {
      console.log('Would send to remote logging:', entry);
    }
  }
}