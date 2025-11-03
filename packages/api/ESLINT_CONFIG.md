# ESLint Configuration Guide for Solia Backend

This document outlines the complete ESLint + TypeScript configuration for your Solia backend project.

## ✅ Current Setup

### Dependencies (already installed)

- `@typescript-eslint/eslint-plugin`
- `@typescript-eslint/parser`
- `eslint`
- `typescript`

### Configuration Files

- `eslint.config.js` - Main ESLint configuration (ESM format)
- `.eslintignore` - Files to ignore during linting
- `tsconfig.json` - TypeScript configuration

## 🚀 Quick Start

### Scripts

```bash
# Lint all TypeScript/JavaScript files
npm run lint

# Lint with auto-fix
npm run lint -- --fix

# Lint specific directories
npx eslint src/ tests/ factories/ --ext .ts,.js
```

### IDE Integration

VS Code should automatically use the `.eslintignore` and `eslint.config.js` files.

## 📋 Configuration Details

### File Patterns

- **Includes**: All `.ts`, `.tsx`, `.js` files in `src/`, `tests/`, `factories/`
- **Excludes**: `node_modules/`, `dist/`, `coverage/`, config files

### Rules Overview

- **TypeScript**: Strict type checking enabled
- **Code Style**: Enforces consistent formatting
- **Best Practices**: No console logs in production, no unused variables
- **Test Files**: Relaxed rules for test files

## 🔧 Custom Rules

### TypeScript-Specific

- `@typescript-eslint/no-explicit-any`: Warn (not error)
- `@typescript-eslint/no-unused-vars`: Error with ignore pattern `_`
- `@typescript-eslint/explicit-function-return-type`: Off (flexible)

### General

- `no-console`: Warn in production
- `prefer-const`: Enforce const usage
- `sort-imports`: Organize imports automatically

## 📝 Migration Guide

### From JavaScript to TypeScript

1. Rename `.js` files to `.ts`
2. Update imports to use ES modules
3. Add type annotations gradually
4. Run `npm run lint -- --fix` to auto-fix issues

### Example Migration

```javascript
// Before (user.factory.js)
const faker = require('faker');

// After (user.factory.ts)
import { faker } from '@faker-js/faker';
import type { User } from '../types/user';

export const createUser = (overrides?: Partial<User>): User => ({
  // ... implementation
});
```

## 🎯 Next Steps

1. Run `npm run lint` to check current codebase
2. Fix any issues with `npm run lint -- --fix`
3. Consider adding pre-commit hooks with husky
4. Add prettier for consistent formatting (optional)

## 🐛 Troubleshooting

### Common Issues

1. **"Parsing error"**: Ensure `tsconfig.json` includes all relevant files
2. **"Cannot resolve module"**: Check TypeScript path mappings
3. **ESLint not working in VS Code**: Restart VS Code or check ESLint extension

### Debug Commands

```bash
# Check ESLint configuration
npx eslint --print-config src/server.js

# Lint with debug output
DEBUG=eslint:* npx eslint src/
```
