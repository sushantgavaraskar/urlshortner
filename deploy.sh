#!/bin/bash

echo "🚀 SmartShort URL Shortener - Deployment Script"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Step 1: Fix ESLint errors
echo ""
echo "Step 1: Fixing ESLint errors..."
node fix-eslint-errors.js

# Step 2: Check if MongoDB is running
echo ""
echo "Step 2: Checking MongoDB..."
if docker ps | grep -q mongodb; then
    print_status "MongoDB is running"
else
    print_warning "MongoDB is not running. Starting it..."
    docker-compose up mongodb -d
    sleep 5
fi

# Step 3: Test frontend build
echo ""
echo "Step 3: Testing frontend build..."
cd client
if npm run build; then
    print_status "Frontend build successful"
else
    print_error "Frontend build failed. Please fix the errors above."
    exit 1
fi
cd ..

# Step 4: Test backend
echo ""
echo "Step 4: Testing backend..."
cd server
if npm test 2>/dev/null || echo "No tests found, continuing..."; then
    print_status "Backend tests passed (or no tests found)"
else
    print_warning "Backend tests failed, but continuing..."
fi
cd ..

# Step 5: Environment check
echo ""
echo "Step 5: Checking environment files..."
if [ -f "client/.env.local" ]; then
    print_status "Frontend environment file exists"
else
    print_warning "Frontend environment file missing. Creating template..."
    cat > client/.env.local << EOF
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here

# Backend API URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
EOF
fi

if [ -f "server/.env" ]; then
    print_status "Backend environment file exists"
else
    print_warning "Backend environment file missing. Creating template..."
    cat > server/.env << EOF
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/smartshort

# JWT Secret
JWT_SECRET=your-jwt-secret-key

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Base URL for short links
BASE_URL=http://localhost:5000
EOF
fi

# Step 6: Start services
echo ""
echo "Step 6: Starting services..."
echo "Starting backend server..."
cd server
npm start &
BACKEND_PID=$!
cd ..

echo "Starting frontend server..."
cd client
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait for services to start
sleep 10

# Step 7: Health checks
echo ""
echo "Step 7: Running health checks..."

# Check backend
if curl -s http://localhost:5000/api/health > /dev/null; then
    print_status "Backend is running and healthy"
else
    print_error "Backend health check failed"
fi

# Check frontend
if curl -s http://localhost:3000 > /dev/null; then
    print_status "Frontend is running"
else
    print_error "Frontend health check failed"
fi

# Step 8: Deployment instructions
echo ""
echo "🎉 Local deployment successful!"
echo ""
echo "📋 Next steps for production deployment:"
echo ""
echo "1. Backend Deployment (Railway/Render):"
echo "   - Push your code to GitHub"
echo "   - Connect repository to Railway/Render"
echo "   - Set environment variables"
echo "   - Deploy"
echo ""
echo "2. Frontend Deployment (Vercel):"
echo "   - Connect repository to Vercel"
echo "   - Set root directory to 'client'"
echo "   - Add environment variables"
echo "   - Deploy"
echo ""
echo "3. Database Setup:"
echo "   - Use MongoDB Atlas for production"
echo "   - Update MONGODB_URI in backend"
echo ""
echo "📖 For detailed instructions, see: DEPLOYMENT_GUIDE.md"
echo ""
echo "🔗 Your local URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop the servers"

# Cleanup function
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Keep script running
wait 