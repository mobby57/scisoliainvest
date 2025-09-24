# TODO: Generate Comprehensive Tests for SCI Solia Invest

## Backend Tests (packages/api/tests/)

### Auth Tests (auth.test.ts)
- [x] Basic register, login, profile tests exist
- [x] Add register existing user test
- [x] Add register invalid data test
- [x] Add login invalid email test
- [x] Add logout test
- [x] Add change password tests (valid, invalid current)
- [x] Add get user unauthenticated test (already has)

### Tenant Tests (tenants.test.ts)
- [x] Basic create, list, isolation tests exist
- [x] Add GET /:id test
- [x] Add GET non-existent tenant test
- [x] Add PUT /:id test
- [x] Add PUT non-existent tenant test
- [x] Add DELETE /:id test
- [x] Add DELETE non-existent tenant test

### User Tests (users.test.ts)
- [ ] Check existing users.test.ts
- [ ] Add missing CRUD tests if needed

### Donations Tests
- [ ] Create donations.test.ts with full CRUD

### SCI Calculator Tests
- [ ] Create sci.test.ts with calculation tests

### KYC Tests (kyc_integration.test.ts exists)
- [ ] Expand with additional test cases

### Missions Tests
- [ ] Create missions.test.ts

### Tasks Tests
- [ ] Create tasks.test.ts

### Interactions Tests
- [ ] Create interactions.test.ts

## Frontend Tests (packages/client/src/__tests__/)

### SCICalculator Tests
- [x] Basic test exists
- [ ] Expand with calculation tests
- [ ] Add integration tests with MSW

### AuthForm Tests
- [ ] Create AuthForm.test.tsx

### Dashboard Tests
- [ ] Create Dashboard.test.tsx

## E2E Tests (tests/e2e/)

### Login Flow
- [ ] Create login.spec.ts

### SCI Calculator Flow
- [x] scicalculator.spec.ts exists
- [ ] Expand with more scenarios

### Donation Flow
- [ ] Create donation.spec.ts

### KYC Flow
- [ ] Create kyc.spec.ts

### Tenant Management Flow
- [ ] Create tenant.spec.ts

## Factories
- [x] user.factory.ts exists
- [ ] Create tenant.factory.ts
- [ ] Create donation.factory.ts
- [ ] Create sci.factory.ts
- [ ] Create kyc.factory.ts

## Dependencies
- [ ] Check if MSW is installed for frontend mocks
- [ ] Ensure all dev dependencies are present

## Execution
- [ ] Run backend tests: cd packages/api && pnpm test
- [ ] Run frontend tests: cd packages/client && pnpm test
- [ ] Run E2E tests: cd packages/client && pnpm e2e
- [ ] Check coverage reports
