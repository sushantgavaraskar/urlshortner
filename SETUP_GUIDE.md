# SmartShort Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud)
- Git

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd url_shortner

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Environment Configuration

#### Backend (.env in server/ directory)
```bash
# Database
MONGODB_URI=mongodb://localhost:27017/smartshort

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000

# Base URL for short links
BASE_URL=http://localhost:5000
```

#### Frontend (.env.local in client/ directory)
```bash
# NextAuth.js
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### 3. Database Setup

#### Local MongoDB
```bash
# Start MongoDB (if not running)
mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in backend .env

### 4. Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret to frontend .env.local

### 5. Start the Application

#### Terminal 1 - Backend
```bash
cd server
npm run dev
```

#### Terminal 2 - Frontend
```bash
cd client
npm run dev
```

### 6. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 🧪 Testing the Application

### Demo User Login
- **Email**: `demo@example.com`
- **Password**: `demo123`

### Create Demo Data
```bash
# Using curl
curl -X POST http://localhost:5000/api/test/setup-demo

# Or visit in browser
http://localhost:5000/api/test/setup-demo
```

### Test API Endpoints
```bash
# Health check
curl http://localhost:5000/api/health

# Get demo user info
curl http://localhost:5000/api/test/demo-user

# Get global stats
curl http://localhost:5000/api/analytics/global/stats
```

## 🔧 Development Workflow

### Backend Development
```bash
cd server
npm run dev  # Auto-restart on changes
```

### Frontend Development
```bash
cd client
npm run dev  # Hot reload enabled
```

### Database Management
```bash
# MongoDB shell
mongosh

# Use database
use smartshort

# View collections
show collections

# View documents
db.urls.find()
db.users.find()
```

## 🐛 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
```
Error: MongoDB connection error
```
**Solution**: Ensure MongoDB is running and connection string is correct

#### 2. CORS Error
```
Access to fetch at 'http://localhost:5000' from origin 'http://localhost:3000' has been blocked
```
**Solution**: Check CORS_ORIGIN in backend .env

#### 3. NextAuth Error
```
Error: Invalid NEXTAUTH_SECRET
```
**Solution**: Generate a new secret: `openssl rand -base64 32`

#### 4. Socket.IO Connection Error
```
Socket connection failed
```
**Solution**: Check NEXT_PUBLIC_SOCKET_URL in frontend .env.local

### Debug Mode

#### Backend Debug
```bash
cd server
DEBUG=* npm run dev
```

#### Frontend Debug
```bash
cd client
NODE_ENV=development npm run dev
```

## 📊 Monitoring

### Backend Logs
- Check `server/logs/app.log` for application logs
- Check `server/logs/error.log` for error logs

### Frontend Logs
- Browser Developer Tools Console
- Network tab for API requests

### Database Monitoring
```bash
# MongoDB stats
mongosh --eval "db.stats()"

# Collection stats
mongosh --eval "db.urls.stats()"
```

## 🚀 Production Deployment

### Environment Variables
Update environment variables for production:

```bash
# Backend
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
CORS_ORIGIN=https://yourdomain.com
BASE_URL=https://yourdomain.com

# Frontend
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
NEXT_PUBLIC_SOCKET_URL=https://api.yourdomain.com
```

### Build Commands
```bash
# Backend
cd server
npm run build
npm start

# Frontend
cd client
npm run build
npm start
```

## 📚 Additional Resources

- [Backend API Documentation](./BACKEND_API_DOCUMENTATION.md)
- [Full-Stack Sync Summary](./FULL_STACK_SYNC_SUMMARY.md)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Socket.IO Documentation](https://socket.io/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)

## 🤝 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the documentation
3. Check GitHub issues
4. Create a new issue with detailed information

---

**Happy coding! 🎉** 