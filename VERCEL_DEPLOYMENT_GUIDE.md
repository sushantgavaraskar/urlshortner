# Vercel Frontend + Render Backend Deployment Guide

This guide will help you deploy your SmartShort URL shortener application with the frontend on Vercel and backend on Render.

## 🚀 Deployment Architecture

- **Frontend**: Next.js app deployed on Vercel
- **Backend**: Node.js/Express server deployed on Render
- **Database**: MongoDB Atlas (cloud database)

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **MongoDB Atlas Account**: Sign up at [mongodb.com/atlas](https://mongodb.com/atlas)
4. **GitHub Repository**: Your code should be in a GitHub repository

## 🔧 Backend Deployment (Render)

### Step 1: Deploy Backend to Render

1. **Go to Render Dashboard**
   - Visit [dashboard.render.com](https://dashboard.render.com)
   - Click "New +" and select "Web Service"

2. **Connect Repository**
   - Connect your GitHub repository
   - Select the repository containing your code

3. **Configure Web Service**
   ```
   Name: smartshort-backend (or your preferred name)
   Root Directory: server
   Runtime: Node
   Build Command: npm ci --only=production
   Start Command: npm start
   ```

4. **Environment Variables**
   Add these environment variables in Render:
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://urlshort:sushantno111@cluster0.akpgore.mongodb.net/urlshort
   CORS_ORIGIN=https://your-frontend-domain.vercel.app
   BASE_URL=https://your-backend-domain.onrender.com
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL (e.g., `https://smartshort-backend.onrender.com`)

### Step 2: Test Backend

1. **Health Check**: Visit `https://your-backend-domain.onrender.com/api/health`
2. **Should return**: `{"status":"OK","timestamp":"...","uptime":...}`

## 🌐 Frontend Deployment (Vercel)

### Step 1: Deploy Frontend to Vercel

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"

2. **Import Repository**
   - Import your GitHub repository
   - Set the root directory to `client`

3. **Configure Project**
   ```
   Framework Preset: Next.js
   Root Directory: client
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

4. **Environment Variables**
   Add these environment variables in Vercel:
   ```
   NEXTAUTH_URL=https://your-frontend-domain.vercel.app
   NEXTAUTH_SECRET=your_generated_secret_here
   NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain.onrender.com
   NEXT_PUBLIC_SOCKET_URL=https://your-backend-domain.onrender.com
   NEXT_PUBLIC_APP_NAME=SmartShort
   NEXT_PUBLIC_APP_DESCRIPTION=AI-Powered Real-Time URL Shortener
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Note your frontend URL (e.g., `https://smartshort-frontend.vercel.app`)

### Step 2: Update Backend CORS

1. **Go back to Render Dashboard**
2. **Update Environment Variables**
   - Update `CORS_ORIGIN` with your actual Vercel frontend URL
   - Redeploy the backend service

## 🔐 Environment Variables Setup

### Backend (Render) Environment Variables

```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://urlshort:sushantno111@cluster0.akpgore.mongodb.net/urlshort
CORS_ORIGIN=https://your-frontend-domain.vercel.app
BASE_URL=https://your-backend-domain.onrender.com
```

### Frontend (Vercel) Environment Variables

```bash
NEXTAUTH_URL=https://your-frontend-domain.vercel.app
NEXTAUTH_SECRET=your_generated_secret_here
NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain.onrender.com
NEXT_PUBLIC_SOCKET_URL=https://your-backend-domain.onrender.com
NEXT_PUBLIC_APP_NAME=SmartShort
NEXT_PUBLIC_APP_DESCRIPTION=AI-Powered Real-Time URL Shortener
```

## 🔧 Configuration Files

### vercel.json (Frontend)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

## 🧪 Testing Your Deployment

### 1. Test Frontend
- Visit your Vercel frontend URL
- Should load the SmartShort landing page
- Check browser console for any API connection errors

### 2. Test Backend API
- Visit `https://your-backend-domain.onrender.com/api/health`
- Should return health status

### 3. Test URL Shortening
- Create a short URL on the frontend
- Should connect to backend and create the URL
- Test the redirect functionality

## 🔍 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `CORS_ORIGIN` in backend matches your Vercel frontend URL exactly
   - Check for trailing slashes

2. **API Connection Errors**
   - Verify `NEXT_PUBLIC_API_BASE_URL` points to your Render backend
   - Check if backend is running and accessible

3. **Environment Variables**
   - Ensure all environment variables are set in both Vercel and Render
   - Check for typos in variable names

4. **Build Errors**
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are properly installed

### Debug Steps

1. **Check Backend Logs**
   - Go to Render dashboard → Your service → Logs
   - Look for any error messages

2. **Check Frontend Logs**
   - Go to Vercel dashboard → Your project → Functions
   - Check for any build or runtime errors

3. **Test API Endpoints**
   - Use tools like Postman or curl to test backend endpoints directly
   - Verify each endpoint returns expected responses

## 🔄 Continuous Deployment

Both Vercel and Render support automatic deployments:

- **Vercel**: Automatically deploys on every push to main branch
- **Render**: Automatically deploys on every push to main branch

## 📊 Monitoring

### Vercel Analytics
- Enable Vercel Analytics for frontend performance monitoring
- Track page views, performance metrics

### Render Monitoring
- Monitor backend performance in Render dashboard
- Check logs for errors and performance issues

## 🔒 Security Considerations

1. **Environment Variables**
   - Never commit sensitive data to Git
   - Use environment variables for all secrets

2. **CORS Configuration**
   - Only allow your frontend domain in CORS settings
   - Don't use wildcard (*) in production

3. **API Security**
   - Implement proper authentication
   - Rate limiting for API endpoints

## 🎉 Success!

Once deployed, your SmartShort application will be accessible at:
- **Frontend**: `https://your-frontend-domain.vercel.app`
- **Backend API**: `https://your-backend-domain.onrender.com`

The application will automatically handle URL shortening, analytics, and real-time updates across both platforms. 