import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cron from 'node-cron';

// Load environment variables
dotenv.config();

// Import middleware
import {
  errorHandler,
  notFoundHandler,
  responseFormatter,
  corsOptions,
  securityHeaders,
  requestLogger,
  requestSizeLimiter,
  xssProtection,
  sqlInjectionProtection,
  healthCheck,
  createRateLimiter
} from './middleware/index.js';

// Import routes
import urlRoutes from './routes/urlRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

// Import socket handler
import socketHandler from './utils/socket.js';

// Import cleanup job
import cleanupExpiredUrls from './jobs/cleanupExpiredUrls.js';

const app = express();
const server = createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Security middleware
app.use(securityHeaders);
app.use(cors(corsOptions));
app.use(requestSizeLimiter('10mb'));

// Request parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// Custom middleware
app.use(requestLogger);
app.use(xssProtection);
app.use(sqlInjectionProtection);
app.use(responseFormatter);
app.use(healthCheck);

// Rate limiting
const limiter = createRateLimiter(15 * 60 * 1000, 100); // 100 requests per 15 minutes
app.use('/api/', limiter);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smartshort')
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/urls', urlRoutes);
app.use('/api/analytics', analyticsRoutes);

// Redirect route for short URLs
app.get('/r/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;
    const urlController = await import('./controllers/urlController.js');
    await urlController.default.redirectToOriginal(req, res);
  } catch (error) {
    res.status(404).json({ error: 'URL not found or expired' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Debug endpoint to test routing
app.get('/api/debug', (req, res) => {
  res.json({
    message: 'Backend is working!',
    env: {
      NODE_ENV: process.env.NODE_ENV,
      CORS_ORIGIN: process.env.CORS_ORIGIN,
      BASE_URL: process.env.BASE_URL,
      MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not Set'
    },
    routes: [
      '/api/health',
      '/api/debug',
      '/api/urls/*',
      '/api/analytics/*',
      '/r/:shortCode'
    ]
  });
});

// Make io available to routes
app.set('io', io);

// Socket.IO connection handler
socketHandler(io);

// Schedule cleanup job (runs every hour)
cron.schedule('0 * * * *', () => {
  console.log('🧹 Running cleanup job...');
  cleanupExpiredUrls();
});

// 404 handler (must be before error handler)
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
}); 