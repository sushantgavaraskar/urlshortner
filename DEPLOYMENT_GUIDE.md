# SmartShort - Production Deployment Guide

## Overview
This guide covers deploying the SmartShort URL shortener application to production environments.

## Prerequisites
- Node.js 18+ 
- MongoDB database (Atlas or self-hosted)
- Domain names for frontend and backend
- SSL certificates
- Environment variables configured

## Architecture
- **Frontend**: Next.js 15 application
- **Backend**: Express.js API server
- **Database**: MongoDB
- **Authentication**: NextAuth.js
- **Real-time**: Socket.IO

## Environment Configuration

### Backend Environment Variables
Create a `.env` file in the `server/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smartshort

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

# Optional: External Services
GEOIP_API_KEY=your_geoip_api_key
ANALYTICS_API_KEY=your_analytics_api_key
```

### Frontend Environment Variables
Create a `.env.local` file in the `client/` directory:

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

## Deployment Steps

### 1. Backend Deployment

#### Option A: Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set the root directory to `server/`
3. Configure environment variables in Vercel dashboard
4. Deploy

#### Option B: Railway
1. Connect your GitHub repository to Railway
2. Set the root directory to `server/`
3. Configure environment variables
4. Deploy

#### Option C: DigitalOcean App Platform
1. Create a new app in DigitalOcean
2. Connect your GitHub repository
3. Set the root directory to `server/`
4. Configure environment variables
5. Deploy

### 2. Frontend Deployment

#### Option A: Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set the root directory to `client/`
3. Configure environment variables
4. Deploy

#### Option B: Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Configure environment variables
5. Deploy

### 3. Database Setup
1. Create a MongoDB Atlas cluster
2. Configure network access (allow your deployment IPs)
3. Create a database user with read/write permissions
4. Get your connection string and add to environment variables

### 4. Domain Configuration
1. Point your domain to your deployment
2. Configure SSL certificates
3. Update CORS settings with your domain
4. Update environment variables with your domain

## Security Considerations

### Environment Variables
- Use strong, unique secrets for `NEXTAUTH_SECRET` and `JWT_SECRET`
- Never commit `.env` files to version control
- Use different secrets for each environment

### CORS Configuration
- Only allow your frontend domain in CORS settings
- Use HTTPS in production

### Database Security
- Use MongoDB Atlas with proper authentication
- Configure network access properly
- Use strong passwords

### API Security
- Rate limiting is configured
- Input validation is implemented
- Error messages don't expose sensitive information

## Performance Optimization

### Backend
- MongoDB indexes are configured
- Connection pooling is enabled
- Static file serving is optimized
- Caching headers are set

### Frontend
- Next.js optimizations are enabled
- Image optimization is configured
- CSS is optimized
- Bundle splitting is enabled

## Monitoring and Logging

### Application Logs
- Structured logging is implemented
- Error tracking is configured
- Performance monitoring is set up

### Health Checks
- `/api/health` endpoint is available
- Database connectivity is monitored
- External service status is tracked

## Backup and Recovery

### Database Backups
- Enable MongoDB Atlas automated backups
- Set up regular backup verification
- Document recovery procedures

### Application Backups
- Version control with Git
- Deployment rollback procedures
- Environment variable backups

## Troubleshooting

### Common Issues
1. **CORS Errors**: Check CORS_ORIGIN configuration
2. **Database Connection**: Verify MongoDB URI and network access
3. **Authentication Issues**: Check NextAuth configuration
4. **Socket.IO Issues**: Verify WebSocket configuration

### Debug Mode
To enable debug mode, set `NODE_ENV=development` in your environment variables.

## Support
For issues and questions:
1. Check the application logs
2. Verify environment variable configuration
3. Test database connectivity
4. Check network and firewall settings

## Updates and Maintenance

### Regular Updates
- Keep dependencies updated
- Monitor security advisories
- Update SSL certificates
- Review and update environment variables

### Backup Strategy
- Daily database backups
- Weekly application backups
- Monthly disaster recovery tests

## Performance Monitoring

### Key Metrics
- Response times
- Error rates
- Database performance
- Memory usage
- CPU utilization

### Alerts
- Set up monitoring alerts
- Configure error notifications
- Monitor uptime
- Track user engagement

This deployment guide ensures a secure, scalable, and maintainable production environment for SmartShort. 