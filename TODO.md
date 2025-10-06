# SCOLIA INVEST Starter Implementation Plan

## Backend Updates
- [ ] Update User model to include 'name' field and define roles
- [ ] Modify auth.js to use Mongoose, add /login-auto endpoint
- [ ] Update seed-dev.js with demo users for all roles

## Frontend Updates
- [ ] Add loginAuto function in AuthContext
- [ ] Create DashboardInvestor component
- [ ] Create DashboardOwner component
- [ ] Create DashboardTenant component
- [ ] Create DashboardAdmin component
- [ ] Update App.tsx for role-based routing
- [ ] Add demo login buttons

## Testing & Followup
- [ ] Run seed script
- [ ] Test login-auto endpoint
- [ ] Build and test frontend

# TODO: Fix Missing Dependencies and Docker Rebuild

## Steps to Complete
- [x] Install dependencies using pnpm install at root (workspace)
- [ ] Rebuild backend Docker container (Docker not running, requires starting Docker Desktop)
- [x] Install depcheck globally
- [x] Run depcheck in packages/api to detect missing dependencies
- [x] Run depcheck in packages/client to detect missing dependencies
- [x] Review and install any additional missing dependencies found
- [x] Note: Consider upgrading Node version in Docker image from v18 to v20 LTS for Vite compatibility
