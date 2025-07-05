import express from 'express';
import cors from 'cors';

// Create express app
const app = express();

// Enable CORS
app.use(cors({
  origin: [
    process.env.CLIENT_URL,         // deployed frontend URL
    "http://localhost:5173",        // local development
    "https://dev-pilot.vercel.app"  // production frontend URL
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON requests
app.use(express.json());

// Set port (using Render's PORT env var)
const PORT = process.env.PORT || 10000;

// Add a basic health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Add a root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'DevPilotAI Backend is running!',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime() + ' seconds'
  });
});

// Mock API endpoints for frontend testing
app.post('/api/devpilot', (req, res) => {
  res.json({
    success: true,
    message: "This is a mock response while the full server is being fixed",
    dockerfile: "# This is a mock Dockerfile\nFROM node:18-alpine\nWORKDIR /app\nCOPY . .\nRUN npm install\nCMD [\"npm\", \"start\"]",
    githubActions: "name: CI/CD Pipeline\n\non:\n  push:\n    branches: [ main ]\n\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n    - uses: actions/checkout@v2",
    envExample: "# Environment Variables\nNODE_ENV=production\nPORT=3000",
    docs: [
      { title: "Mock Documentation", content: "This is placeholder content until the full server is operational" }
    ]
  });
});

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Catch-all route for undefined endpoints
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Endpoint ${req.originalUrl} does not exist`
  });
});

// Start server and bind to 0.0.0.0 (important for Render)
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`
✅ ==========================================
✅ DevPilotAI Minimal Server 
✅ Running on port ${PORT}
✅ Environment: ${process.env.NODE_ENV || 'development'}
✅ Health check: http://localhost:${PORT}/health
✅ ==========================================
  `);
});

// Handle server errors
server.on('error', (error) => {
  console.error('❌ Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
  }
}); 