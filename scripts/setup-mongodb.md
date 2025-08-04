# MongoDB Local Setup Guide

## 🚀 Quick Setup Options

### Option 1: MongoDB Community Server (Recommended)

1. **Download MongoDB Community Server**
   - Go to: https://www.mongodb.com/try/download/community
   - Download the version for your OS (Windows/macOS/Linux)
   - Install with default settings

2. **Start MongoDB Service**
   ```bash
   # Windows (as Administrator)
   net start MongoDB
   
   # macOS (using Homebrew)
   brew services start mongodb-community
   
   # Linux (Ubuntu/Debian)
   sudo systemctl start mongod
   ```

3. **Verify Installation**
   ```bash
   # Connect to MongoDB shell
   mongosh
   
   # Or the older command
   mongo
   ```

### Option 2: Docker (Easiest)

1. **Install Docker Desktop**
   - Download from: https://www.docker.com/products/docker-desktop
   - Install and start Docker Desktop

2. **Run MongoDB Container**
   ```bash
   # Pull and run MongoDB
   docker run -d --name mongodb -p 27017:27017 mongo:latest
   
   # Or with persistent data
   docker run -d --name mongodb -p 27017:27017 -v mongodb_data:/data/db mongo:latest
   ```

3. **Verify Container is Running**
   ```bash
   docker ps
   ```

### Option 3: MongoDB Atlas (Cloud - No Local Setup)

1. **Create MongoDB Atlas Account**
   - Go to: https://www.mongodb.com/atlas
   - Sign up for free account

2. **Create Cluster**
   - Choose "Free" tier
   - Select your preferred region
   - Click "Create"

3. **Set Up Database Access**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Create username/password
   - Select "Read and write to any database"

4. **Set Up Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add your specific IP

5. **Get Connection String**
   - Go to "Clusters"
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string

6. **Update Environment Variables**
   ```bash
   # In your .env file
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smartshort?retryWrites=true&w=majority
   ```

## 🔧 Environment Setup

### For Local Development

Create a `.env` file in the `server/` directory:

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
```

### For Production (Render)

Set these environment variables in your Render dashboard:

```bash
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smartshort?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=production

# CORS Configuration
CORS_ORIGIN=https://urlshortner-gold.vercel.app

# Base URL for short links
BASE_URL=https://urlshortner-b2sf.onrender.com

# JWT Configuration
JWT_SECRET=your_production_jwt_secret_key_here
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
```

## 🧪 Testing the Connection

### Test MongoDB Connection

```bash
# Start the server
cd server
npm start

# You should see:
# ✅ Connected to MongoDB
# 📊 Database: smartshort
# 🌐 Host: localhost
```

### Test API Endpoints

```bash
# Health check
curl http://localhost:5000/api/health

# API info
curl http://localhost:5000/api

# Root endpoint
curl http://localhost:5000/
```

## 🚨 Troubleshooting

### Common Issues:

1. **"ECONNREFUSED" Error**
   - MongoDB service is not running
   - Solution: Start MongoDB service (see Option 1 above)

2. **"Authentication failed" Error**
   - Wrong username/password in connection string
   - Solution: Check MongoDB Atlas credentials

3. **"Network is unreachable" Error**
   - Firewall blocking connection
   - Solution: Allow MongoDB port (27017) through firewall

4. **"Server selection timeout" Error**
   - Network issues or MongoDB Atlas IP whitelist
   - Solution: Check network and IP whitelist in Atlas

### Useful Commands:

```bash
# Check if MongoDB is running (Windows)
sc query MongoDB

# Check if MongoDB is running (macOS/Linux)
sudo systemctl status mongod

# Check if port 27017 is open
netstat -an | grep 27017

# Test MongoDB connection
mongosh mongodb://localhost:27017/smartshort
```

## 📝 Quick Start Commands

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables (create .env file)
# (See environment setup above)

# 3. Start MongoDB (choose one):
# Option A: Install MongoDB locally
# Option B: Use Docker
docker run -d --name mongodb -p 27017:27017 mongo:latest
# Option C: Use MongoDB Atlas (update MONGODB_URI)

# 4. Start the server
cd server
npm start

# 5. Test the API
curl http://localhost:5000/api/health
```

## 🔗 Useful Links

- **MongoDB Download**: https://www.mongodb.com/try/download/community
- **MongoDB Atlas**: https://www.mongodb.com/atlas
- **Docker Hub MongoDB**: https://hub.docker.com/_/mongo
- **MongoDB Documentation**: https://docs.mongodb.com/ 