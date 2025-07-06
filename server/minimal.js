import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import appwriteService from './appwrite.js';
import githubService from './github.js';

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

// Parse cookies
app.use(cookieParser());

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

// Appwrite service already imported at the top

// Save to Appwrite endpoint
app.post('/api/save-to-appwrite', async (req, res) => {
  try {
    const { userId, content, name, type, repoUrl } = req.body;
    
    // Validate required fields
    if (!userId || !content || !name || !type) {
      return res.status(400).json({
        error: 'Missing required fields',
        requiredFields: ['userId', 'content', 'name', 'type']
      });
    }
    
    // Save file to Appwrite
    const result = await appwriteService.saveGeneratedFile(
      userId,
      content,
      name,
      type,
      repoUrl || 'Not specified'
    );
    
    res.status(200).json({
      success: true,
      message: `${name} saved to Appwrite successfully`,
      result
    });
  } catch (error) {
    console.error('Error saving to Appwrite:', error);
    res.status(500).json({
      error: 'Failed to save to Appwrite',
      message: error.message
    });
  }
});

// Get saved files endpoint
app.get('/api/saved-files/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    
    if (!userId) {
      return res.status(400).json({
        error: 'User ID is required'
      });
    }
    
    const files = await appwriteService.getSavedFiles(userId, limit);
    
    res.status(200).json({
      success: true,
      files
    });
  } catch (error) {
    console.error('Error fetching saved files:', error);
    res.status(500).json({
      error: 'Failed to fetch saved files',
      message: error.message
    });
  }
});

// Get file download URL
app.get('/api/file-download/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    
    if (!fileId) {
      return res.status(400).json({
        error: 'File ID is required'
      });
    }
    
    const downloadUrl = await appwriteService.getFileDownloadUrl(fileId);
    
    res.status(200).json({
      success: true,
      downloadUrl
    });
  } catch (error) {
    console.error('Error getting file download URL:', error);
    res.status(500).json({
      error: 'Failed to get file download URL',
      message: error.message
    });
  }
});

// GitHub Integration Endpoints

// Repository cloning and analysis endpoint
app.post('/api/analyze-repo', async (req, res) => {
  try {
    const { repoUrl, userId } = req.body;
    
    if (!repoUrl) {
      return res.status(400).json({
        error: 'Repository URL is required'
      });
    }
    
    // For now, return a mock response since we're using the minimal server
    // In the full server, this would use the multi-agent system from agents/index.js
    
    console.log(`Received request to analyze repository: ${repoUrl} for user: ${userId || 'anonymous'}`);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return mock analysis results
    res.status(200).json({
      success: true,
      message: 'Repository analysis completed',
      repoUrl,
      analysis: {
        techStack: {
          primary: 'Node.js',
          frameworks: ['Express', 'React'],
          database: 'MongoDB',
          languages: ['JavaScript', 'TypeScript']
        },
        dockerfile: "FROM node:18-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --only=production\nCOPY . .\nEXPOSE 3000\nCMD [\"npm\", \"start\"]",
        githubActions: "name: CI/CD Pipeline\n\non:\n  push:\n    branches: [ main ]\n\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n    - uses: actions/checkout@v2\n    - name: Use Node.js\n      uses: actions/setup-node@v2\n      with:\n        node-version: '18'\n    - run: npm ci\n    - run: npm test\n    - run: npm run build",
        envExample: "# Server Configuration\nPORT=3000\nNODE_ENV=production\n\n# Database Configuration\nMONGODB_URI=mongodb://localhost:27017/myapp\n\n# JWT Configuration\nJWT_SECRET=your-jwt-secret\nJWT_EXPIRES_IN=7d",
        recommendations: [
          "Use multi-stage builds for smaller Docker images",
          "Implement health checks in your Docker container",
          "Add caching to GitHub Actions workflow for faster builds",
          "Store sensitive information in GitHub Secrets"
        ]
      }
    });
  } catch (error) {
    console.error('Error analyzing repository:', error);
    res.status(500).json({
      error: 'Failed to analyze repository',
      message: error.message
    });
  }
});

