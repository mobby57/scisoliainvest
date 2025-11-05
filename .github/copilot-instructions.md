# Copilot AI Agent Instructions for scisoliainvest.com

Goal
Make small, safe, verified changes quickly. Respect multi-tenant isolation, KYC, and audit rules. Run the repo quality gates before finishing any PR.

High-level architecture (where to look)
- Monorepo (pnpm): `packages/api/` (Node+Express+TypeScript), `packages/client/` (React+Vite), `packages/shared/` (types).
- Dual-database: PostgreSQL (Prisma) for relational/financial data; MongoDB (Mongoose) for documents.
- Multi-tenant and audit-first: every entity must include `tenantId`; financial/legal ops must create `AuditLog`.

Key files to read first
- `packages/api/prisma/schema.prisma`
- `packages/api/models/`
- `packages/api/services/UnifiedDocumentService.ts`
- `packages/api/debug-tests.js` & `packages/api/scripts/README.md`
- `packages/shared/`
- `azure-pipelines.yml`, `docker_compose.*`, `README-DOCKER.md`

Concrete developer workflows
- Install: `pnpm install` (repo root)
- Dev:
  - Fullstack: `pnpm dev`
  - Backend only: `pnpm --filter api dev`
  - Frontend only: `pnpm --filter client dev`
- Verify:
  - Typecheck: `npx tsc --noEmit`
  - Lint fix: `pnpm --filter api lint:fix`
  - Build: `pnpm build`
- Prisma:
  - `npx prisma generate`
  - `npx prisma migrate dev`
  - `npx prisma db seed`
- Tests:
  - All: `pnpm test`
  - Unit: `pnpm test:unit`
  - E2E: `pnpm test:e2e`
  - Debug API: `cd packages/api && node debug-tests.js [auth|projects|kyc|admin|all]`

Non-negotiable conventions
- `tenantId` on every model/document and in queries — never bypass tenant scoping.
- Use UUID PKs in Prisma and match types in `packages/shared`.
- KYC-first: block payments unless `KYCProfile.status === 'APPROVED'`.
- Audit log: add `AuditLog` entries for financial/legal state changes.
- Services throw; controllers catch and convert to HTTP responses.

Safe-change checklist (must do before PR)
- Run `npx tsc --noEmit` → PASS
- Run `pnpm --filter api lint:fix` → PASS
- Run relevant unit tests (`pnpm test:unit`) → PASS
- Add Prisma migration + seed if changing DB schema
- Confirm `tenantId` presence and add `AuditLog` where needed

If stuck
- Inspect `packages/api/debug-tests.js`, `packages/api/scripts/README.md`, and `packages/api/prisma/schema.prisma`.
- Tell me which area (auth/kyc/payments/docs) and I can propose a PR patch (model + service + tests).
