#!/bin/bash

# SCI Solia Invest - Development Environment Script
# This script sets up the complete development environment

set -e

echo "🚀 Starting SCI Solia Invest Development Environment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to wait for service
wait_for_service() {
    local host=$1
    local port=$2
    local service_name=$3
    
    echo -e "${YELLOW}⏳ Waiting for $service_name to be ready...${NC}"
    
    for i in {1..30}; do
        if nc -z "$host" "$port" 2>/dev/null; then
            echo -e "${GREEN}✅ $service_name is ready!${NC}"
            return 0
        fi
        sleep 2
    done
    
    echo -e "${RED}❌ $service_name failed to start${NC}"
    return 1
}

# Check prerequisites
echo -e "${YELLOW}🔍 Checking prerequisites...${NC}"

if ! command_exists docker; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    exit 1
fi

if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All prerequisites met${NC}"

# Clean up any existing containers
echo -e "${YELLOW}🧹 Cleaning up existing containers...${NC}"
docker-compose down --remove-orphans 2>/dev/null || true

# Start MongoDB
echo -e "${YELLOW}🗄️ Starting MongoDB...${NC}"
docker-compose up -d mongodb

# Wait for MongoDB
wait_for_service localhost 27017 "MongoDB"

# Install backend dependencies
echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
cd backend && npm install

# Seed development database
echo -e "${YELLOW}🌱 Seeding development database...${NC}"
npm run seed:dev

# Start backend in background
echo -e "${YELLOW}🚀 Starting backend server...${NC}"
npm run dev &
BACKEND_PID=$!

# Wait for backend
wait_for_service localhost 5000 "Backend API"

# Install frontend dependencies
echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
cd ../frontend && npm install

# Start frontend
echo -e "${YELLOW}🎨 Starting frontend server...${NC}"
npm run dev &
FRONTEND_PID=$!

# Wait for frontend
wait_for_service localhost 5173 "Frontend"

# Display URLs
echo ""
echo -e "${GREEN}🎉 Development environment is ready!${NC}"
echo ""
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:5000"
echo "🗄️ MongoDB: mongodb://localhost:27017/sci_invest"
echo ""
echo "🧪 Run tests:"
echo "  - Backend tests: npm run test:backend"
echo "  - Frontend E2E: npm run test:frontend"
echo "  - All tests: npm run test:all"
echo ""
echo "🛑 To stop all services, press Ctrl+C"

# Wait for interrupt
trap "echo -e '${YELLOW}🛑 Shutting down...${NC}'; kill $BACKEND_PID $FRONTEND_PID; docker-compose down; exit" INT
wait
