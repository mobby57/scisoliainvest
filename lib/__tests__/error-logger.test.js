/**
 * Unit tests for the error handling system
 * Testing errors.js and error-logger.js
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { 
  ERROR_CODES, 
  getErrorByCode, 
  getErrorsByCategory, 
  getErrorsBySeverity, 
  isValidErrorCode 
} from '../errors.js';
import { ErrorLogger } from '../error-logger.js';
import { existsSync } from 'fs';
import { rm, readFile } from 'fs/promises';
import { join } from 'path';

describe('Error Codes (errors.js)', () => {
  describe('ERROR_CODES', () => {
    it('should contain all required error codes', () => {
      expect(ERROR_CODES).toHaveProperty('ER_SERVER_CONFIG');
      expect(ERROR_CODES).toHaveProperty('ER_BUILD_FAIL');
      expect(ERROR_CODES).toHaveProperty('ER_NETWORK_ISSUE');
      expect(ERROR_CODES).toHaveProperty('ER_SW_REGISTER_FAIL');
      expect(ERROR_CODES).toHaveProperty('ER_MANIFEST_ERROR');
      expect(ERROR_CODES).toHaveProperty('ER_CACHE_STRATEGY');
    });

    it('should have correct structure for each error code', () => {
      Object.values(ERROR_CODES).forEach(error => {
        expect(error).toHaveProperty('code');
        expect(error).toHaveProperty('message');
        expect(error).toHaveProperty('description');
        expect(error).toHaveProperty('severity');
        expect(error).toHaveProperty('category');
      });
    });

    it('should have valid severity levels', () => {
      const validSeverities = ['critical', 'high', 'medium', 'low'];
      Object.values(ERROR_CODES).forEach(error => {
        expect(validSeverities).toContain(error.severity);
      });
    });

    it('should have valid categories', () => {
      const validCategories = ['server', 'build', 'network', 'pwa'];
      Object.values(ERROR_CODES).forEach(error => {
        expect(validCategories).toContain(error.category);
      });
    });
  });

  describe('getErrorByCode', () => {
    it('should return error details for valid code', () => {
      const error = getErrorByCode('ER_SERVER_CONFIG');
      expect(error).toBeDefined();
      expect(error.code).toBe('ER_SERVER_CONFIG');
      expect(error.message).toBe('Problème de configuration du serveur');
    });

    it('should return null for invalid code', () => {
      const error = getErrorByCode('INVALID_CODE');
      expect(error).toBeNull();
    });
  });

  describe('getErrorsByCategory', () => {
    it('should return all PWA errors', () => {
      const pwaErrors = getErrorsByCategory('pwa');
      expect(pwaErrors.length).toBeGreaterThan(0);
      pwaErrors.forEach(error => {
        expect(error.category).toBe('pwa');
      });
    });

    it('should return all server errors', () => {
      const serverErrors = getErrorsByCategory('server');
      expect(serverErrors.length).toBeGreaterThan(0);
      serverErrors.forEach(error => {
        expect(error.category).toBe('server');
      });
    });

    it('should return empty array for non-existent category', () => {
      const errors = getErrorsByCategory('non-existent');
      expect(errors).toEqual([]);
    });
  });

  describe('getErrorsBySeverity', () => {
    it('should return all critical errors', () => {
      const criticalErrors = getErrorsBySeverity('critical');
      expect(criticalErrors.length).toBeGreaterThan(0);
      criticalErrors.forEach(error => {
        expect(error.severity).toBe('critical');
      });
    });

    it('should return all high severity errors', () => {
      const highErrors = getErrorsBySeverity('high');
      expect(highErrors.length).toBeGreaterThan(0);
      highErrors.forEach(error => {
        expect(error.severity).toBe('high');
      });
    });

    it('should return empty array for non-existent severity', () => {
      const errors = getErrorsBySeverity('non-existent');
      expect(errors).toEqual([]);
    });
  });

  describe('isValidErrorCode', () => {
    it('should return true for valid error codes', () => {
      expect(isValidErrorCode('ER_SERVER_CONFIG')).toBe(true);
      expect(isValidErrorCode('ER_BUILD_FAIL')).toBe(true);
      expect(isValidErrorCode('ER_NETWORK_ISSUE')).toBe(true);
    });

    it('should return false for invalid error codes', () => {
      expect(isValidErrorCode('INVALID_CODE')).toBe(false);
      expect(isValidErrorCode('')).toBe(false);
      expect(isValidErrorCode(null)).toBe(false);
    });
  });
});

describe('ErrorLogger (error-logger.js)', () => {
  let logger;
  const testLogDir = '/tmp/test-error-logs';
  const testLogFile = 'test-error.log';

  beforeEach(async () => {
    logger = new ErrorLogger({
      logDirectory: testLogDir,
      logFileName: testLogFile,
      consoleEnabled: false, // Disable console for tests
      fileEnabled: true
    });
    await logger.initialize();
  });

  afterEach(async () => {
    // Clean up test logs
    if (existsSync(testLogDir)) {
      await rm(testLogDir, { recursive: true, force: true });
    }
  });

  describe('Initialization', () => {
    it('should create log directory on initialize', async () => {
      expect(existsSync(testLogDir)).toBe(true);
    });

    it('should have default configuration values', () => {
      const defaultLogger = new ErrorLogger();
      expect(defaultLogger.consoleEnabled).toBe(true);
      expect(defaultLogger.fileEnabled).toBe(true);
    });
  });

  describe('formatLogEntry', () => {
    it('should format log entry correctly', () => {
      const context = { test: 'value', userId: 123 };
      const logEntry = logger.formatLogEntry('ER_SERVER_CONFIG', context);

      expect(logEntry).toHaveProperty('timestamp');
      expect(logEntry).toHaveProperty('code', 'ER_SERVER_CONFIG');
      expect(logEntry).toHaveProperty('message');
      expect(logEntry).toHaveProperty('description');
      expect(logEntry).toHaveProperty('severity');
      expect(logEntry).toHaveProperty('category');
      expect(logEntry.context).toEqual(context);
    });

    it('should throw error for invalid code', () => {
      expect(() => {
        logger.formatLogEntry('INVALID_CODE');
      }).toThrow('Invalid error code: INVALID_CODE');
    });

    it('should include timestamp in ISO format', () => {
      const logEntry = logger.formatLogEntry('ER_NETWORK_ISSUE');
      expect(logEntry.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });

  describe('logError', () => {
    it('should log error with valid code', async () => {
      const context = { detail: 'Test error' };
      const logEntry = await logger.logError('ER_SERVER_CONFIG', context);

      expect(logEntry).toBeDefined();
      expect(logEntry.code).toBe('ER_SERVER_CONFIG');
      expect(logEntry.context).toEqual(context);
    });

    it('should write log to file', async () => {
      await logger.logError('ER_BUILD_FAIL', { test: true });

      const logPath = join(testLogDir, testLogFile);
      expect(existsSync(logPath)).toBe(true);

      const content = await readFile(logPath, 'utf8');
      expect(content).toContain('ER_BUILD_FAIL');
    });

    it('should handle invalid error code gracefully', async () => {
      const result = await logger.logError('INVALID_CODE');
      expect(result).toBeUndefined();
    });

    it('should append multiple logs to file', async () => {
      await logger.logError('ER_SERVER_CONFIG');
      await logger.logError('ER_NETWORK_ISSUE');
      await logger.logError('ER_BUILD_FAIL');

      const logs = await logger.getLogs();
      expect(logs.length).toBe(3);
    });
  });

  describe('Specific error logging methods', () => {
    it('should log server config error', async () => {
      const logEntry = await logger.logServerConfigError({ port: 3000 });
      expect(logEntry.code).toBe('ER_SERVER_CONFIG');
      expect(logEntry.context.port).toBe(3000);
    });

    it('should log build failure', async () => {
      const logEntry = await logger.logBuildFailure({ file: 'index.ts' });
      expect(logEntry.code).toBe('ER_BUILD_FAIL');
      expect(logEntry.context.file).toBe('index.ts');
    });

    it('should log network issue', async () => {
      const logEntry = await logger.logNetworkIssue({ url: 'http://api.test' });
      expect(logEntry.code).toBe('ER_NETWORK_ISSUE');
      expect(logEntry.context.url).toBe('http://api.test');
    });

    it('should log service worker failure', async () => {
      const logEntry = await logger.logServiceWorkerFailure({ browser: 'Chrome' });
      expect(logEntry.code).toBe('ER_SW_REGISTER_FAIL');
      expect(logEntry.context.browser).toBe('Chrome');
    });

    it('should log manifest error', async () => {
      const logEntry = await logger.logManifestError({ field: 'icons' });
      expect(logEntry.code).toBe('ER_MANIFEST_ERROR');
      expect(logEntry.context.field).toBe('icons');
    });

    it('should log cache strategy error', async () => {
      const logEntry = await logger.logCacheStrategyError({ quota: '95%' });
      expect(logEntry.code).toBe('ER_CACHE_STRATEGY');
      expect(logEntry.context.quota).toBe('95%');
    });
  });

  describe('Custom handlers', () => {
    it('should register and call custom handlers', async () => {
      let handlerCalled = false;
      let receivedLogEntry = null;

      logger.registerHandler((logEntry) => {
        handlerCalled = true;
        receivedLogEntry = logEntry;
      });

      await logger.logError('ER_SERVER_CONFIG', { test: true });

      expect(handlerCalled).toBe(true);
      expect(receivedLogEntry).toBeDefined();
      expect(receivedLogEntry.code).toBe('ER_SERVER_CONFIG');
    });

    it('should call multiple handlers', async () => {
      let handler1Called = false;
      let handler2Called = false;

      logger.registerHandler(() => { handler1Called = true; });
      logger.registerHandler(() => { handler2Called = true; });

      await logger.logError('ER_NETWORK_ISSUE');

      expect(handler1Called).toBe(true);
      expect(handler2Called).toBe(true);
    });

    it('should handle handler errors gracefully', async () => {
      logger.registerHandler(() => {
        throw new Error('Handler error');
      });

      // Should not throw
      await expect(logger.logError('ER_SERVER_CONFIG')).resolves.toBeDefined();
    });
  });

  describe('getLogs', () => {
    it('should return empty array when no logs exist', async () => {
      const logs = await logger.getLogs();
      expect(logs).toEqual([]);
    });

    it('should return all logged errors', async () => {
      await logger.logError('ER_SERVER_CONFIG');
      await logger.logError('ER_BUILD_FAIL');

      const logs = await logger.getLogs();
      expect(logs.length).toBe(2);
      expect(logs[0].code).toBe('ER_SERVER_CONFIG');
      expect(logs[1].code).toBe('ER_BUILD_FAIL');
    });

    it('should parse JSON correctly', async () => {
      const context = { nested: { value: 'test' }, array: [1, 2, 3] };
      await logger.logError('ER_NETWORK_ISSUE', context);

      const logs = await logger.getLogs();
      expect(logs[0].context).toEqual(context);
    });
  });

  describe('clearLogs', () => {
    it('should clear all logs', async () => {
      await logger.logError('ER_SERVER_CONFIG');
      await logger.logError('ER_BUILD_FAIL');

      let logs = await logger.getLogs();
      expect(logs.length).toBe(2);

      await logger.clearLogs();

      logs = await logger.getLogs();
      expect(logs.length).toBe(0);
    });

    it('should not throw when log file does not exist', async () => {
      await expect(logger.clearLogs()).resolves.not.toThrow();
    });
  });

  describe('Configuration options', () => {
    it('should disable file logging when fileEnabled is false', async () => {
      const noFileLogger = new ErrorLogger({
        logDirectory: testLogDir,
        logFileName: 'no-file.log',
        fileEnabled: false
      });
      await noFileLogger.initialize();

      await noFileLogger.logError('ER_SERVER_CONFIG');

      const logPath = join(testLogDir, 'no-file.log');
      expect(existsSync(logPath)).toBe(false);
    });
  });

  describe('Error severity and category validation', () => {
    it('should correctly categorize all error types', async () => {
      const serverError = await logger.logServerConfigError();
      expect(serverError.category).toBe('server');
      expect(serverError.severity).toBe('critical');

      const buildError = await logger.logBuildFailure();
      expect(buildError.category).toBe('build');
      expect(buildError.severity).toBe('critical');

      const networkError = await logger.logNetworkIssue();
      expect(networkError.category).toBe('network');
      expect(networkError.severity).toBe('high');

      const swError = await logger.logServiceWorkerFailure();
      expect(swError.category).toBe('pwa');
      expect(swError.severity).toBe('high');

      const manifestError = await logger.logManifestError();
      expect(manifestError.category).toBe('pwa');
      expect(manifestError.severity).toBe('medium');

      const cacheError = await logger.logCacheStrategyError();
      expect(cacheError.category).toBe('pwa');
      expect(cacheError.severity).toBe('medium');
    });
  });
});
