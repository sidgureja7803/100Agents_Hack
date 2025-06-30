#!/usr/bin/env node

// Simple startup script for debugging
import dotenv from 'dotenv';

dotenv.config();

console.log('🚀 DevPilotAI Startup Script');
console.log('============================');
console.log(`Node.js version: ${process.version}`);
console.log(`Platform: ${process.platform}`);
console.log(`Architecture: ${process.arch}`);
console.log(`Working directory: ${process.cwd()}`);
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`PORT: ${process.env.PORT || 'not set'}`);
console.log('============================');

// Test if we can import the main modules
try {
  console.log('📦 Testing imports...');
  
  // Test basic imports
  await import('express');
  console.log('✅ Express imported successfully');
  
  await import('cors');
  console.log('✅ CORS imported successfully');
  
  await import('fs-extra');
  console.log('✅ fs-extra imported successfully');
  
  await import('socket.io');
  console.log('✅ Socket.io imported successfully');
  
  // Test our custom modules
  await import('./github.js');
  console.log('✅ GitHub service imported successfully');
  
  await import('./appwrite.js');
  console.log('✅ Appwrite service imported successfully');
  
  await import('./agents/index.js');
  console.log('✅ Agents module imported successfully');
  
  console.log('🎉 All imports successful!');
  console.log('🚀 Starting main server...');
  
  // Import and start the main server
  await import('./server.js');
  
} catch (error) {
  console.error('❌ Import/Startup error:', error);
  console.error('Stack trace:', error.stack);
  process.exit(1);
} 