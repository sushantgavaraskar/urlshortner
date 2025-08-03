# SmartShort - Vercel Deployment Guide

## 🚀 Overview

This guide covers deploying the SmartShort URL shortener application to Vercel. The application consists of:
- **Frontend**: Next.js application (deployed to Vercel)
- **Backend**: Express.js API server (deployed to Vercel Functions)
- **Database**: MongoDB Atlas (external service)

## 📋 Prerequisites

- Vercel account (free tier available)
- MongoDB Atlas account
- Google OAuth credentials (optional)
- GitHub repository with your code

## 🏗️ Architecture

### Frontend (Next.js)
- **Platform**: Vercel
- **Framework**: Next.js 15
- **Features**: Server-side rendering, API routes, authentication

### Backend (Express.js)
- **Platform**: Vercel Functions
- **Framework**: Express.js
- **Features**: REST API, Socket.IO, AI integration

### Database
- **Platform**: MongoDB Atlas
- **Features**: Cloud database with connection pooling

## 📁 Project Structure for Vercel

```
url_shortner/
├── client/                 # Next.js frontend (deployed to Vercel)
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # React components
│   │   ├── lib/           # Database and utilities
│   │   └── utils/         # API utilities
│   ├── package.json
│   └── next.config.mjs
├── server/                # Express.js backend (deployed as Vercel Functions)
│   ├── api/              # API routes for Vercel
│   ├── controllers/      # Route controllers
│   ├── models/           # MongoDB models
│   ├── services/         # Business logic
│   └── package.json
└── vercel.json           # Vercel configuration
```

## 🔧 Environment Variables

### Frontend Environment Variables (client/.env.local)

```env
# NextAuth Configuration
NEXTAUTH_URL=https://your-frontend-domain.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret_key_here_generate_strong_secret

# Google OAuth (Optional - Add your Google OAuth credentials)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# API Configuration (Update with your Vercel backend URL)
NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain.vercel.app
NEXT_PUBLIC_SOCKET_URL=https://your-backend-domain.vercel.app

# App Configuration
NEXT_PUBLIC_APP_NAME=SmartShort
NEXT_PUBLIC_APP_DESCRIPTION=AI-Powered Real-Time URL Shortener

# Database Configuration (Same as backend for client-side operations)
MONGODB_URI=mongodb+srv://urlshort:sushantno111@cluster0.akpgore.mongodb.net/urlshort
```

### Backend Environment Variables (server/.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# MongoDB Configuration
MONGODB_URI=mongodb+srv://urlshort:sushantno111@cluster0.akpgore.mongodb.net/urlshort

# CORS Configuration (Update with your Vercel frontend URL)
CORS_ORIGIN=https://your-frontend-domain.vercel.app

# Base URL for short links (Update with your Vercel backend URL)
BASE_URL=https://your-backend-domain.vercel.app

# AI Model Configuration
AI_MODEL_CACHE_DIR=./models
AI_SUMMARY_MAX_LENGTH=150
AI_SUMMARY_MIN_LENGTH=30

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_TO_FILE=false

# Security (Generate strong secrets for production)
SESSION_SECRET=your_session_secret_here_generate_strong_secret
JWT_SECRET=your_jwt_secret_here_generate_strong_secret

# Optional: External Services
# GEOIP_API_KEY=your_geoip_api_key
# ANALYTICS_API_KEY=your_analytics_api_key
```

## 🚀 Deployment Steps

### Step 1: Prepare Your Repository

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Create Vercel configuration**:
   Create `vercel.json` in the root directory:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "client/package.json",
         "use": "@vercel/next"
       },
       {
         "src": "server/index.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "/server/index.js"
       },
       {
         "src": "/(.*)",
         "dest": "/client/$1"
       }
     ],
     "env": {
       "NODE_ENV": "production"
     }
   }
   ```

### Step 2: Deploy Frontend to Vercel

