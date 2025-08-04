# Environment Variables Guide

This guide provides the complete environment variables needed for deploying your SmartShort URL shortener application.

## 🚀 Render (Backend) Environment Variables

Add these environment variables in your Render dashboard under your backend service:

```bash
# Database Configuration
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/smartshort?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=production

# CORS Configuration (Your Vercel frontend URL)
CORS_ORIGIN=https://urlshortner-gold.vercel.app

# Base URL for short links (Your Render backend URL)
BASE_URL=https://urlshortner-b2sf.onrender.com

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here_minimum_32_characters
JWT_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
HELMET_ENABLED=true
REQUEST_SIZE_LIMIT=10mb

# Logging
LOG_LEVEL=info
ENABLE_REQUEST_LOGGING=true

# AI Service (Optional - for AI-powered analytics)
OPENAI_API_KEY=your_openai_api_key_here

# Email Configuration (Optional - for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## 🎨 Vercel (Frontend) Environment Variables

Add these environment variables in your Vercel dashboard under your frontend project:

```bash
# NextAuth Configuration
NEXTAUTH_URL=https://urlshortner-gold.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret_key_here_generate_strong_secret_minimum_32_characters

# Google OAuth (Optional - for Google login)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# API Configuration (Your Render backend URL)
NEXT_PUBLIC_API_BASE_URL=https://urlshortner-b2sf.onrender.com
NEXT_PUBLIC_SOCKET_URL=https://urlshortner-b2sf.onrender.com

# App Configuration
NEXT_PUBLIC_APP_NAME=SmartShort
NEXT_PUBLIC_APP_DESCRIPTION=AI-Powered Real-Time URL Shortener

# Database Configuration (Same as backend for client-side operations)
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/smartshort?retryWrites=true&w=majority
```

## 🔧 Local Development Environment Variables

### Backend (.env file in server/ directory)

```bash
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/smartshort

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Base URL for short links
BASE_URL=http://localhost:5000

# JWT Configuration
JWT_SECRET=your_local_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
HELMET_ENABLED=true
REQUEST_SIZE_LIMIT=10mb

# Logging
LOG_LEVEL=debug
ENABLE_REQUEST_LOGGING=true

# AI Service (Optional)
OPENAI_API_KEY=your_openai_api_key_here

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### Frontend (.env.local file in client/ directory)

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_local_nextauth_secret_key_here

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000

# App Configuration
NEXT_PUBLIC_APP_NAME=SmartShort
NEXT_PUBLIC_APP_DESCRIPTION=AI-Powered Real-Time URL Shortener

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/smartshort
```

## 🔑 Important Notes

### 1. JWT Secret Generation
Generate a strong JWT secret:
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32
```

### 2. NextAuth Secret Generation
Generate a strong NextAuth secret:
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Using OpenSSL
openssl rand -base64 32
```

### 3. MongoDB Atlas Setup
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user with read/write permissions
4. Get your connection string
5. Replace `your_username`, `your_password`, and `your_cluster` in the MONGODB_URI

### 4. Google OAuth Setup (Optional)
1. Go to Google Cloud Console
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://urlshortner-gold.vercel.app/api/auth/callback/google`

### 5. URL Formatting
The application automatically handles trailing slashes to prevent double slashes in URLs. The environment variables should NOT have trailing slashes:

✅ **Correct:**
```
BASE_URL=https://urlshortner-b2sf.onrender.com
NEXT_PUBLIC_API_BASE_URL=https://urlshortner-b2sf.onrender.com
```

❌ **Incorrect:**
```
BASE_URL=https://urlshortner-b2sf.onrender.com/
NEXT_PUBLIC_API_BASE_URL=https://urlshortner-b2sf.onrender.com/
```

## 🚨 Security Checklist

- [ ] Use strong, unique secrets for JWT and NextAuth
- [ ] Enable HTTPS in production
- [ ] Set appropriate CORS origins
- [ ] Configure rate limiting
- [ ] Use environment-specific database connections
- [ ] Keep API keys secure and never commit them to version control
- [ ] Regularly rotate secrets and API keys

## 🔍 Troubleshooting

### Common Issues:

1. **CORS Errors**: Ensure `CORS_ORIGIN` matches your frontend URL exactly
2. **Database Connection**: Verify MongoDB URI format and credentials
3. **Authentication Issues**: Check JWT and NextAuth secrets are properly set
4. **URL Redirect Issues**: Ensure `BASE_URL` has no trailing slash
5. **Socket.IO Connection**: Verify `NEXT_PUBLIC_SOCKET_URL` matches backend URL

### Testing Environment Variables:

```bash
# Test backend connection
curl https://urlshortner-b2sf.onrender.com/api/health

# Test frontend connection
curl https://urlshortner-gold.vercel.app

# Test API endpoints
curl https://urlshortner-b2sf.onrender.com/api
```

## 📝 Deployment Checklist

### Render (Backend):
- [ ] Set all environment variables
- [ ] Configure build command: `npm install && npm run build`
- [ ] Set start command: `npm start`
- [ ] Enable auto-deploy from main branch

### Vercel (Frontend):
- [ ] Set all environment variables
- [ ] Configure build command: `npm run build`
- [ ] Set output directory: `.next`
- [ ] Enable auto-deploy from main branch

## 🔗 Quick Links

- **Frontend**: https://urlshortner-gold.vercel.app
- **Backend API**: https://urlshortner-b2sf.onrender.com
- **Health Check**: https://urlshortner-b2sf.onrender.com/api/health
- **API Documentation**: https://urlshortner-b2sf.onrender.com/api 