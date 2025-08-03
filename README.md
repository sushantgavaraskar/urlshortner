# SmartShort - AI-Powered URL Shortener

A modern, full-stack URL shortening application with AI-powered analytics, real-time tracking, and beautiful UI.

## 🚀 Features

- **AI-Powered Analytics**: Intelligent insights about your links
- **Real-Time Tracking**: Live click monitoring and statistics
- **Custom Aliases**: Create memorable short URLs
- **Expiration Dates**: Set automatic link expiration
- **Beautiful UI**: Modern, responsive design with dark mode
- **Authentication**: Google OAuth and email/password login
- **Socket.IO**: Real-time updates and notifications
- **MongoDB**: Scalable database with proper indexing

## 🏗️ Architecture

- **Frontend**: Next.js 15 with TypeScript
- **Backend**: Express.js API server
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Real-time**: Socket.IO
- **Styling**: Tailwind CSS
- **Deployment**: Docker & Docker Compose

## 🐳 Quick Start with Docker

### Prerequisites
- Docker Engine 20.10+
- Docker Compose 2.0+
- 4GB RAM available

### 1. Clone the Repository
```bash
git clone <repository-url>
cd url_shortner
```

### 2. Start with Docker
```bash
# Quick start (recommended)
./scripts/docker-start.sh

# Or manually
docker-compose up -d
```

### 3. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Install Dependencies
```bash
# Backend
cd server
npm install

# Frontend
cd client
npm install
```

### 2. Environment Configuration
```bash
# Root environment (for MongoDB)
cp env.example .env
# Edit .env with your MongoDB configuration

# Backend (.env)
cp server/env.example server/.env
# Edit server/.env with your configuration

# Frontend (.env.local)
cp client/env.example client/.env.local
# Edit client/.env.local with your configuration
```

### 3. Start Development Servers
```bash
# Backend (Terminal 1)
cd server
npm run dev

# Frontend (Terminal 2)
cd client
npm run dev
```

## 🐳 Docker Development

### Development Mode with Hot Reload
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

### Production Mode
```bash
# Build and start production services
docker-compose up -d

# View logs
docker-compose logs -f
```

## 📁 Project Structure

```
url_shortner/
├── client/                 # Next.js frontend
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Database and utilities
│   │   └── utils/         # API utilities
│   ├── Dockerfile         # Production Dockerfile
│   └── Dockerfile.dev     # Development Dockerfile
├── server/                # Express.js backend
│   ├── controllers/       # Route controllers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── utils/            # Utilities
│   ├── jobs/             # Scheduled jobs
│   ├── Dockerfile        # Production Dockerfile
│   └── Dockerfile.dev    # Development Dockerfile
├── nginx/                # Nginx configuration
├── scripts/              # Utility scripts
├── docker-compose.yml    # Production Docker Compose
├── docker-compose.dev.yml # Development Docker Compose
└── mongo-init.js         # MongoDB initialization
```

## 🔧 Configuration

### Environment Variables

#### Root (.env)
```env
# MongoDB Configuration
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=password123
MONGO_DATABASE=smartshort
```

#### Backend (server/.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=production

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/smartshort

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
BASE_URL=http://localhost:5000

# Security
SESSION_SECRET=your_session_secret
JWT_SECRET=your_jwt_secret
```

#### Frontend (client/.env.local)
```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000

# App Configuration
NEXT_PUBLIC_APP_NAME=SmartShort
NEXT_PUBLIC_APP_DESCRIPTION=AI-Powered Real-Time URL Shortener
```

## 🚀 Deployment

### Docker Deployment
```bash
# Production deployment
docker-compose up -d

# Development deployment
docker-compose -f docker-compose.dev.yml up
```

### Manual Deployment
1. Set up MongoDB (Atlas recommended)
2. Configure environment variables
3. Build and deploy frontend to Vercel/Netlify
4. Deploy backend to Railway/DigitalOcean

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

## 📊 API Endpoints

### URL Management
- `POST /api/urls/create` - Create short URL
- `GET /api/urls/user` - Get user's URLs
- `GET /api/urls/:urlId` - Get URL details
- `PUT /api/urls/:urlId` - Update URL
- `DELETE /api/urls/:urlId` - Delete URL

### Analytics
- `GET /api/analytics/user/stats` - User statistics
- `GET /api/analytics/url/:urlId/performance` - URL performance

### Health Check
- `GET /api/health` - Application health

## 🔐 Authentication

- **Google OAuth**: Social login integration
- **Email/Password**: Traditional authentication
- **Demo Account**: Quick testing with demo credentials

## 🎨 UI Features

- **Responsive Design**: Works on all devices
- **Dark Mode**: Toggle between light and dark themes
- **Real-Time Updates**: Live statistics and notifications
- **Modern Animations**: Smooth transitions and effects
- **Accessibility**: WCAG compliant design

## 🧪 Testing

```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd client
npm test
```

## 📚 Documentation

- [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [Docker Deployment Guide](DOCKER_DEPLOYMENT_GUIDE.md)
- [Production Readiness Summary](PRODUCTION_READINESS_SUMMARY.md)
- [Setup Guide](SETUP_GUIDE.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the documentation
2. Review existing issues
3. Create a new issue with details

## 🚀 Quick Commands

```bash
# Start with Docker
./scripts/docker-start.sh

# Development with Docker
docker-compose -f docker-compose.dev.yml up

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Clean up
docker-compose down -v
docker system prune -f
```

---

Built with ❤️ using Next.js, Express.js, MongoDB, and Docker. 