1. **Go to Vercel Dashboard**:
   - Visit [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import your repository**:
   - Click "New Project"
   - Import your GitHub repository
   - Set the root directory to `client`

3. **Configure environment variables**:
   - Go to Project Settings → Environment Variables
   - Add all frontend environment variables from the list above

4. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete
   - Note your frontend URL (e.g., `https://your-app.vercel.app`)

### Step 3: Deploy Backend to Vercel

1. **Create a new Vercel project for backend**:
   - Create another project in Vercel
   - Set the root directory to `server`
   - Use the same repository

2. **Configure environment variables**:
   - Add all backend environment variables
   - Update `CORS_ORIGIN` with your frontend URL
   - Update `BASE_URL` with your backend URL

3. **Deploy backend**:
   - Deploy the backend project
   - Note your backend URL (e.g., `https://your-backend.vercel.app`)

### Step 4: Update Environment Variables

1. **Update frontend environment**:
   - Go to your frontend project settings
   - Update `NEXT_PUBLIC_API_BASE_URL` with your backend URL
   - Update `NEXT_PUBLIC_SOCKET_URL` with your backend URL
   - Update `NEXTAUTH_URL` with your frontend URL

2. **Update backend environment**:
   - Go to your backend project settings
   - Update `CORS_ORIGIN` with your frontend URL
   - Update `BASE_URL` with your backend URL

3. **Redeploy both projects**:
   - Trigger new deployments to apply the updated environment variables

## 🔐 Security Configuration

### Generate Strong Secrets

1. **Generate NextAuth Secret**:
   ```bash
   openssl rand -base64 32
   ```

2. **Generate Session Secret**:
   ```bash
   openssl rand -base64 32
   ```

3. **Generate JWT Secret**:
   ```bash
   openssl rand -base64 32
   ```

### Google OAuth Setup (Optional)

1. **Create Google OAuth credentials**:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials

2. **Configure authorized redirect URIs**:
   - Add: `https://your-frontend-domain.vercel.app/api/auth/callback/google`

3. **Add credentials to environment variables**:
   - `GOOGLE_CLIENT_ID`: Your Google Client ID
   - `GOOGLE_CLIENT_SECRET`: Your Google Client Secret

## 🗄️ Database Setup

### MongoDB Atlas Configuration

1. **Create MongoDB Atlas cluster**:
   - Sign up at [mongodb.com](https://mongodb.com)
   - Create a new cluster (free tier available)

2. **Configure database access**:
   - Create a database user with read/write permissions
   - Whitelist your IP address (or use 0.0.0.0/0 for all IPs)

3. **Get connection string**:
   - Go to your cluster → Connect
   - Choose "Connect your application"
   - Copy the connection string

4. **Update environment variables**:
   - Replace `MONGODB_URI` with your Atlas connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/database`

## 🔧 Vercel Configuration

### Custom Domain (Optional)

1. **Add custom domain**:
   - Go to Project Settings → Domains
   - Add your custom domain
   - Configure DNS settings as instructed

2. **Update environment variables**:
   - Update all URLs to use your custom domain

### Environment Variables Management

1. **Production vs Preview**:
   - Set environment variables for Production
   - Optionally set different values for Preview deployments

2. **Secret Management**:
   - Never commit secrets to your repository
   - Use Vercel's environment variable interface
   - Rotate secrets regularly

## 🧪 Testing Your Deployment

### Health Checks

1. **Frontend Health Check**:
   ```bash
   curl https://your-frontend-domain.vercel.app
   ```

2. **Backend Health Check**:
   ```bash
   curl https://your-backend-domain.vercel.app/api/health
   ```

3. **API Endpoint Test**:
   ```bash
   curl -X POST https://your-backend-domain.vercel.app/api/urls/create \
     -H "Content-Type: application/json" \
     -d '{"originalUrl": "https://example.com", "customAlias": "test"}'
   ```

### Functionality Tests

1. **Authentication**:
   - Test sign-in/sign-up flows
   - Verify Google OAuth (if configured)
   - Test demo login

2. **URL Shortening**:
   - Create short URLs
   - Test custom aliases
   - Verify redirects work

3. **Analytics**:
   - Check real-time statistics
   - Verify click tracking
   - Test dashboard functionality

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check build logs in Vercel dashboard
   - Verify all dependencies are in package.json
   - Ensure environment variables are set correctly

2. **CORS Errors**:
   - Verify `CORS_ORIGIN` is set correctly
   - Check that frontend and backend URLs match

3. **Database Connection Issues**:
   - Verify MongoDB Atlas connection string
   - Check IP whitelist settings
   - Ensure database user has correct permissions

4. **Authentication Issues**:
   - Verify NextAuth configuration
   - Check environment variables
   - Ensure callback URLs are correct

### Debug Mode

1. **Enable debug logging**:
   ```env
   LOG_LEVEL=debug
   NODE_ENV=development
   ```

2. **Check Vercel function logs**:
   - Go to your project → Functions
   - Click on function to view logs

3. **Test locally with Vercel CLI**:
   ```bash
   npm i -g vercel
   vercel dev
   ```

## 📊 Monitoring and Analytics

### Vercel Analytics

1. **Enable Vercel Analytics**:
   - Go to Project Settings → Analytics
   - Enable Web Analytics

2. **Monitor performance**:
   - Check Core Web Vitals
   - Monitor function execution times
   - Track error rates

### Custom Monitoring

1. **Health check endpoints**:
   - `/api/health` for backend status
   - Frontend status page

2. **Error tracking**:
   - Implement error logging
   - Set up alerts for critical errors

## 🔄 Continuous Deployment

### Automatic Deployments

1. **Connect GitHub repository**:
   - Vercel automatically deploys on push to main branch
   - Preview deployments for pull requests

2. **Environment-specific variables**:
   - Set different variables for Production vs Preview
   - Use branch-specific configurations

### Deployment Pipeline

1. **Development workflow**:
   ```bash
   # Make changes
   git add .
   git commit -m "Update feature"
   git push origin main
   # Vercel automatically deploys
   ```

2. **Testing before production**:
   - Use preview deployments for testing
   - Verify functionality before merging to main

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [NextAuth.js Documentation](https://next-auth.js.org)

## 🎉 Success Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Vercel
- [ ] Environment variables configured
- [ ] Database connected and working
- [ ] Authentication working
- [ ] URL shortening functionality working
- [ ] Analytics and tracking working
- [ ] Custom domain configured (optional)
- [ ] SSL certificates active
- [ ] Health checks passing
- [ ] Performance optimized
- [ ] Error monitoring set up

Your SmartShort application is now ready for production use on Vercel! 🚀 