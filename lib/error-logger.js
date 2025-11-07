/**
 * Error Logger for SCI Solia Invest PWA
 * 
 * This class provides error logging capabilities with categorization,
 * severity levels, and structured output for debugging and monitoring.
 */

import { ERROR_CODES, getErrorByCode, isValidErrorCode } from './errors.js';
import { writeFile, appendFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';

export class ErrorLogger {
  constructor(options = {}) {
    this.logDirectory = options.logDirectory || join(process.cwd(), 'logs');
    this.logFileName = options.logFileName || 'error.log';
    this.consoleEnabled = options.consoleEnabled !== false; // Default to true
    this.fileEnabled = options.fileEnabled !== false; // Default to true
    this.errorHandlers = [];
  }

  /**
   * Initialize the logger (create log directory if needed)
   */
  async initialize() {
    if (this.fileEnabled && !existsSync(this.logDirectory)) {
      await mkdir(this.logDirectory, { recursive: true });
    }
  }

  /**
   * Register a custom error handler
   * @param {Function} handler - Function to call when an error is logged
   */
  registerHandler(handler) {
    if (typeof handler === 'function') {
      this.errorHandlers.push(handler);
    }
  }

  /**
   * Format error log entry
   * @param {string} code - Error code
   * @param {Object} context - Additional context
   * @returns {Object} Formatted log entry
   */
  formatLogEntry(code, context = {}) {
    const errorDetails = getErrorByCode(code);
    
    if (!errorDetails) {
      throw new Error(`Invalid error code: ${code}`);
    }

    return {
      timestamp: new Date().toISOString(),
      code: errorDetails.code,
      message: errorDetails.message,
      description: errorDetails.description,
      severity: errorDetails.severity,
      category: errorDetails.category,
      context: context,
      stack: context.stack || null
    };
  }

  /**
   * Write log entry to file
   * @param {Object} logEntry - Formatted log entry
   */
  async writeToFile(logEntry) {
    if (!this.fileEnabled) return;

    const logPath = join(this.logDirectory, this.logFileName);
    const logLine = JSON.stringify(logEntry) + '\n';

    try {
      await appendFile(logPath, logLine, 'utf8');
    } catch (error) {
      console.error('Failed to write log to file:', error);
    }
  }

  /**
   * Write log entry to console
   * @param {Object} logEntry - Formatted log entry
   */
  writeToConsole(logEntry) {
    if (!this.consoleEnabled) return;

    const { timestamp, code, message, severity, context } = logEntry;
    const consoleMethod = severity === 'critical' ? 'error' : 
                         severity === 'high' ? 'error' : 
                         severity === 'medium' ? 'warn' : 'log';

    console[consoleMethod](
      `[${timestamp}] [${severity.toUpperCase()}] ${code}: ${message}`,
      context
    );
  }

  /**
   * Call registered error handlers
   * @param {Object} logEntry - Formatted log entry
   */
  async callHandlers(logEntry) {
    for (const handler of this.errorHandlers) {
      try {
        await handler(logEntry);
      } catch (error) {
        console.error('Error handler failed:', error);
      }
    }
  }

  /**
   * Log an error
   * @param {string} code - Error code from ERROR_CODES
   * @param {Object} context - Additional context (error object, user info, etc.)
   */
  async logError(code, context = {}) {
    if (!isValidErrorCode(code)) {
      console.error(`Attempted to log invalid error code: ${code}`);
      return;
    }

    try {
      const logEntry = this.formatLogEntry(code, context);

      // Write to console
      this.writeToConsole(logEntry);

      // Write to file
      await this.writeToFile(logEntry);

      // Call custom handlers
      await this.callHandlers(logEntry);

      return logEntry;
    } catch (error) {
      console.error('Error logging failed:', error);
    }
  }

  /**
   * Log a server configuration error
   * @param {Object} context - Error context
   */
  async logServerConfigError(context = {}) {
    return this.logError('ER_SERVER_CONFIG', context);
  }

  /**
   * Log a build failure
   * @param {Object} context - Error context
   */
  async logBuildFailure(context = {}) {
    return this.logError('ER_BUILD_FAIL', context);
  }

  /**
   * Log a network issue
   * @param {Object} context - Error context
   */
  async logNetworkIssue(context = {}) {
    return this.logError('ER_NETWORK_ISSUE', context);
  }

  /**
   * Log a service worker registration failure
   * @param {Object} context - Error context
   */
  async logServiceWorkerFailure(context = {}) {
    return this.logError('ER_SW_REGISTER_FAIL', context);
  }

  /**
   * Log a manifest error
   * @param {Object} context - Error context
   */
  async logManifestError(context = {}) {
    return this.logError('ER_MANIFEST_ERROR', context);
  }

  /**
   * Log a cache strategy error
   * @param {Object} context - Error context
   */
  async logCacheStrategyError(context = {}) {
    return this.logError('ER_CACHE_STRATEGY', context);
  }

  /**
   * Get all logs from the log file
   * @returns {Promise<Array>} Array of log entries
   */
  async getLogs() {
    if (!this.fileEnabled) return [];

    const logPath = join(this.logDirectory, this.logFileName);
    
    if (!existsSync(logPath)) {
      return [];
    }

    try {
      const { readFile } = await import('fs/promises');
      const content = await readFile(logPath, 'utf8');
      const lines = content.trim().split('\n').filter(line => line);
      return lines.map(line => JSON.parse(line));
    } catch (error) {
      console.error('Failed to read logs:', error);
      return [];
    }
  }

  /**
   * Clear all logs
   */
  async clearLogs() {
    if (!this.fileEnabled) return;

    const logPath = join(this.logDirectory, this.logFileName);
    
    if (existsSync(logPath)) {
      await writeFile(logPath, '', 'utf8');
    }
  }
}

// Create and export a default instance
export const defaultLogger = new ErrorLogger();

export default ErrorLogger;
