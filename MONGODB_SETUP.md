# MongoDB Setup for Local Development

## 🚀 Quick Solutions

### Option 1: Use MongoDB Atlas (Recommended - No Local Setup)

1. Go to https://www.mongodb.com/atlas
2. Create free account
3. Create a cluster (free tier)
4. Get your connection string
5. Update your `.env` file:

```bash
# In server/.env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smartshort?retryWrites=true&w=majority
```

### Option 2: Install MongoDB Locally

**Windows:**
1. Download from https://www.mongodb.com/try/download/community
2. Install with default settings
3. Start service: `net start MongoDB`

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt update
sudo apt install mongodb
sudo systemctl start mongod
```

### Option 3: Use Docker

```bash
docker run -d --name mongodb -p 27017:27017 mongo:latest
```

## 🔧 Environment Variables

Create `server/.env` file:

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/smartshort

# Server
PORT=5000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000

# Base URL
BASE_URL=http://localhost:5000

# JWT
JWT_SECRET=your_local_secret_here
JWT_EXPIRES_IN=7d
```

## 🧪 Test Connection

```bash
cd server
npm start
```

You should see: `✅ Connected to MongoDB`

## 🚨 If You Still Get Errors

The server will now start even without MongoDB and show helpful error messages. For production, make sure to set `MONGODB_URI` in your Render environment variables. 