// Initiate GitHub OAuth flow
app.get('/auth/github', (req, res) => {
  try {
    const state = req.query.userId || '';
    const authUrl = githubService.getAuthURL(state);
    res.redirect(authUrl);
  } catch (error) {
    console.error('Error initiating GitHub OAuth:', error);
    res.status(500).json({
      error: 'Failed to initiate GitHub OAuth',
      message: error.message
    });
  }
});

// GitHub OAuth callback
app.get('/auth/github/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    
    if (!code) {
      return res.status(400).json({
        error: 'Missing authorization code'
      });
    }
    
    // Exchange code for access token
    const accessToken = await githubService.getAccessToken(code);
    
    // Get user info
    const userInfo = await githubService.getUserInfo(accessToken);
    
    // Generate JWT token
    const token = githubService.generateJWT({
      githubId: userInfo.id,
      username: userInfo.login,
      accessToken,
      userId: state // The Appwrite user ID passed as state
    });
    
    // Set cookie and redirect to frontend
    res.cookie('github_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    // Redirect to frontend with success
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/repo-selection?connected=true`);
  } catch (error) {
    console.error('Error in GitHub callback:', error);
    // Redirect to frontend with error
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/repo-selection?error=${encodeURIComponent(error.message)}`);
  }
});

// Get user repositories
app.get('/api/github/repositories', async (req, res) => {
  try {
    // Get token from cookie or authorization header
    const token = req.cookies?.github_token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        error: 'GitHub authentication required'
      });
    }
    
    // Verify token
    const decoded = githubService.verifyJWT(token);
    
    // Get repositories
    const repositories = await githubService.getUserRepositories(decoded.accessToken);
    
    res.status(200).json({
      success: true,
      repositories
    });
  } catch (error) {
    console.error('Error fetching repositories:', error);
    res.status(error.message === 'Invalid token' ? 401 : 500).json({
      error: 'Failed to fetch repositories',
      message: error.message
    });
  }
});

// Get organization repositories
app.get('/api/github/organizations/:org/repositories', async (req, res) => {
  try {
    const { org } = req.params;
    // Get token from cookie or authorization header
    const token = req.cookies?.github_token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        error: 'GitHub authentication required'
      });
    }
    
    // Verify token
    const decoded = githubService.verifyJWT(token);
    
    // Get repositories
    const repositories = await githubService.getOrgRepositories(decoded.accessToken, org);
    
    res.status(200).json({
      success: true,
      repositories
    });
  } catch (error) {
    console.error('Error fetching organization repositories:', error);
    res.status(error.message === 'Invalid token' ? 401 : 500).json({
      error: 'Failed to fetch organization repositories',
      message: error.message
    });
  }
});

// Get user organizations
app.get('/api/github/organizations', async (req, res) => {
  try {
    // Get token from cookie or authorization header
    const token = req.cookies?.github_token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        error: 'GitHub authentication required'
      });
    }
    
    // Verify token
    const decoded = githubService.verifyJWT(token);
    
    // Get organizations
    const organizations = await githubService.getUserOrganizations(decoded.accessToken);
    
    res.status(200).json({
      success: true,
      organizations
    });
  } catch (error) {
    console.error('Error fetching organizations:', error);
    res.status(error.message === 'Invalid token' ? 401 : 500).json({
      error: 'Failed to fetch organizations',
      message: error.message
    });
  }
});

// Check GitHub connection status
app.get('/api/github/status', async (req, res) => {
  try {
    // Get token from cookie or authorization header
    const token = req.cookies?.github_token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(200).json({
        connected: false
      });
    }
    
    try {
      // Verify token
      const decoded = githubService.verifyJWT(token);
      
      res.status(200).json({
        connected: true,
        username: decoded.username
      });
    } catch (error) {
      res.status(200).json({
        connected: false,
        error: 'Invalid token'
      });
    }
  } catch (error) {
    console.error('Error checking GitHub status:', error);
    res.status(500).json({
      error: 'Failed to check GitHub status',
      message: error.message
    });
  }
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