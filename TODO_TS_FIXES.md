# TypeScript Errors Fix Plan

## Information Gathered

- Project uses TypeScript with moduleResolution: node16/nodenext, requiring .js extensions on imports
- Many files in `packages/api/src/` have incorrect relative paths (e.g., '../models' should be '../../models')
- Missing model files in expected locations
- Prisma schema missing models like tenantFeature, user, role
- Express req.user type mismatches
- Missing exports in various files

## Plan

1. Fix import paths in src/ directory files
2. Add .js extensions to all relative imports
3. Create/update missing model files
4. Update Prisma schema with missing models
5. Fix Express types for req.user
6. Add missing exports
7. Fix remaining type issues

## Detailed Steps

- [ ] Fix factories/user.factory.ts import path and extension
- [ ] Fix src/controllers/auth.controller.ts import path
- [ ] Fix src/controllers/notification.controller.ts imports and types
- [ ] Fix src/controllers/user.controller.ts import path
- [ ] Fix src/middleware/authMiddleware.ts import path
- [ ] Fix src/models/index.ts imports and extensions
- [ ] Fix src/models/sci.seed.ts import path
- [ ] Fix src/routes/kyc.ts import path
- [ ] Fix src/services/ imports
- [ ] Fix src/tenant/tenant.service.ts import path
- [ ] Fix src/tests/ imports
- [ ] Update Prisma schema.prisma
- [ ] Fix Express types in types/express/index.d.ts
- [ ] Add missing exports in various files
- [ ] Run tsc --noEmit to verify fixes

## Followup Steps

- Run TypeScript compilation
- Test application functionality
- Update any remaining issues
