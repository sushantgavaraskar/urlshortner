# SmartShort - Docker Deployment Guide

## Overview
This guide covers deploying the SmartShort URL shortener application using Docker and Docker Compose.

## Prerequisites
- Docker Engine 20.10+
- Docker Compose 2.0+
- At least 4GB RAM available
- 10GB free disk space

## Architecture
The Docker setup includes:
- **MongoDB**: Database with persistent storage
- **Backend**: Express.js API server
- **Frontend**: Next.js application
- **Nginx**: Reverse proxy with SSL (optional)

## Quick Start

### 1. Clone and Navigate
```bash
git clone <repository-url>
cd url_shortner
```

### 2. Generate SSL Certificates (Optional)
For production, replace with real certificates:
```bash
mkdir -p nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/key.pem \
  -out nginx/ssl/cert.pem \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
```

### 3. Build and Start
```bash
# Build all services
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **With Nginx**: https://localhost (if SSL configured)

## Docker Compose Services

### MongoDB
- **Image**: mongo:7.0
- **Port**: 27017
- **Volume**: Persistent data storage
- **Health Check**: Database connectivity

### Backend
- **Build**: Custom Dockerfile
- **Port**: 5000
- **Environment**: Production optimized
- **Health Check**: API endpoint

### Frontend
- **Build**: Multi-stage Dockerfile
- **Port**: 3000
- **Environment**: Production build
- **Health Check**: Web interface

### Nginx (Optional)
- **Image**: nginx:alpine
- **Ports**: 80, 443
- **Features**: SSL termination, rate limiting, compression

## Environment Configuration

The Docker setup uses environment files for configuration:

### Root Environment (.env)
```env
# MongoDB Configuration
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=password123
MONGO_DATABASE=smartshort

# Docker Configuration
DOCKER_NETWORK=smartshort-network
DOCKER_NETWORK_DEV=smartshort-network-dev
```

### Backend Environment (server/.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=production

# MongoDB Configuration
MONGODB_URI=mongodb+srv://urlshort:sushantno111@cluster0.akpgore.mongodb.net/urlshort

# CORS Configuration
CORS_ORIGIN=https://your-frontend-domain.com

# Base URL for short links
BASE_URL=https://your-backend-domain.com

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

# Security
SESSION_SECRET=your_session_secret_here
JWT_SECRET=your_jwt_secret_here
```

### Frontend Environment (client/.env.local)
```env
# NextAuth Configuration
NEXTAUTH_URL=https://your-frontend-domain.com
NEXTAUTH_SECRET=your_nextauth_secret_key_here

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain.com
NEXT_PUBLIC_SOCKET_URL=https://your-backend-domain.com

# App Configuration
NEXT_PUBLIC_APP_NAME=SmartShort
NEXT_PUBLIC_APP_DESCRIPTION=AI-Powered Real-Time URL Shortener
```

## Production Deployment

### 1. Update Environment Variables
Edit the environment files with your production values:

```bash
# Update root environment
cp env.example .env
# Edit .env with your MongoDB credentials

# Update backend environment
cp server/env.example server/.env
# Edit server/.env with your production settings

# Update frontend environment
cp client/env.example client/.env.local
# Edit client/.env.local with your production settings
```

### 2. Configure SSL Certificates
Replace self-signed certificates with real ones:
```bash
# Copy your certificates
cp your-cert.pem nginx/ssl/cert.pem
cp your-key.pem nginx/ssl/key.pem
```

### 3. Update Domain Configuration
Edit the environment files with your domain:

```bash
# In server/.env
CORS_ORIGIN=https://your-domain.com
BASE_URL=https://your-domain.com

# In client/.env.local
NEXTAUTH_URL=https://your-domain.com
NEXT_PUBLIC_API_BASE_URL=https://your-domain.com
NEXT_PUBLIC_SOCKET_URL=https://your-domain.com
```

### 4. Deploy
```bash
# Build with no cache
docker-compose build --no-cache

# Start in detached mode
docker-compose up -d

# Check status
docker-compose ps
```

## Development with Docker

