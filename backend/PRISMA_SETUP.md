# Prisma Setup Guide - SCI Solia Invest Backend

This guide explains how to work with Prisma ORM for database management in the SCI Solia Invest backend.

## Prerequisites

- Docker and Docker Compose installed
- Node.js 16+ installed
- PostgreSQL running (via Docker Compose)

## Quick Start

### 1. Start PostgreSQL Database

```bash
# From the root directory
docker compose -f docker-compose.postgres.yml up -d
```

This will start a PostgreSQL container with:
- Database: `sci_solia_invest`
- User: `postgres`
- Password: `password`
- Port: `5432`

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

The `.env` and `.env.development` files already contain the DATABASE_URL:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/sci_solia_invest?schema=public"
```

### 4. Generate Prisma Client

```bash
npm run prisma:generate
```

### 5. Apply Migrations

```bash
npm run prisma:migrate
```

This will create all the necessary database tables based on the Prisma schema.

### 6. Seed the Database (Optional)

```bash
npm run prisma:seed
```

This will populate the database with initial test data:
- 2 test users (admin and investor)
- 1 SCI (Société Civile Immobilière)
- 1 property
- 1 investment

## Database Schema

The Prisma schema (`prisma/schema.prisma`) includes the following models:

### User
- id, email, password, firstName, lastName, role
- Relations: investments, documents

### SCI (Société Civile Immobilière)
- id, name, siret, address, capital, status
- Relations: properties, investments

### Property
- id, name, address, city, postalCode, type, surface, value
- Relations: sci

### Investment
- id, shares, amount, date
- Relations: user, sci

### Document
- id, name, type, url, size, mimeType
- Relations: user

## Available Prisma Scripts

```bash
# Generate Prisma Client
npm run prisma:generate

# Create and apply migrations (dev)
npm run prisma:migrate

# Apply migrations (production)
npm run prisma:migrate:deploy

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Seed the database
npm run prisma:seed
```

## Prisma Studio

To explore and modify the database using a GUI:

```bash
npm run prisma:studio
```

Then open http://localhost:5555 in your browser.

## Testing the Connection

### Via psql (PostgreSQL CLI)

```bash
# Connect to the database
docker exec -it solia-postgres psql -U postgres -d sci_solia_invest

# List tables
\dt

# Query users
SELECT email, role FROM users;

# Exit
\q
```

### Via API Endpoints

Start the server:

```bash
npm start
# or for development with auto-reload
npm run dev
```

Test the endpoints:

```bash
# Health check
curl http://localhost:5000/health

# Get all users
curl http://localhost:5000/api/users

# Get all SCIs
curl http://localhost:5000/api/scis

# Get all properties
curl http://localhost:5000/api/properties
```

## Creating New Migrations

When you modify the Prisma schema:

1. Update `prisma/schema.prisma`
2. Run migration:
   ```bash
   npm run prisma:migrate -- --name your_migration_name
   ```
3. The migration will be automatically applied and Prisma Client will be regenerated

## Troubleshooting

### Database Connection Errors

If you get connection errors:

1. Check if PostgreSQL is running:
   ```bash
   docker ps | grep solia-postgres
   ```

2. Restart PostgreSQL:
   ```bash
   docker compose -f docker-compose.postgres.yml restart
   ```

3. Check logs:
   ```bash
   docker logs solia-postgres
   ```

### Prisma Client Not Found

If you get "Cannot find module '@prisma/client'":

```bash
npm run prisma:generate
```

### Reset Database (Development Only)

⚠️ **Warning**: This will delete all data!

```bash
# Stop the backend
# Drop all tables and reapply migrations
docker compose -f docker-compose.postgres.yml down -v
docker compose -f docker-compose.postgres.yml up -d
npm run prisma:migrate
npm run prisma:seed
```

## Production Deployment

For production:

1. Use strong passwords in environment variables
2. Use `npm run prisma:migrate:deploy` instead of `prisma:migrate`
3. Never commit `.env` files
4. Use a managed PostgreSQL service (not Docker)
5. Enable SSL for database connections

## Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
