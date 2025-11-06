#!/bin/bash
# Verification script for Prisma and PostgreSQL setup

set -e

echo "🔍 SCI Solia Invest - Prisma Setup Verification"
echo "================================================"
echo ""

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR"

# Check if Docker is running
echo "1. Checking Docker..."
if docker ps > /dev/null 2>&1; then
    echo "   ✅ Docker is running"
else
    echo "   ❌ Docker is not running"
    exit 1
fi

# Check if PostgreSQL container is running
echo ""
echo "2. Checking PostgreSQL container..."
if docker ps | grep -q solia-postgres; then
    echo "   ✅ PostgreSQL container is running"
else
    echo "   ❌ PostgreSQL container is not running"
    echo "   Run: docker compose -f docker-compose.postgres.yml up -d"
    exit 1
fi

# Check PostgreSQL connection
echo ""
echo "3. Testing PostgreSQL connection..."
if docker exec solia-postgres psql -U postgres -d sci_solia_invest -c "SELECT 1;" > /dev/null 2>&1; then
    echo "   ✅ PostgreSQL connection successful"
else
    echo "   ❌ Cannot connect to PostgreSQL"
    exit 1
fi

# Check if Prisma Client is installed
echo ""
echo "4. Checking Prisma installation..."
if [ -d "$BACKEND_DIR/node_modules/@prisma/client" ]; then
    echo "   ✅ Prisma Client is installed"
else
    echo "   ❌ Prisma Client not found"
    echo "   Run: cd backend && npm install"
    exit 1
fi

# Check if migrations have been applied
echo ""
echo "5. Checking database tables..."
# Check for specific required tables instead of counting
REQUIRED_TABLES=("users" "scis" "properties" "investments" "documents")
MISSING_TABLES=()

for table in "${REQUIRED_TABLES[@]}"; do
    if ! docker exec solia-postgres psql -U postgres -d sci_solia_invest -t -c "\dt $table" 2>/dev/null | grep -q "$table"; then
        MISSING_TABLES+=("$table")
    fi
done

if [ ${#MISSING_TABLES[@]} -eq 0 ]; then
    echo "   ✅ All required database tables exist"
else
    echo "   ⚠️  Missing tables: ${MISSING_TABLES[*]}"
    echo "   Run: cd backend && npm run prisma:migrate"
fi

# Check if data has been seeded
echo ""
echo "6. Checking seeded data..."
USERS=$(docker exec solia-postgres psql -U postgres -d sci_solia_invest -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null | tr -d ' ' || echo "0")
if [ "$USERS" -gt 0 ]; then
    echo "   ✅ Database has been seeded ($USERS users found)"
else
    echo "   ⚠️  No data found, run: cd backend && npm run prisma:seed"
fi

# Test Prisma connection
echo ""
echo "7. Testing Prisma Client connection..."
cd "$BACKEND_DIR"
if node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.user.count().then(count => {
  console.log('   ✅ Prisma Client working (' + count + ' users in database)');
  process.exit(0);
}).catch(err => {
  console.error('   ❌ Prisma Client error:', err.message);
  process.exit(1);
});
" 2>/dev/null; then
    true
else
    echo "   ❌ Prisma connection failed"
    exit 1
fi

echo ""
echo "🎉 All checks passed! Your Prisma setup is working correctly."
echo ""
echo "Next steps:"
echo "  • Start the backend server: cd backend && npm start"
echo "  • Open Prisma Studio: cd backend && npm run prisma:studio"
echo "  • View documentation: cat backend/PRISMA_SETUP.md"
