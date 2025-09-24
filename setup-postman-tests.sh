#!/bin/bash

# Solia SCI Invest - Postman Test Setup Script
echo "🚀 Setting up Solia SCI Invest Postman tests..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if backend dependencies are installed
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    # shellcheck disable=SC2164
    cd backend
    npm install
    # shellcheck disable=SC2103
    cd ..
fi

# Start the backend server in development mode
echo "🔧 Starting backend server..."
# shellcheck disable=SC2164
cd backend
npm run dev &
BACKEND_PID=$!
# shellcheck disable=SC2103
cd ..

# Wait a few seconds for the server to start
echo "⏳ Waiting for server to start..."
sleep 5

# Check if server is running
if curl -s http://localhost:4000/api/health > /dev/null; then
    echo "✅ Backend server is running on http://localhost:4000"
else
    echo "❌ Backend server failed to start. Please check manually:"
    echo "   cd backend && npm run dev"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Open Postman"
echo "2. Import: Solia-SCI-Invest.postman_collection.json"
echo "3. Import: SCI_Solia_Invest.postman_environment.json"
echo "4. Set 'investorId' manually in environment variables"
echo "5. Run the collection manually or use the Runner workflow"
echo ""
echo "💡 For automated testing, use: Solia-SCI-Invest-Postman-Runner.json"
echo "📖 See POSTMAN_WORKFLOW_GUIDE.md for detailed instructions"

# Keep script running to keep backend alive
echo ""
echo "Press Ctrl+C to stop the backend server"
wait $BACKEND_PID
