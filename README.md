# SmartShort - AI-Powered URL Shortener

A modern, full-stack URL shortening application with AI-powered analytics, real-time tracking, and beautiful UI.

## 🌐 Live Demo

- **Frontend**: [https://urlshortner-gold.vercel.app](https://urlshortner-gold.vercel.app)
- **Backend API**: [https://urlshortner-b2sf.onrender.com](https://urlshortner-b2sf.onrender.com)
- **Dashboard**: [https://urlshortner-gold.vercel.app/dashboard](https://urlshortner-gold.vercel.app/dashboard)

## 🚀 Features

- **AI-Powered Analytics**: Intelligent insights about your links with AI-generated summaries
- **Real-Time Tracking**: Live click monitoring and statistics with Socket.IO
- **Custom Aliases**: Create memorable short URLs with custom slugs
- **Expiration Dates**: Set automatic link expiration for temporary links
- **Beautiful UI**: Modern, responsive design with dark mode support
- **Authentication**: Google OAuth and email/password login with NextAuth.js
- **Socket.IO**: Real-time updates and notifications
- **MongoDB**: Scalable database with proper indexing and data persistence
- **Rate Limiting**: Built-in protection against abuse
- **Analytics Dashboard**: Comprehensive insights and performance metrics

## 🏗️ Architecture

- **Frontend**: Next.js 15 with App Router and TypeScript
- **Backend**: Express.js API server with middleware
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js with multiple providers
- **Real-time**: Socket.IO for live updates
- **Styling**: Tailwind CSS with custom components
- **Deployment**: Vercel (Frontend) + Render (Backend)
- **Containerization**: Docker & Docker Compose

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
│   │   │   ├── analytics/ # Analytics dashboard
│   │   │   ├── auth/      # Authentication pages
│   │   │   ├── dashboard/ # Main dashboard
│   │   │   ├── profile/   # User profile
│   │   │   └── api/       # API routes
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
MONGODB_URI=mongodb+srv://urlshort:sushantno111@cluster0.akpgore.mongodb.net/urlshort

# CORS Configuration
CORS_ORIGIN=https://urlshortner-gold.vercel.app
BASE_URL=https://urlshortner-b2sf.onrender.com

# Security
SESSION_SECRET=your_session_secret
JWT_SECRET=your_jwt_secret
```

#### Frontend (client/.env.local)
```env
# NextAuth Configuration
NEXTAUTH_URL=https://urlshortner-gold.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret

# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://urlshortner-b2sf.onrender.com
NEXT_PUBLIC_SOCKET_URL=https://urlshortner-b2sf.onrender.com

# App Configuration
NEXT_PUBLIC_APP_NAME=SmartShort
NEXT_PUBLIC_APP_DESCRIPTION=AI-Powered Real-Time URL Shortener
```

## 🚀 Deployment

### Production Deployment URLs
- **Frontend (Vercel)**: [https://urlshortner-gold.vercel.app](https://urlshortner-gold.vercel.app)
- **Backend (Render)**: [https://urlshortner-b2sf.onrender.com](https://urlshortner-b2sf.onrender.com)
- **Dashboard**: [https://urlshortner-gold.vercel.app/dashboard](https://urlshortner-gold.vercel.app/dashboard)

### Docker Deployment
```bash
# Production deployment
docker-compose up -d

# Development deployment
docker-compose -f docker-compose.dev.yml up
```

### Manual Deployment
1. Set up MongoDB Atlas cluster
2. Configure environment variables with production URLs
3. Deploy frontend to Vercel
4. Deploy backend to Render

See [VERCEL_DEPLOYMENT_GUIDE.md](VERCEL_DEPLOYMENT_GUIDE.md) for detailed instructions.

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
- **NextAuth.js**: Secure session management
- **Demo Account**: Quick testing with demo credentials

## 🎨 UI Features

- **Responsive Design**: Works on all devices and screen sizes
- **Dark Mode**: Toggle between light and dark themes
- **Real-Time Updates**: Live statistics and notifications via Socket.IO
- **Modern Animations**: Smooth transitions and effects
- **Accessibility**: WCAG compliant design
- **Loading States**: Optimistic UI updates
- **Error Handling**: User-friendly error messages

## 🧪 Testing

```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd client
npm test

# Run E2E tests
cd client
npm run test:e2e
```

## 📚 Documentation

- [Vercel Deployment Guide](VERCEL_DEPLOYMENT_GUIDE.md)
- [Quick Start Guide](QUICK_START.md)
- [Production Readiness Summary](PRODUCTION_READINESS_SUMMARY.md)
- [Setup Guide](SETUP_GUIDE.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For issues and questions:
1. Check the documentation
2. Review existing issues
3. Create a new issue with detailed information

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

## 🔗 Links

- **Live Application**: [https://urlshortner-gold.vercel.app](https://urlshortner-gold.vercel.app)
- **API Documentation**: [https://urlshortner-b2sf.onrender.com/api/health](https://urlshortner-b2sf.onrender.com/api/health)
- **GitHub Repository**: [Repository URL]
- **Issue Tracker**: [GitHub Issues]

---

Built with ❤️ using Next.js, Express.js, MongoDB, and Docker.

**Deployed on Vercel & Render** 