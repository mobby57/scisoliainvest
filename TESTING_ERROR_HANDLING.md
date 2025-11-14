# Running Error Handling System Tests

This document explains how to run the unit tests for the error handling system.

## Prerequisites

The tests require Jest to be installed. If you don't have it yet:

```bash
npm install --save-dev jest @jest/globals
```

## Configuration

Add the following to your `package.json`:

```json
{
  "scripts": {
    "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js",
    "test:error-handling": "node --experimental-vm-modules node_modules/jest/bin/jest.js lib/__tests__/error-logger.test.js"
  },
  "jest": {
    "testEnvironment": "node",
    "transform": {},
    "extensionsToTreatAsEsm": [".js"]
  }
}
```

## Running Tests

### Run all error handling tests:
```bash
npm run test:error-handling
```

### Run all tests in the project:
```bash
npm test
```

### Run tests in watch mode:
```bash
npm test -- --watch
```

### Run tests with coverage:
```bash
npm test -- --coverage
```

## Test Coverage

The test suite covers:

### Error Codes (errors.js)
- ✅ All required error codes are defined
- ✅ Error code structure validation
- ✅ Severity level validation
- ✅ Category validation
- ✅ getErrorByCode function
- ✅ getErrorsByCategory function
- ✅ getErrorsBySeverity function
- ✅ isValidErrorCode function

### Error Logger (error-logger.js)
- ✅ Logger initialization
- ✅ Log directory creation
- ✅ Log entry formatting
- ✅ File logging
- ✅ Console logging (when enabled)
- ✅ All specific error logging methods
- ✅ Custom handler registration and execution
- ✅ getLogs functionality
- ✅ clearLogs functionality
- ✅ Configuration options
- ✅ Error severity and category validation

## Manual Testing

If you want to test the system manually without Jest:

```bash
# Test error codes
node -e "import('./lib/errors.js').then(m => {
  console.log('Error codes:', Object.keys(m.ERROR_CODES));
  console.log('Sample:', m.getErrorByCode('ER_SERVER_CONFIG'));
})"

# Test error logger
node -e "import('./lib/error-logger.js').then(async m => {
  const logger = new m.ErrorLogger({
    logDirectory: '/tmp/test-logs',
    consoleEnabled: true
  });
  await logger.initialize();
  await logger.logServerConfigError({ test: true });
  const logs = await logger.getLogs();
  console.log('Logged:', logs.length, 'entries');
})"
```

## Expected Test Results

When running the full test suite, you should see:

```
PASS  lib/__tests__/error-logger.test.js
  Error Codes (errors.js)
    ERROR_CODES
      ✓ should contain all required error codes
      ✓ should have correct structure for each error code
      ✓ should have valid severity levels
      ✓ should have valid categories
    getErrorByCode
      ✓ should return error details for valid code
      ✓ should return null for invalid code
    getErrorsByCategory
      ✓ should return all PWA errors
      ✓ should return all server errors
      ✓ should return empty array for non-existent category
    getErrorsBySeverity
      ✓ should return all critical errors
      ✓ should return all high severity errors
      ✓ should return empty array for non-existent severity
    isValidErrorCode
      ✓ should return true for valid error codes
      ✓ should return false for invalid error codes
  ErrorLogger (error-logger.js)
    Initialization
      ✓ should create log directory on initialize
      ✓ should have default configuration values
    formatLogEntry
      ✓ should format log entry correctly
      ✓ should throw error for invalid code
      ✓ should include timestamp in ISO format
    logError
      ✓ should log error with valid code
      ✓ should write log to file
      ✓ should handle invalid error code gracefully
      ✓ should append multiple logs to file
    Specific error logging methods
      ✓ should log server config error
      ✓ should log build failure
      ✓ should log network issue
      ✓ should log service worker failure
      ✓ should log manifest error
      ✓ should log cache strategy error
    Custom handlers
      ✓ should register and call custom handlers
      ✓ should call multiple handlers
      ✓ should handle handler errors gracefully
    getLogs
      ✓ should return empty array when no logs exist
      ✓ should return all logged errors
      ✓ should parse JSON correctly
    clearLogs
      ✓ should clear all logs
      ✓ should not throw when log file does not exist
    Configuration options
      ✓ should disable file logging when fileEnabled is false
    Error severity and category validation
      ✓ should correctly categorize all error types

Test Suites: 1 passed, 1 total
Tests:       37 passed, 37 total
```

## Troubleshooting

### "Cannot find module" errors
Make sure you're using Node.js 14+ with ES modules support.

### "SyntaxError: Cannot use import statement"
The test file uses ES modules. Make sure your package.json has `"type": "module"` or use the `--experimental-vm-modules` flag.

### Tests timing out
Increase the Jest timeout:
```javascript
jest.setTimeout(10000); // 10 seconds
```

### File system permissions
The tests create temporary files in `/tmp/test-error-logs`. Make sure this directory is writable.

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Test Error Handling

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test:error-handling
```

### GitLab CI Example

```yaml
test:
  script:
    - npm install
    - npm run test:error-handling
```

## Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [ES Modules in Jest](https://jestjs.io/docs/ecmascript-modules)
- [ERROR_DOCUMENTATION.md](./ERROR_DOCUMENTATION.md) - Complete error documentation
- [ERROR_HANDLING_README.md](./ERROR_HANDLING_README.md) - Expert guide
