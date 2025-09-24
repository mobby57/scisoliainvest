# Combined Frontend & Backend TODO Checklist – Priority Order

## Phase 1: Frontend Cleanup & Validation (Priority 1-10)

### 1. Remove unused imports in frontend
- [ ] `SCICalculator.tsx`: Remove `AlertCircle`, `FileText`, `TrendingUp` imports
- [ ] `SCIExpertiseHub.tsx`: Remove `TrendingDown`, `apiService` imports; remove `activeTab`, `setActiveTab` variables
- [ ] `InvestmentSimulator.tsx`: Remove unused `err` variable
- [ ] `SCICalculator.test.tsx`: Replace `require()` with `import` syntax

### 2. Replace `any` types with proper types
- [ ] `ExpertiseHub.tsx` line 122: Replace `any` with `string[]` or typed object
- [ ] `SCICalculator.tsx` lines 62, 66: Replace `any` with `number` or interface types
- [ ] `apiService.ts`: Replace `any` in parameters and return types with proper interfaces

### 3. Fix React warnings
- [ ] `AuthContext.tsx`: Move constants/functions to separate file for fast refresh
- [ ] `SCIList.tsx`: Add `fetchSCIs` to `useEffect` dependency array or use `useCallback`

### 4. Run frontend validation
- [ ] Execute `pnpm --filter client validate`
- [ ] Fix any remaining ESLint errors/warnings

## Phase 2: Backend Tests & Robustness (Priority 11-20)

### 5. Complete TenantService tests
- [ ] Write Vitest tests for all `TenantService` methods: `getTenantById`, `getTenantConfig`, `updateTenantSetting`, `updateFeatureFlag`, `createTenant`, `getAllTenants`, `deleteTenant`
- [ ] Add validation and error handling for invalid inputs

### 6. Ensure API routes coverage
- [ ] Verify all routes exist and map to service methods
- [ ] Add tests for `GET`, `POST`, `PATCH`, `DELETE` endpoints

### 7. Fix imports and models
- [ ] Clean up Prisma/Mongo imports (ESM vs CJS consistency)
- [ ] Verify all models (`Tenant`, `User`, `Donation`, etc.) and relationships

### 8. Add JWT auth to tests
- [ ] Update all tests to authenticate with JWT where required

### 9. Complete database seed
- [ ] Add full seed for all entities and multi-tenant data

### 10. Run backend validation
- [ ] Execute `pnpm --filter api validate`
- [ ] Fix all ESLint/TypeScript errors

## Phase 3: Integration & Testing (Priority 21-30)

### 11. Frontend-backend integration
- [ ] Ensure API calls use JWT authentication
- [ ] Test critical pages: Admin, Donor, Collector flows

### 12. Add Playwright/Vitest UI tests
- [ ] Test login, tenant viewing, donation updates, settings

### 13. API testing with Postman
- [ ] Create/update Postman collection for all endpoints
- [ ] Test auth, CRUD, multi-tenant, error handling

### 14. Run full test suite
- [ ] Execute `pnpm test` for both packages
- [ ] Ensure 100% pass rate

### 15. Final pnpm validate
- [ ] Run `pnpm validate` across entire monorepo
- [ ] Confirm no errors or warnings

## Phase 4: DevOps & Deployment (Priority 31-40)

### 16. Dockerize applications
- [ ] Create/update Dockerfiles for backend and frontend
- [ ] Configure docker-compose for local dev (Mongo + API + Frontend)

### 17. Kubernetes manifests
- [ ] Create proper YAML manifests for deployments, services, configmaps
- [ ] Avoid applying JS/TS files; use only YAML

### 18. Test local deployment
- [ ] Build and run containers locally
- [ ] Verify frontend connects to backend, backend to Mongo

### 19. Production deployment prep
- [ ] Configure environment variables
- [ ] Set up CI/CD pipeline (GitHub Actions) for build/test/deploy

### 20. Final verification
- [ ] Deploy to staging environment
- [ ] Run end-to-end tests in deployed environment
- [ ] Confirm all features work as expected

## Notes
- Check off each item as completed
- Commit changes after each major fix
- Coordinate frontend/backend changes as needed
- Test incrementally to catch issues early
