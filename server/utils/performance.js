/**
 * Performance Monitoring System
 * Tracks API performance, memory usage, and system metrics
 */

import { logger } from './logger.js';

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      requests: 0,
      totalResponseTime: 0,
      errors: 0,
      sessions: new Map(),
      systemStats: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage()
      }
    };
    
    this.startSystemMonitoring();
  }

  // Track API request performance
  trackRequest(req, res, next) {
    const start = process.hrtime.bigint();
    const startTime = Date.now();
    
    res.on('finish', () => {
      const end = process.hrtime.bigint();
      const duration = Number(end - start) / 1000000; // Convert to milliseconds
      
      this.metrics.requests++;
      this.metrics.totalResponseTime += duration;
      
      if (res.statusCode >= 400) {
        this.metrics.errors++;
      }
      
      // Log slow requests
      if (duration > 1000) {
        logger.warn(`Slow request detected: ${req.method} ${req.originalUrl}`, {
          duration: `${duration}ms`,
          status: res.statusCode,
          ip: req.ip
        });
      }
      
      logger.performance(`${req.method} ${req.originalUrl}`, duration, {
        status: res.statusCode,
        userAgent: req.get('User-Agent'),
        ip: req.ip
      });
    });
    
    next();
  }

  // Track agent session performance
  trackAgentSession(sessionId, phase, duration, data = {}) {
    if (!this.metrics.sessions.has(sessionId)) {
      this.metrics.sessions.set(sessionId, {
        id: sessionId,
        startTime: Date.now(),
        phases: {},
        totalDuration: 0
      });
    }
    
    const session = this.metrics.sessions.get(sessionId);
    session.phases[phase] = {
      duration,
      completedAt: Date.now(),
      ...data
    };
    
    session.totalDuration += duration;
    
    logger.agent('performance', `Session ${sessionId} - ${phase} completed`, {
      duration: `${duration}ms`,
      sessionTotal: `${session.totalDuration}ms`,
      ...data
    });
  }

  // Get performance metrics
  getMetrics() {
    const now = Date.now();
    const avgResponseTime = this.metrics.requests > 0 
      ? this.metrics.totalResponseTime / this.metrics.requests 
      : 0;
    
    return {
      uptime: process.uptime(),
      requests: {
        total: this.metrics.requests,
        errors: this.metrics.errors,
        successRate: this.metrics.requests > 0 
          ? ((this.metrics.requests - this.metrics.errors) / this.metrics.requests) * 100 
          : 100,
        avgResponseTime: Math.round(avgResponseTime * 100) / 100
      },
      memory: {
        ...process.memoryUsage(),
        formatted: {
          rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`,
          heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`
        }
      },
      cpu: process.cpuUsage(),
      activeSessions: this.metrics.sessions.size,
      timestamp: now
    };
  }

  // Get session analytics
  getSessionAnalytics() {
    const sessions = Array.from(this.metrics.sessions.values());
    
    if (sessions.length === 0) {
      return {
        total: 0,
        avgDuration: 0,
        phases: {}
      };
    }
    
    const totalDuration = sessions.reduce((sum, session) => sum + session.totalDuration, 0);
    const avgDuration = totalDuration / sessions.length;
    
    // Calculate phase statistics
    const phaseStats = {};
    sessions.forEach(session => {
      Object.entries(session.phases).forEach(([phase, data]) => {
        if (!phaseStats[phase]) {
          phaseStats[phase] = {
            count: 0,
            totalDuration: 0,
            avgDuration: 0
          };
        }
        phaseStats[phase].count++;
        phaseStats[phase].totalDuration += data.duration;
      });
    });
    
    // Calculate averages
    Object.keys(phaseStats).forEach(phase => {
      phaseStats[phase].avgDuration = phaseStats[phase].totalDuration / phaseStats[phase].count;
    });
    
    return {
      total: sessions.length,
      avgDuration: Math.round(avgDuration),
      phases: phaseStats,
      recentSessions: sessions.slice(-10).map(session => ({
        id: session.id,
        duration: session.totalDuration,
        phases: Object.keys(session.phases).length
      }))
    };
  }

  // Clean up old sessions
  cleanupSessions() {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    
    for (const [sessionId, session] of this.metrics.sessions.entries()) {
      if (session.startTime < oneHourAgo) {
        this.metrics.sessions.delete(sessionId);
      }
    }
  }

  // System monitoring
  startSystemMonitoring() {
    setInterval(() => {
      this.metrics.systemStats = {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage()
      };
      
      // Log system stats every 5 minutes
      if (process.uptime() % 300 < 1) {
        logger.info('System stats update', this.metrics.systemStats);
      }
      
      // Clean up old sessions every 30 minutes
      if (process.uptime() % 1800 < 1) {
        this.cleanupSessions();
      }
    }, 1000);
  }

  // Memory usage warning
  checkMemoryUsage() {
    const memoryUsage = process.memoryUsage();
    const heapUsedMB = memoryUsage.heapUsed / 1024 / 1024;
    const heapTotalMB = memoryUsage.heapTotal / 1024 / 1024;
    
    // Warning at 80% heap usage
    if (heapUsedMB / heapTotalMB > 0.8) {
      logger.warn('High memory usage detected', {
        heapUsed: `${Math.round(heapUsedMB)}MB`,
        heapTotal: `${Math.round(heapTotalMB)}MB`,
        usage: `${Math.round((heapUsedMB / heapTotalMB) * 100)}%`
      });
    }
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Health check endpoint data
export const getHealthStatus = () => {
  const metrics = performanceMonitor.getMetrics();
  const sessionAnalytics = performanceMonitor.getSessionAnalytics();
  
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(metrics.uptime / 3600)}h ${Math.floor((metrics.uptime % 3600) / 60)}m`,
    version: process.version,
    environment: process.env.NODE_ENV || 'development',
    metrics: {
      requests: metrics.requests,
      memory: metrics.memory.formatted,
      activeSessions: metrics.activeSessions
    },
    sessionAnalytics: {
      total: sessionAnalytics.total,
      avgDuration: `${sessionAnalytics.avgDuration}ms`,
      phases: Object.keys(sessionAnalytics.phases).length
    }
  };
};
