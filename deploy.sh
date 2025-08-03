#!/bin/bash

echo "🚀 SmartShort Deployment Script"
echo "================================"
echo ""
echo "This script will help you deploy SmartShort to Vercel (Frontend) and Render (Backend)"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Not in a git repository. Please initialize git and commit your changes first."
    exit 1
fi

echo "✅ Git repository detected"
echo ""

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  You have uncommitted changes. Please commit them before deploying."
    echo "   Run: git add . && git commit -m 'Prepare for deployment'"
    echo ""
    read -p "Do you want to continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo "📋 Deployment Steps:"
echo "==================="
echo ""
echo "1. 🖥️  Backend Deployment (Render)"
echo "   - Go to https://dashboard.render.com"
echo "   - Create new Web Service"
echo "   - Connect your GitHub repository"
echo "   - Set Root Directory to: server"
echo "   - Set Build Command to: npm ci --only=production"
echo "   - Set Start Command to: npm start"
echo ""
echo "2. 🌐 Frontend Deployment (Vercel)"
echo "   - Go to https://vercel.com/dashboard"
echo "   - Create new project"
echo "   - Import your GitHub repository"
echo "   - Set Root Directory to: client"
echo "   - Deploy"
echo ""

echo "🔧 Environment Variables Setup:"
echo "=============================="
echo ""
echo "Backend (Render) Environment Variables:"
echo "NODE_ENV=production"
echo "MONGODB_URI=mongodb+srv://urlshort:sushantno111@cluster0.akpgore.mongodb.net/urlshort"
echo "CORS_ORIGIN=https://your-frontend-domain.vercel.app"
echo "BASE_URL=https://your-backend-domain.onrender.com"
echo ""
echo "Frontend (Vercel) Environment Variables:"
echo "NEXTAUTH_URL=https://your-frontend-domain.vercel.app"
echo "NEXTAUTH_SECRET=your_generated_secret_here"
echo "NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain.onrender.com"
echo "NEXT_PUBLIC_SOCKET_URL=https://your-backend-domain.onrender.com"
echo "NEXT_PUBLIC_APP_NAME=SmartShort"
echo "NEXT_PUBLIC_APP_DESCRIPTION=AI-Powered Real-Time URL Shortener"
echo ""

echo "🧪 Testing Your Deployment:"
echo "=========================="
echo ""
echo "1. Test Backend: Visit https://your-backend-domain.onrender.com/api/health"
echo "2. Test Frontend: Visit https://your-frontend-domain.vercel.app"
echo "3. Test URL Shortening: Create a short URL on the frontend"
echo ""

echo "📚 For detailed instructions, see: VERCEL_DEPLOYMENT_GUIDE.md"
echo ""

# Push to git if there are changes
if ! git diff-index --quiet HEAD --; then
    echo "📤 Pushing changes to git..."
    git add .
    git commit -m "Prepare for deployment - Remove transformers dependency"
    git push
    echo "✅ Changes pushed to git"
else
    echo "✅ No changes to push"
fi

echo ""
echo "🎉 Deployment preparation complete!"
echo ""
echo "Next steps:"
echo "1. Deploy backend to Render"
echo "2. Deploy frontend to Vercel"
echo "3. Update environment variables"
echo "4. Test the application"
echo ""
echo "For detailed instructions, see: VERCEL_DEPLOYMENT_GUIDE.md" 