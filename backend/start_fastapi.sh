#!/bin/bash

# Script to start the FastAPI backend server

echo "Starting FastAPI backend server..."
echo "The server will be available at http://localhost:8000"
echo "API documentation (Swagger UI): http://localhost:8000/docs"
echo ""

cd "$(dirname "$0")"
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