### 1. Development Mode
Create `docker-compose.dev.yml`:
```yaml
version: '3.8'
services:
  backend:
    build:
      context: ./server
      dockerfile: Dockerfile.dev
    volumes:
      - ./server:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    command: npm run dev

  frontend:
    build:
      context: ./client
      dockerfile: Dockerfile.dev
    volumes:
      - ./client:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    command: npm run dev
```

### 2. Hot Reload
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

## Docker Commands

### Basic Operations
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart services
docker-compose restart

# View logs
docker-compose logs -f [service-name]

# Execute commands in containers
docker-compose exec backend npm run lint
docker-compose exec frontend npm run build
```

### Database Operations
```bash
# Access MongoDB shell
docker-compose exec mongodb mongosh

# Backup database
docker-compose exec mongodb mongodump --out /backup

# Restore database
docker-compose exec mongodb mongorestore /backup
```

### Maintenance
```bash
# Update images
docker-compose pull

# Rebuild services
docker-compose build --no-cache

# Clean up
docker-compose down -v
docker system prune -f
```

## Monitoring and Logs

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100
```

### Health Checks
```bash
# Check service health
docker-compose ps

# Test endpoints
curl http://localhost:5000/api/health
curl http://localhost:3000
```

### Resource Usage
```bash
# View resource usage
docker stats

# Inspect containers
docker-compose exec backend sh
docker-compose exec frontend sh
```

## Troubleshooting

### Common Issues

#### 1. Port Conflicts
```bash
# Check what's using the port
lsof -i :3000
lsof -i :5000

# Stop conflicting services
sudo systemctl stop nginx
```

#### 2. Database Connection Issues
```bash
# Check MongoDB logs
docker-compose logs mongodb

# Test connection
docker-compose exec backend node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected'))
  .catch(err => console.error(err));
"
```

#### 3. Build Failures
```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

#### 4. Memory Issues
```bash
# Check memory usage
docker stats

# Increase Docker memory limit
# Edit Docker Desktop settings
```

### Debug Mode
```bash
# Start with debug logs
docker-compose up -d
docker-compose logs -f

# Access container shell
docker-compose exec backend sh
docker-compose exec frontend sh
```

## Security Considerations

### 1. Environment Variables
- Never commit `.env` files
- Use Docker secrets for sensitive data
- Rotate secrets regularly

### 2. Network Security
- Use internal Docker networks
- Limit exposed ports
- Configure firewall rules

### 3. Container Security
- Run containers as non-root users
- Keep base images updated
- Scan for vulnerabilities

### 4. SSL/TLS
- Use real certificates in production
- Configure proper SSL settings
- Enable HSTS headers

## Performance Optimization

### 1. Resource Limits
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'
```

### 2. Caching
- Enable Docker layer caching
- Use multi-stage builds
- Optimize Dockerfile instructions

### 3. Monitoring
- Set up resource monitoring
- Configure log aggregation
- Implement health checks

## Backup and Recovery

### 1. Database Backup
```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose exec mongodb mongodump --out /backup/$DATE
docker cp smartshort-mongodb:/backup/$DATE ./backups/
EOF

chmod +x backup.sh
```

### 2. Application Backup
```bash
# Backup configuration
tar -czf config-backup.tar.gz docker-compose.yml nginx/ mongo-init.js

# Backup data
docker-compose exec mongodb mongodump --out /backup
docker cp smartshort-mongodb:/backup ./data-backup/
```

### 3. Recovery
```bash
# Restore database
docker-compose exec mongodb mongorestore /backup

# Restore configuration
tar -xzf config-backup.tar.gz
```

## Scaling

### 1. Horizontal Scaling
```bash
# Scale backend services
docker-compose up -d --scale backend=3

# Scale frontend services
docker-compose up -d --scale frontend=2
```

### 2. Load Balancing
- Configure Nginx load balancing
- Use Docker Swarm for orchestration
- Implement service discovery

## CI/CD Integration

### 1. GitHub Actions
```yaml
name: Docker Build and Deploy
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build and push
        run: |
          docker-compose build
          docker-compose push
```

### 2. Automated Deployment
- Set up automated builds
- Configure deployment pipelines
- Implement rollback procedures

This Docker deployment guide provides a complete solution for containerizing and deploying the SmartShort application with proper security, monitoring, and scalability considerations. 