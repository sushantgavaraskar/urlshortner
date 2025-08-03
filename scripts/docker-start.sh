#!/bin/bash

# SmartShort Docker Quick Start Script
# This script sets up and starts the SmartShort application using Docker

set -e

echo "🚀 SmartShort Docker Quick Start"
echo "================================"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose and try again."
    exit 1
fi

# Function to check if port is available
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "❌ Port $port is already in use. Please stop the service using port $port and try again."
        exit 1
    fi
}

# Check if required ports are available
echo "🔍 Checking port availability..."
check_port 3000
check_port 5000
check_port 27017

echo "✅ Ports are available"

# Copy environment files if they don't exist
echo "📝 Setting up environment files..."

# Root .env file
if [ ! -f ".env" ]; then
    echo "📄 Creating .env file from env.example..."
    cp env.example .env
fi

# Backend .env file
if [ ! -f "server/.env" ]; then
    echo "📄 Creating server/.env file from env.example..."
    cp server/env.example server/.env
fi

# Frontend .env.local file
if [ ! -f "client/.env.local" ]; then
    echo "📄 Creating client/.env.local file from env.example..."
    cp client/env.example client/.env.local
fi

echo "✅ Environment files are ready"

# Generate SSL certificates if they don't exist
if [ ! -f "nginx/ssl/cert.pem" ] || [ ! -f "nginx/ssl/key.pem" ]; then
    echo "🔐 Generating SSL certificates..."
    ./scripts/generate-ssl.sh
fi

# Build and start services
echo "🔨 Building Docker images..."
docker-compose build

echo "🚀 Starting services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service health
echo "🏥 Checking service health..."

# Check MongoDB
if docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    echo "✅ MongoDB is ready"
else
    echo "⚠️  MongoDB is still starting..."
fi

# Check Backend
if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "✅ Backend API is ready"
else
    echo "⚠️  Backend API is still starting..."
fi

# Check Frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is ready"
else
    echo "⚠️  Frontend is still starting..."
fi

echo ""
echo "🎉 SmartShort is starting up!"
echo ""
echo "📱 Access your application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000"
echo "   Health Check: http://localhost:5000/api/health"
echo ""
echo "📊 View logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 Stop services:"
echo "   docker-compose down"
echo ""
echo "🔄 Restart services:"
echo "   docker-compose restart"
echo ""
echo "🧹 Clean up:"
echo "   docker-compose down -v"
echo ""
echo "📚 For more information, see DOCKER_DEPLOYMENT_GUIDE.md" 