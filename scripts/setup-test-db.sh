#!/bin/bash

echo "Setting up test databases for SCI Solia Invest..."

# Create PostgreSQL test database
echo "Creating PostgreSQL test database..."
createdb sci_test_db || echo "Warning: PostgreSQL database creation failed or database already exists"

# Copy environment files
echo "Setting up test environment..."
if [ ! -f .env.test ]; then
    cp .env.example .env.test
    echo "Test environment file created from example"
else
    echo "Test environment file already exists"
fi

echo "Test database setup complete!"
echo "You can now run: npm run test:all"