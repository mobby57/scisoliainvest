#!/bin/bash

# Comprehensive Testing Validation Script for SCI Solia Invest
# This script validates tests in two steps: ESLint + Tests (Vitest/Jest) + E2E (Cypress)

set -e

# Colors for output
RED="\033[0;31m"
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
BLUE="\033[0;34m"
NC="\033[0m" # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[$(date +"%Y-%m-%d %H:%M:%S")] $1${NC}"
}

print_status "Starting comprehensive testing validation..."

# Step 1: Lint auto-fix for backend
print_status "Step 1/4: Running ESLint auto-fix in backend..."
cd backend
npm run lint:fix
cd ..

# Step 2: Lint auto-fix for frontend
print_status "Step 2/4: Running ESLint auto-fix in frontend..."
cd frontend
npm run lint:fix
cd ..

# Step 3: Run Vitest unit tests for backend
print_status "Step 3/4: Running Vitest unit tests with MongoDB Memory Server..."
cd backend
npm run test -- --passWithNoTests
cd ..

# Step 4: Run Cypress end-to-end tests
print_status "Step 4/4: Running Cypress end-to-end tests (headless)..."
npx cypress run

print_status "✅ All tests passed successfully!"
exit 0
