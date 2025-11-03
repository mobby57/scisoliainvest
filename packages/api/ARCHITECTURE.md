# API Architecture Documentation

## Overview

This document describes the architecture of the SciSolia Investment Platform API, a secure, multi-tenant backend service built with Node.js, Express, and TypeScript.

## Technology Stack

### Core Technologies
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Module System**: ES Modules (Node16 resolution)

### Databases
- **Primary**: PostgreSQL with Prisma ORM
- **Secondary**: MongoDB with Mongoose (for documents, notifications, audit logs)
- **Cache**: Redis (optional)

### Security & Authentication
- **Authentication**: JWT tokens with refresh mechanism
- **Authorization**: Role-based access control (RBAC)
- **Security**: OWASP ASVS Level 2 compliance
- **Rate Limiting**: Express rate limiter
- **CSRF Protection**: Custom CSRF middleware
- **Input Validation**: Zod schemas

## Project Structure

```
src/
├── config/           # Configuration files
│   ├── env.ts       # Environment validation with Zod
│   ├── logger.ts    # Winston logger configuration
│   ├── database.ts  # Database connections
│   └── redis.ts     # Redis configuration
├── controllers/     # Request handlers
├── middleware/      # Express middleware
│   ├── auth.middleware.ts      # JWT authentication
│   ├── audit.middleware.ts     # Audit logging
│   ├── csrf.ts                 # CSRF protection
│   ├── errorHandler.ts         # Global error handling
│   ├── rateLimiter.ts         # Rate limiting
│   ├── security.ts            # Security headers
│   └── validation.middleware.ts # Input validation
├── models/          # Database models
│   ├── User.ts      # User model (in-memory)
│   ├── Document.ts  # MongoDB document model
│   ├── Notification.ts # MongoDB notification model
│   └── AuditLog.ts  # MongoDB audit log model
├── routes/          # API route definitions
├── services/        # Business logic layer
├── utils/           # Utility functions
│   ├── validators.ts # Zod validation schemas
│   ├── encryption.ts # Password hashing utilities
│   └── fileSafe.ts  # Secure file operations
├── types/           # TypeScript type definitions
└── tests/           # Test files
    ├── __mocks__/   # Test mocks
    ├── utils/       # Test utilities
    └── setup/       # Test setup files
```

## Security Architecture

### Authentication Flow
1. User login with email/password
2. Server validates credentials
3. JWT access token (15min) + refresh token (7d) issued
4. Client includes access token in Authorization header
5. Middleware validates token on protected routes
6. Token refresh using refresh token when expired

### Authorization Model
- **Roles**: INVESTOR, ADMIN, PORTFOLIO_MANAGER
- **Permissions**: Granular permissions per role
- **Tenant Isolation**: Multi-tenant architecture with tenant-based data isolation

### Security Measures
- **Input Validation**: All inputs validated with Zod schemas
- **SQL Injection**: Prevented via Prisma ORM and parameterized queries
- **XSS Protection**: Input sanitization and CSP headers
- **CSRF Protection**: Custom CSRF tokens for state-changing operations
- **Rate Limiting**: Configurable rate limits per endpoint
- **Audit Logging**: Comprehensive audit trail for all operations
- **Password Security**: bcrypt hashing with configurable rounds
- **File Upload Security**: Type validation and path traversal prevention

## Data Architecture

### Database Design
- **PostgreSQL**: Primary database for structured data (users, investments, transactions)
- **MongoDB**: Document storage for unstructured data (documents, notifications, audit logs)
- **Redis**: Session storage and caching (optional)

### Multi-Tenancy
- Tenant isolation at the application level
- All data operations include tenant context
- Tenant-specific configuration and permissions

## API Design

### RESTful Endpoints
- **Authentication**: `/api/auth/*`
- **Users**: `/api/users/*`
- **Documents**: `/api/documents/*`
- **Distributions**: `/api/distribution/*`
- **Financial Flows**: `/api/financial-flow/*`
- **Health Check**: `/api/health`

### Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Error Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {}
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Middleware Stack

### Request Processing Order
1. **Security Headers** - Set security-related headers
2. **CORS** - Handle cross-origin requests
3. **Rate Limiting** - Enforce rate limits
4. **Body Parsing** - Parse JSON/form data
5. **CSRF Protection** - Validate CSRF tokens
6. **Authentication** - Validate JWT tokens
7. **Authorization** - Check permissions
8. **Validation** - Validate request data
9. **Audit Logging** - Log operations
10. **Route Handler** - Execute business logic
11. **Error Handling** - Handle errors gracefully

## Environment Configuration

### Required Variables
```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://...
MONGODB_URI=mongodb://...
JWT_SECRET=your-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret
REDIS_URL=redis://...
```

### Security Configuration
```env
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CSRF_SECRET=your-csrf-secret
ENCRYPTION_KEY=your-encryption-key-64-chars
```

## Testing Strategy

### Test Types
- **Unit Tests**: Individual function testing
- **Integration Tests**: API endpoint testing with Supertest
- **Security Tests**: Authentication and authorization testing
- **Mock Tests**: Database and external service mocking

### Test Utilities
- **JWT Mocking**: Comprehensive JWT token generation for tests
- **Database Helpers**: Test database setup and teardown
- **Mock Services**: Mocked external dependencies

## Logging & Monitoring

### Structured Logging
- **Format**: JSON structured logs
- **Levels**: error, warn, info, debug
- **Rotation**: Daily log rotation
- **Security**: Sensitive data filtering

### Audit Logging
- All user actions logged
- Security events tracked
- Compliance reporting support
- Configurable retention periods

## Performance Considerations

### Optimization Strategies
- **Database Indexing**: Proper indexing for query performance
- **Connection Pooling**: Database connection management
- **Caching**: Redis caching for frequently accessed data
- **Rate Limiting**: Prevent abuse and ensure fair usage
- **Async Operations**: Non-blocking I/O operations

## Deployment Architecture

### Production Requirements
- Node.js 18+ runtime
- PostgreSQL 13+ database
- MongoDB 5+ database
- Redis 6+ (optional)
- SSL/TLS termination
- Load balancer (for scaling)

### Environment Separation
- **Development**: Local development with test databases
- **Staging**: Production-like environment for testing
- **Production**: Live environment with monitoring

## Error Handling

### Error Categories
- **Validation Errors**: Input validation failures
- **Authentication Errors**: Auth token issues
- **Authorization Errors**: Permission denied
- **Database Errors**: Connection and query issues
- **Business Logic Errors**: Application-specific errors

### Error Response Strategy
- Consistent error format across all endpoints
- Appropriate HTTP status codes
- Detailed error messages in development
- Generic error messages in production
- Error logging for debugging

## API Documentation Guidelines

### Documentation Standards
- OpenAPI/Swagger specification
- Comprehensive endpoint documentation
- Request/response examples
- Authentication requirements
- Error code documentation

### Maintenance
- Keep documentation in sync with code changes
- Version API documentation
- Provide migration guides for breaking changes

## Security Compliance

### OWASP ASVS Level 2
- Authentication verification requirements
- Session management requirements
- Access control verification requirements
- Input validation requirements
- Cryptography requirements
- Error handling and logging requirements

### Regular Security Practices
- Dependency vulnerability scanning
- Security code reviews
- Penetration testing
- Security monitoring and alerting

## Future Considerations

### Scalability
- Horizontal scaling with load balancers
- Database sharding strategies
- Microservices architecture migration
- Event-driven architecture

### Monitoring & Observability
- Application performance monitoring (APM)
- Distributed tracing
- Metrics collection and alerting
- Health check endpoints

This architecture provides a solid foundation for a secure, scalable, and maintainable API service while following industry best practices and security standards.