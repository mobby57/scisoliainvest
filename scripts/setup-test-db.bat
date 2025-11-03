@echo off
echo Setting up test databases for SCI Solia Invest...

REM Create PostgreSQL test database
echo Creating PostgreSQL test database...
createdb sci_test_db
if %errorlevel% neq 0 (
    echo Warning: PostgreSQL database creation failed or database already exists
)

REM Copy environment files
echo Setting up test environment...
if not exist .env.test (
    copy .env.example .env.test
    echo Test environment file created from example
) else (
    echo Test environment file already exists
)

echo Test database setup complete!
echo You can now run: npm run test:all:windows