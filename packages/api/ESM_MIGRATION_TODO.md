# ESM Migration TODO - 100% ESM Backend

## Overview
Converting all CommonJS files to ESM format. Backend already has `"type": "module"` configured.

## Migration Progress

### Phase 1: Core Application Files ✅
- [ ] `backend/app.js`
- [ ] `backend/server.js`
- [ ] `backend/src/app.js`
- [ ] `backend/src/server.ts`

### Phase 2: Models ✅
- [ ] `backend/models/*.js` - All model files
- [ ] Add `.js` extensions to local imports

### Phase 3: Controllers ✅
- [ ] `backend/controllers/*.js` - All controller files
- [ ] Add `.js` extensions to local imports

### Phase 4: Routes ✅
- [ ] `backend/routes/*.js` - All route files
- [ ] Add `.js` extensions to local imports

### Phase 5: Middleware ✅
- [ ] `backend/middleware/*.js` - All middleware files
- [ ] Add `.js` extensions to local imports

### Phase 6: Services & Utils ✅
- [ ] `backend/services/*.js` - All service files
- [ ] `backend/utils/*.js` - All utility files
- [ ] Add `.js` extensions to local imports

### Phase 7: Scripts ✅
- [ ] `backend/scripts/*.js` - All script files
- [ ] Add `.js` extensions to local imports

### Phase 8: Test Files ✅
- [ ] `backend/tests/**/*.js` - All test files
- [ ] `backend/tests/**/*.test.ts` - All TypeScript test files
- [ ] Add `.js` extensions to local imports

### Phase 9: Configuration Files ✅
- [ ] `backend/config/*.js` - All config files
- [ ] Add `.js` extensions to local imports

### Phase 10: Factory Files ✅
- [ ] `backend/factories/*.js` - All factory files
- [ ] Add `.js` extensions to local imports

## Key Transformations
1. Convert `require()` to `import`
2. Add `.js` extensions to local imports
3. Convert `module.exports` to `export`
4. Handle __dirname/__filename with import.meta.url

## Verification Steps
- [ ] Run `npm run lint:fix`
- [ ] Run `npm run test:unit`
- [ ] Run `npm run dev`
- [ ] Run `npm run test:e2e`
