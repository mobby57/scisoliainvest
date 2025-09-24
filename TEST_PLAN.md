# SCI Solia Invest - Comprehensive Test Plan

This document outlines the comprehensive test plan for the SCI Solia Invest project, covering backend API, frontend components, and end-to-end user flows.

## Backend (API) - Vitest + Supertest + MongoDB Memory Server

### Authentication Routes (/api/auth)
| Test Case | Method | Endpoint | Expected Status | Description |
|-----------|--------|----------|-----------------|-------------|
| Register new user | POST | /register | 201 | Create user with valid data |
| Register existing user | POST | /register | 400 | Reject duplicate email |
| Register invalid data | POST | /register | 400 | Validation errors |
| Login valid credentials | POST | /login | 200 | Return token and user |
| Login invalid email | POST | /login | 401 | User not found |
| Login wrong password | POST | /login | 401 | Invalid credentials |
| Logout authenticated | POST | /logout | 200 | Successful logout |
| Change password valid | POST | /change-password | 200 | Password updated |
| Change password wrong current | POST | /change-password | 400 | Current password incorrect |
| Get current user | GET | /me | 200 | Return user profile |
| Get user unauthenticated | GET | /me | 401 | Require authentication |

### Tenant Routes (/api/tenants)
| Test Case | Method | Endpoint | Expected Status | Description |
|-----------|--------|----------|-----------------|-------------|
| Get all tenants | GET | / | 200 | List tenants |
| Get tenant by ID | GET | /:id | 200 | Return specific tenant |
| Get non-existent tenant | GET | /:id | 404 | Tenant not found |
| Create tenant | POST | / | 201 | Create new tenant |
| Create tenant invalid data | POST | / | 400 | Validation errors |
| Update tenant | PUT | /:id | 200 | Update tenant data |
| Update non-existent tenant | PUT | /:id | 404 | Tenant not found |
| Delete tenant | DELETE | /:id | 200 | Delete tenant |
| Delete non-existent tenant | DELETE | /:id | 404 | Tenant not found |

### User Routes (/api/users)
| Test Case | Method | Endpoint | Expected Status | Description |
|-----------|--------|----------|-----------------|-------------|
| Get all users | GET | / | 200 | List users |
| Get user by ID | GET | /:id | 200 | Return specific user |
| Get current user | GET | /me | 200 | Return authenticated user |
| Update user | PUT | /:id | 200 | Update user data |
| Update user unauthorized | PUT | /:id | 403 | Permission denied |
| Delete user | DELETE | /:id | 200 | Delete user |

### Donations Routes (/api/donations)
| Test Case | Method | Endpoint | Expected Status | Description |
|-----------|--------|----------|-----------------|-------------|
| Get donations | GET | / | 200 | List donations |
| Create donation | POST | / | 201 | Create new donation |
| Get donation by ID | GET | /:id | 200 | Return specific donation |
| Update donation | PUT | /:id | 200 | Update donation |
| Delete donation | DELETE | /:id | 200 | Delete donation |

### SCI Calculator Routes (/api/sci)
| Test Case | Method | Endpoint | Expected Status | Description |
|-----------|--------|----------|-----------------|-------------|
| Calculate IR | POST | /calculate/ir | 200 | IR calculation |
| Calculate IS | POST | /calculate/is | 200 | IS calculation |
| Calculate invalid data | POST | /calculate/ir | 400 | Validation errors |

### KYC Routes (/api/kyc)
| Test Case | Method | Endpoint | Expected Status | Description |
|-----------|--------|----------|-----------------|-------------|
| Submit KYC | POST | / | 201 | Submit KYC application |
| Get KYC status | GET | /:id | 200 | Get KYC status |
| Update KYC | PUT | /:id | 200 | Update KYC data |
| Approve KYC | PUT | /:id/approve | 200 | Approve KYC |

### Missions Routes (/api/missions)
| Test Case | Method | Endpoint | Expected Status | Description |
|-----------|--------|----------|-----------------|-------------|
| Get missions | GET | / | 200 | List missions |
| Create mission | POST | / | 201 | Create new mission |
| Update mission | PUT | /:id | 200 | Update mission |
| Delete mission | DELETE | /:id | 200 | Delete mission |

