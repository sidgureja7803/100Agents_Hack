/**
 * Enhanced Security Middleware
 * Provides rate limiting, security headers, and request validation
 */

import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { logger } from './logger.js';

// Rate limiting configurations
export const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn(`Rate limit exceeded for IP: ${req.ip}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        endpoint: req.originalUrl
      });
      res.status(429).json({ error: message });
    }
  });
};

// Different rate limits for different endpoints
export const rateLimiters = {
  // General API rate limit
  general: createRateLimiter(15 * 60 * 1000, 100, 'Too many requests, please try again later'),
  
  // More restrictive for resource-intensive operations
  analysis: createRateLimiter(5 * 60 * 1000, 5, 'Too many analysis requests, please wait before trying again'),
  
  // Clone operations
  clone: createRateLimiter(10 * 60 * 1000, 10, 'Too many clone requests, please wait before trying again'),
  
  // Authentication endpoints
  auth: createRateLimiter(15 * 60 * 1000, 10, 'Too many authentication attempts, please try again later')
};

// Security headers configuration
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.github.com", "https://cloud.appwrite.io"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
});

// Request validation middleware
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      logger.warn('Request validation failed', {
        error: error.details,
        body: req.body,
        ip: req.ip
      });
      
      return res.status(400).json({
        error: 'Invalid request data',
        details: error.details.map(detail => detail.message)
      });
    }
    
    next();
  };
};

// Session validation middleware
export const validateSession = async (req, res, next) => {
  try {
    const sessionId = req.params.sessionId || req.body.sessionId;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }
    
    // Add session validation logic here
    next();
  } catch (error) {
    logger.error('Session validation failed', error);
    res.status(401).json({ error: 'Invalid session' });
  }
};

// IP whitelist for admin endpoints
export const ipWhitelist = (allowedIPs) => {
  return (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    
    if (allowedIPs.includes(clientIP)) {
      next();
    } else {
      logger.warn(`Access denied for IP: ${clientIP}`, {
        ip: clientIP,
        endpoint: req.originalUrl
      });
      res.status(403).json({ error: 'Access denied' });
    }
  };
};

// Request logging middleware
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl}`, {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
  });
  
  next();
};
