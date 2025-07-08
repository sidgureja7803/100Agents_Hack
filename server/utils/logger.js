/**
 * Enhanced Logging System
 * Provides structured logging with different levels and formatting
 */

import fs from 'fs-extra';
import path from 'path';

class Logger {
  constructor() {
    this.logDir = path.join(process.cwd(), 'logs');
    this.ensureLogDirectory();
  }

  async ensureLogDirectory() {
    try {
      await fs.ensureDir(this.logDir);
    } catch (error) {
      console.error('Failed to create log directory:', error);
    }
  }

  formatMessage(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      ...(data && { data }),
      pid: process.pid,
      memory: process.memoryUsage()
    };

    return JSON.stringify(logEntry);
  }

  async writeToFile(filename, content) {
    try {
      const logFile = path.join(this.logDir, filename);
      await fs.appendFile(logFile, content + '\n');
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  info(message, data = null) {
    const formattedMessage = this.formatMessage('info', message, data);
    console.log(`🔷 INFO: ${message}`, data || '');
    this.writeToFile('app.log', formattedMessage);
  }

  warn(message, data = null) {
    const formattedMessage = this.formatMessage('warn', message, data);
    console.warn(`⚠️ WARN: ${message}`, data || '');
    this.writeToFile('app.log', formattedMessage);
  }

  error(message, error = null, data = null) {
    const errorData = error ? {
      message: error.message,
      stack: error.stack,
      name: error.name,
      ...data
    } : data;
    
    const formattedMessage = this.formatMessage('error', message, errorData);
    console.error(`❌ ERROR: ${message}`, error || '', data || '');
    this.writeToFile('error.log', formattedMessage);
  }

  debug(message, data = null) {
    if (process.env.NODE_ENV === 'development') {
      const formattedMessage = this.formatMessage('debug', message, data);
      console.debug(`🔍 DEBUG: ${message}`, data || '');
      this.writeToFile('debug.log', formattedMessage);
    }
  }

  agent(agentName, message, data = null) {
    const formattedMessage = this.formatMessage('agent', `[${agentName}] ${message}`, data);
    console.log(`🤖 AGENT [${agentName}]: ${message}`, data || '');
    this.writeToFile('agents.log', formattedMessage);
  }

  performance(operation, duration, data = null) {
    const perfData = {
      operation,
      duration: `${duration}ms`,
      ...data
    };
    
    const formattedMessage = this.formatMessage('performance', `${operation} completed`, perfData);
    console.log(`⚡ PERF: ${operation} completed in ${duration}ms`, data || '');
    this.writeToFile('performance.log', formattedMessage);
  }

  websocket(event, data = null) {
    const formattedMessage = this.formatMessage('websocket', event, data);
    console.log(`🔗 WS: ${event}`, data || '');
    this.writeToFile('websocket.log', formattedMessage);
  }

  // Clean up old log files (keep last 30 days)
  async cleanupLogs() {
    try {
      const files = await fs.readdir(this.logDir);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      for (const file of files) {
        const filePath = path.join(this.logDir, file);
        const stats = await fs.stat(filePath);
        
        if (stats.mtime < thirtyDaysAgo) {
          await fs.unlink(filePath);
          this.info(`Cleaned up old log file: ${file}`);
        }
      }
    } catch (error) {
      this.error('Failed to cleanup old logs', error);
    }
  }
}

export const logger = new Logger();

// Clean up logs on startup
if (process.env.NODE_ENV === 'production') {
  logger.cleanupLogs();
}