### Tasks Routes (/api/tasks)
| Test Case | Method | Endpoint | Expected Status | Description |
|-----------|--------|----------|-----------------|-------------|
| Get tasks | GET | / | 200 | List tasks |
| Create task | POST | / | 201 | Create new task |
| Update task | PUT | /:id | 200 | Update task |
| Complete task | PUT | /:id/complete | 200 | Mark task complete |

### Interactions Routes (/api/interactions)
| Test Case | Method | Endpoint | Expected Status | Description |
|-----------|--------|----------|-----------------|-------------|
| Get interactions | GET | / | 200 | List interactions |
| Create interaction | POST | / | 201 | Create new interaction |
| Update interaction | PUT | /:id | 200 | Update interaction |

## Frontend (Client) - Vitest + React Testing Library + MSW

### SCICalculator Component
| Test Case | Description | Type |
|-----------|-------------|------|
| Render calculator form | Initial render with all inputs | Unit |
| Calculate IR correctly | Input values, verify IR result | Unit |
| Calculate IS correctly | Input values, verify IS result | Unit |
| Handle invalid inputs | Error messages for invalid data | Unit |
| Reset form | Clear all inputs | Unit |
| Integration with API | Mock API calls for calculations | Integration |

### AuthForm Component (Login/Register)
| Test Case | Description | Type |
|-----------|-------------|------|
| Render login form | Email/password inputs | Unit |
| Render register form | All required fields | Unit |
| Submit login valid | Mock successful login | Unit |
| Submit login invalid | Error handling | Unit |
| Submit register valid | Mock successful registration | Unit |
| Submit register invalid | Validation errors | Unit |
| Form validation | Required fields, email format | Unit |

### Dashboard Component
| Test Case | Description | Type |
|-----------|-------------|------|
| Render dashboard | User data display | Unit |
| Display revenues | Revenue charts/data | Unit |
| Display dividends | Dividend information | Unit |
| Display charges | Charges breakdown | Unit |
| Navigation links | Working navigation | Unit |
| API data loading | Mock API responses | Integration |

## End-to-End (E2E) - Playwright

### Login Flow
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to login page | Login form displayed |
| 2 | Enter valid credentials | Form accepts input |
| 3 | Submit form | Redirect to dashboard |
| 4 | Verify dashboard | User data displayed |

### SCI Calculator Flow
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Login as user | Dashboard access |
| 2 | Navigate to calculator | Calculator form displayed |
| 3 | Enter SCI parameters | Form accepts input |
| 4 | Calculate IR | IR result displayed |
| 5 | Calculate IS | IS result displayed |
| 6 | Verify calculations | Correct tax calculations |

### Donation Flow
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Login as donator | Dashboard access |
| 2 | Navigate to donations | Donation form displayed |
| 3 | Enter donation details | Form accepts input |
| 4 | Submit donation | Success message |
| 5 | Verify donation list | New donation appears |

### KYC Validation Flow
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Login as user | Dashboard access |
| 2 | Navigate to KYC | KYC form displayed |
| 3 | Submit KYC documents | Upload successful |
| 4 | Submit application | Application submitted |
| 5 | Admin login | Admin dashboard |
| 6 | Review KYC | KYC details displayed |
| 7 | Approve KYC | Status updated |

### Tenant Management Flow
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Admin login | Admin dashboard |
| 2 | Navigate to tenants | Tenant list displayed |
| 3 | Create new tenant | Tenant creation form |
| 4 | Enter tenant details | Form accepts input |
| 5 | Submit tenant | Tenant created |
| 6 | Verify tenant list | New tenant appears |

## Test Coverage Goals

- **Backend**: 90%+ line coverage, all critical paths tested
- **Frontend**: 80%+ component coverage, key interactions tested
- **E2E**: All major user journeys covered

## Test Execution

- **Backend**: `cd packages/api && pnpm test`
- **Frontend**: `cd packages/client && pnpm test`
- **E2E**: `cd packages/client && pnpm e2e`
- **All**: `pnpm test` (from root with workspace config)
