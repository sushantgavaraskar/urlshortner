import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Logger {
  constructor() {
    this.logDir = path.join(__dirname, '../logs');
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  getTimestamp() {
    return new Date().toISOString();
  }

  formatMessage(level, message, data = null) {
    const timestamp = this.getTimestamp();
    const logEntry = {
      timestamp,
      level,
      message,
      data
    };
    return JSON.stringify(logEntry);
  }

  writeToFile(filename, content) {
    // Only write to file in development or if explicitly enabled
    if (process.env.NODE_ENV === 'development' || process.env.LOG_TO_FILE === 'true') {
      const filePath = path.join(this.logDir, filename);
      fs.appendFileSync(filePath, content + '\n');
    }
  }

  info(message, data = null) {
    const logEntry = this.formatMessage('INFO', message, data);
    console.log(`[INFO] ${message}`);
    this.writeToFile('app.log', logEntry);
  }

  error(message, error = null) {
    const logEntry = this.formatMessage('ERROR', message, error);
    console.error(`[ERROR] ${message}`, error);
    this.writeToFile('error.log', logEntry);
  }

  warn(message, data = null) {
    const logEntry = this.formatMessage('WARN', message, data);
    console.warn(`[WARN] ${message}`);
    this.writeToFile('app.log', logEntry);
  }

  debug(message, data = null) {
    if (process.env.NODE_ENV === 'development') {
      const logEntry = this.formatMessage('DEBUG', message, data);
      console.debug(`[DEBUG] ${message}`);
      this.writeToFile('debug.log', logEntry);
    }
  }

  // Request logging middleware
  requestLogger(req, res, next) {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      const logData = {
        method: req.method,
        url: req.url,
        status: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      };

      if (res.statusCode >= 400) {
        this.error(`HTTP ${res.statusCode} ${req.method} ${req.url}`, logData);
      } else {
        this.info(`HTTP ${res.statusCode} ${req.method} ${req.url}`, logData);
      }
    });

    next();
  }

  // API request logger
  apiLogger(req, res, next) {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      const logData = {
        method: req.method,
        endpoint: req.originalUrl,
        status: res.statusCode,
        duration: `${duration}ms`,
        userId: req.user?.id || 'anonymous',
        ip: req.ip
      };

      this.info(`API ${req.method} ${req.originalUrl}`, logData);
    });

    next();
  }
}

export default new Logger(); 