# TODO: Fix TypeScript Compilation Errors in packages/api

## Completed
- [ ] Analyze files and create plan
- [ ] Get user approval

## In Progress
- [ ] Fix packages/api/src/types/auth.ts: Remove duplicate permissions
- [ ] Fix packages/api/models/User.ts: Add kycStatus and kycDocuments to IUserProfile
- [ ] Fix packages/api/src/services/audit.service.ts: Rename resourceType to entityType
- [ ] Fix packages/api/src/controllers/sci.controller.ts: Convert BigInt(id) to string, standardize casing, remove duplicate function
- [ ] Fix packages/api/src/controllers/document.controller.ts: Correct audit service import path
- [ ] Fix packages/api/src/routes/sci.routes.ts: Correct authMiddleware import path
- [ ] Create packages/api/models/Notification.ts: New Mongoose model for notifications
- [ ] Fix test files: Correct jwtMock import paths
- [ ] Run npx prisma generate
- [ ] Run pnpm build to verify fixes
