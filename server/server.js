import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import simpleGit from 'simple-git';
import fs from 'fs-extra';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { runAgentPipeline } from './agents/index.js';
import GitHubService from './github.js';
import AppwriteService from './appwrite.js';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      process.env.CLIENT_URL,           // deployed frontend URL (e.g., https://yourapp.web.app)
      "http://localhost:5173",          // local development
      "https://dev-pilot.vercel.app"    // production frontend URL
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ['Content-Type', 'Authorization']
  }
});


const PORT = process.env.PORT || 3001;
const TEMP_DIR = path.join(process.cwd(), 'temp');

// Middleware
app.use(cors({
  origin: [
    process.env.CLIENT_URL,           // deployed frontend URL
    "http://localhost:5173",          // local development
    "https://dev-pilot.vercel.app"    // production frontend URL
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware (simple implementation)
app.use((req, res, next) => {
  const cookies = {};
  if (req.headers.cookie) {
    req.headers.cookie.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      cookies[name] = value;
    });
  }
  req.cookies = cookies;
  
  // Add cookie setter to response
  res.cookie = (name, value, options = {}) => {
    let cookieStr = `${name}=${value}`;
    if (options.httpOnly) cookieStr += '; HttpOnly';
    if (options.maxAge) cookieStr += `; Max-Age=${options.maxAge / 1000}`;
    if (options.path) cookieStr += `; Path=${options.path}`;
    res.setHeader('Set-Cookie', cookieStr);
  };
  
  res.clearCookie = (name) => {
    res.setHeader('Set-Cookie', `${name}=; Max-Age=0`);
  };
  
  next();
});

// Store active sessions
const activeSessions = new Map();

// Initialize temp directory
async function initializeTempDir() {
  try {
    await fs.ensureDir(TEMP_DIR);
    console.log(`✅ Temp directory initialized: ${TEMP_DIR}`);
  } catch (error) {
    console.error('❌ Failed to initialize temp directory:', error);
    // Continue anyway, create it later if needed
  }
}

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Helper function to emit progress updates
function emitProgress(sessionId, data) {
  io.emit('progress', { sessionId, ...data });
  console.log(`Progress update for ${sessionId}:`, data);
}

// API Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// GitHub OAuth Routes

// Initiate GitHub OAuth
app.get('/auth/github', (req, res) => {
  try {
    const state = uuidv4(); // CSRF protection
    const authUrl = GitHubService.getAuthURL(state);
    
    // Store state in session or temporary storage (in production, use proper session management)
    res.cookie('oauth_state', state, { httpOnly: true, maxAge: 600000 }); // 10 minutes
    
    res.json({ authUrl });
  } catch (error) {
    console.error('GitHub OAuth initiation error:', error);
    res.status(500).json({ error: 'Failed to initiate GitHub authentication' });
  }
});

// GitHub OAuth callback
app.get('/auth/github/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    const storedState = req.cookies?.oauth_state;
    
    // Verify state to prevent CSRF attacks
    if (!state || state !== storedState) {
      return res.status(400).redirect(`${process.env.CLIENT_URL}/auth?error=invalid_state`);
    }
    
    // Exchange code for access token
    const accessToken = await GitHubService.getAccessToken(code);
    
    // Get user information
    const userInfo = await GitHubService.getUserInfo(accessToken);
    
    // Generate JWT token
    const jwtToken = GitHubService.generateJWT({
      id: userInfo.id,
      login: userInfo.login,
      name: userInfo.name,
      email: userInfo.email,
      avatarUrl: userInfo.avatar_url,
      accessToken: accessToken
    });
    
    // Clear OAuth state cookie
    res.clearCookie('oauth_state');
    
    // Redirect to frontend with JWT token
    res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${jwtToken}`);
    
  } catch (error) {
    console.error('GitHub OAuth callback error:', error);
    res.redirect(`${process.env.CLIENT_URL}/auth?error=github_auth_failed`);
  }
});

// Get user repositories
app.get('/api/github/repositories', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const token = authHeader.substring(7);
    const userData = GitHubService.verifyJWT(token);
    const { page = 1, per_page = 50, type = 'all' } = req.query;
    
    // Get user repositories
    const repositories = await GitHubService.getUserRepositories(
      userData.accessToken, 
      parseInt(page), 
      parseInt(per_page)
    );
    
    // Get organizations
    const organizations = await GitHubService.getUserOrganizations(userData.accessToken);
    
    res.json({
      user: {
        login: userData.login,
        name: userData.name,
        avatarUrl: userData.avatarUrl
      },
      repositories,
      organizations,
      pagination: {
        page: parseInt(page),
        per_page: parseInt(per_page),
        has_more: repositories.length === parseInt(per_page)
      }
    });
    
  } catch (error) {
    console.error('Get repositories error:', error);
    if (error.message === 'Invalid token') {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    res.status(500).json({ error: 'Failed to fetch repositories' });
  }
});

// Get organization repositories
app.get('/api/github/organizations/:org/repositories', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const token = authHeader.substring(7);
    const userData = GitHubService.verifyJWT(token);
    const { org } = req.params;
    const { page = 1, per_page = 50 } = req.query;
    
    const repositories = await GitHubService.getOrgRepositories(
      userData.accessToken, 
      org, 
      parseInt(page), 
      parseInt(per_page)
    );
    
    res.json({
      organization: org,
      repositories,
      pagination: {
        page: parseInt(page),
        per_page: parseInt(per_page),
        has_more: repositories.length === parseInt(per_page)
      }
    });
    
  } catch (error) {
    console.error('Get org repositories error:', error);
    if (error.message === 'Invalid token') {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    res.status(500).json({ error: 'Failed to fetch organization repositories' });
  }
});

// Verify user access to repository
app.post('/api/github/verify-repo', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const token = authHeader.substring(7);
    const userData = GitHubService.verifyJWT(token);
    const { owner, repo } = req.body;
    
    if (!owner || !repo) {
      return res.status(400).json({ error: 'Owner and repository name are required' });
    }
    
    const accessResult = await GitHubService.checkRepoAccess(userData.accessToken, owner, repo);
    
    res.json(accessResult);
    
  } catch (error) {
    console.error('Verify repo access error:', error);
    if (error.message === 'Invalid token') {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    res.status(500).json({ error: 'Failed to verify repository access' });
  }
});

// Clone repository endpoint
app.post('/api/clone-repo', async (req, res) => {
  try {
    const { repoUrl, authToken, repositoryData } = req.body;
    let finalRepoUrl = repoUrl;
    let repoName = '';
    
    // Handle authenticated GitHub repository selection
    if (repositoryData) {
      // User selected from their GitHub repositories
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication required for private repositories' });
      }
      
      const token = authHeader.substring(7);
      const userData = GitHubService.verifyJWT(token);
      
      finalRepoUrl = repositoryData.cloneUrl;
      repoName = repositoryData.name;
      
      // Use authenticated clone URL for private repos
      if (repositoryData.private) {
        finalRepoUrl = repositoryData.cloneUrl.replace('https://', `https://${userData.accessToken}@`);
      }
    } else if (repoUrl) {
      // Manual URL input
      if (!repoUrl) {
        return res.status(400).json({ error: 'Repository URL is required' });
      }
      
      // Validate GitHub URL
      const githubUrlPattern = /^https:\/\/github\.com\/[\w\-\.]+\/[\w\-\.]+(?:\.git)?$/;
      if (!githubUrlPattern.test(repoUrl)) {
        return res.status(400).json({ error: 'Invalid GitHub repository URL' });
      }
      
      repoName = repoUrl.split('/').pop().replace('.git', '');
      
      // Add authentication if provided
      if (authToken) {
        finalRepoUrl = repoUrl.replace('https://', `https://${authToken}@`);
      }
    } else {
      return res.status(400).json({ error: 'Repository URL or repository data is required' });
    }
    
    if (!repoName) {
      repoName = finalRepoUrl.split('/').pop().replace('.git', '');
    }
    
    const sessionId = uuidv4();
    const clonePath = path.join(TEMP_DIR, sessionId, repoName);
    
    // Create session
    activeSessions.set(sessionId, {
      repoUrl: finalRepoUrl,
      repoName,
      clonePath,
      status: 'cloning',
      createdAt: new Date()
    });
    
    emitProgress(sessionId, {
      step: 'Cloning repository...',
      progress: 10,
      status: 'cloning'
    });
    
    // Clone the repository
    const git = simpleGit();
    const cloneOptions = {};
    
    // Clone using the final repository URL (with authentication if needed)
    await git.clone(finalRepoUrl, clonePath, cloneOptions);
    
    // Update session status
    const session = activeSessions.get(sessionId);
    session.status = 'cloned';
    session.clonedAt = new Date();
    
    emitProgress(sessionId, {
      step: 'Repository cloned successfully',
      progress: 25,
      status: 'cloned'
    });
    
    res.json({
      success: true,
      sessionId,
      message: '✅ Repo Cloned Successfully',
      repoName,
      path: clonePath
    });
    
  } catch (error) {
    console.error('Clone error:', error);
    res.status(500).json({
      error: 'Failed to clone repository',
      message: error.message
    });
  }
});

// Analyze repository endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    if (!sessionId || !activeSessions.has(sessionId)) {
      return res.status(400).json({ error: 'Invalid session ID' });
    }
    
    const session = activeSessions.get(sessionId);
    
    if (session.status !== 'cloned') {
      return res.status(400).json({ error: 'Repository not ready for analysis' });
    }
    
    // Update session status
    session.status = 'analyzing';
    session.analysisStartedAt = new Date();
    
    emitProgress(sessionId, {
      step: 'Starting AI agent analysis...',
      progress: 30,
      status: 'analyzing'
    });
    
    // Run the AI agent pipeline
    const progressCallback = (data) => {
      emitProgress(sessionId, {
        step: data.step,
        progress: data.progress,
        messages: data.messages,
        errors: data.errors,
        status: 'analyzing'
      });
    };
    
    const result = await runAgentPipeline(
      session.repoUrl,
      session.clonePath,
      progressCallback
    );
    
    // Store analysis results
    session.analysisResult = result;
    session.status = 'completed';
    session.completedAt = new Date();
    
    emitProgress(sessionId, {
      step: 'Analysis complete!',
      progress: 100,
      status: 'completed',
      techStack: result.techStack,
      generatedFiles: Object.keys(result.generatedFiles)
    });
    
    res.json({
      success: true,
      sessionId,
      techStack: result.techStack,
      codebaseAnalysis: result.codebaseAnalysis,
      generatedFiles: Object.keys(result.generatedFiles),
      messages: result.messages
    });
    
  } catch (error) {
    console.error('Analysis error:', error);
    
    if (activeSessions.has(req.body.sessionId)) {
      const session = activeSessions.get(req.body.sessionId);
      session.status = 'failed';
      session.error = error.message;
      
      emitProgress(req.body.sessionId, {
        step: 'Analysis failed',
        progress: 0,
        status: 'failed',
        error: error.message
      });
    }
    
    res.status(500).json({
      error: 'Analysis failed',
      message: error.message
    });
  }
});

// Get generated files endpoint
app.get('/api/files/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    if (!sessionId || !activeSessions.has(sessionId)) {
      return res.status(400).json({ error: 'Invalid session ID' });
    }
    
    const session = activeSessions.get(sessionId);
    
    if (session.status !== 'completed' || !session.analysisResult) {
      return res.status(400).json({ error: 'Analysis not completed' });
    }
    
    const { generatedFiles, techStack, codebaseAnalysis, verificationResults } = session.analysisResult;
    
    res.json({
      files: generatedFiles,
      techStack,
      codebaseAnalysis,
      verificationResults,
      metadata: {
        repoUrl: session.repoUrl,
        repoName: session.repoName,
        completedAt: session.completedAt
      }
    });
    
  } catch (error) {
    console.error('Files retrieval error:', error);
    res.status(500).json({
      error: 'Failed to retrieve files',
      message: error.message
    });
  }
});

// Download individual file endpoint
app.get('/api/files/:sessionId/:filename', async (req, res) => {
  try {
    const { sessionId, filename } = req.params;
    
    if (!sessionId || !activeSessions.has(sessionId)) {
      return res.status(400).json({ error: 'Invalid session ID' });
    }
    
    const session = activeSessions.get(sessionId);
    
    if (session.status !== 'completed' || !session.analysisResult) {
      return res.status(400).json({ error: 'Analysis not completed' });
    }
    
    const { generatedFiles } = session.analysisResult;
    
    if (!generatedFiles[filename]) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    const fileContent = generatedFiles[filename];
    const contentType = getContentType(filename);
    
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', contentType);
    res.send(fileContent);
    
  } catch (error) {
    console.error('File download error:', error);
    res.status(500).json({
      error: 'Failed to download file',
      message: error.message
    });
  }
});

// Helper function to determine content type
function getContentType(filename) {
  const extension = filename.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'yml':
    case 'yaml':
      return 'application/x-yaml';
    case 'json':
      return 'application/json';
    case 'md':
      return 'text/markdown';
    case 'dockerfile':
      return 'text/plain';
    default:
      return 'text/plain';
  }
}

// Get session status endpoint
app.get('/api/status/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    
    if (!sessionId || !activeSessions.has(sessionId)) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    const session = activeSessions.get(sessionId);
    
    res.json({
      sessionId,
      status: session.status,
      repoUrl: session.repoUrl,
      repoName: session.repoName,
      createdAt: session.createdAt,
      clonedAt: session.clonedAt,
      analysisStartedAt: session.analysisStartedAt,
      completedAt: session.completedAt,
      error: session.error
    });
    
  } catch (error) {
    console.error('Status retrieval error:', error);
    res.status(500).json({
      error: 'Failed to retrieve status',
      message: error.message
    });
  }
});

// Enhanced DevPilot endpoint (integrates with agent system)
app.post('/api/devpilot', async (req, res) => {
  try {
    const { repoUrl, techStack, userId, useAgents = true } = req.body;
    
    if (!repoUrl) {
      return res.status(400).json({ error: 'Repository URL is required' });
    }
    
    if (useAgents) {
      // Use the new agent-based system
      const sessionId = uuidv4();
      const repoName = repoUrl.split('/').pop().replace('.git', '');
      const clonePath = path.join(TEMP_DIR, sessionId, repoName);
      
      // Clone repository
      const git = simpleGit();
      await git.clone(repoUrl, clonePath);
      
      // Run agent analysis
      const result = await runAgentPipeline(repoUrl, clonePath);
      
      // Clean up cloned repo
      await fs.remove(path.join(TEMP_DIR, sessionId));
      
      res.json({
        dockerfile: result.generatedFiles.dockerfile,
        githubActions: result.generatedFiles.githubActions,
        envExample: result.generatedFiles.envExample,
        techStack: result.techStack,
        codebaseAnalysis: result.codebaseAnalysis,
        agentMessages: result.messages,
        verificationResults: result.verificationResults
      });
    } else {
      // Fallback to original system
      const { devPilotAI } = await import('./index.js');
      return devPilotAI(req, res);
    }
    
  } catch (error) {
    console.error('DevPilot error:', error);
    res.status(500).json({
      error: 'Failed to generate CI/CD setup',
      message: error.message
    });
  }
});

// List active sessions endpoint
app.get('/api/sessions', (req, res) => {
  try {
    const sessions = Array.from(activeSessions.entries()).map(([id, session]) => ({
      sessionId: id,
      status: session.status,
      repoUrl: session.repoUrl,
      repoName: session.repoName,
      createdAt: session.createdAt,
      completedAt: session.completedAt
    }));
    
    res.json({ sessions });
  } catch (error) {
    console.error('Sessions retrieval error:', error);
    res.status(500).json({
      error: 'Failed to retrieve sessions',
      message: error.message
    });
  }
});

// Cleanup old sessions (runs every hour)
setInterval(async () => {
  const now = new Date();
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours
  
  for (const [sessionId, session] of activeSessions.entries()) {
    if (now - session.createdAt > maxAge) {
      try {
        // Remove cloned files
        const sessionDir = path.join(TEMP_DIR, sessionId);
        if (await fs.pathExists(sessionDir)) {
          await fs.remove(sessionDir);
        }
        
        // Remove from active sessions
        activeSessions.delete(sessionId);
        console.log(`Cleaned up session: ${sessionId}`);
      } catch (error) {
        console.error(`Failed to cleanup session ${sessionId}:`, error);
      }
    }
  }
}, 60 * 60 * 1000); // Run every hour

// Auth Routes
app.post('/auth/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Create user in Appwrite
    const user = await AppwriteService.createUser(email, password);
    
    res.json({ success: true, user });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(400).json({ error: error.message || 'Failed to create user' });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Login user in Appwrite
    const session = await AppwriteService.createSession(email, password);
    
    res.json({ success: true, session });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ error: error.message || 'Invalid credentials' });
  }
});

app.post('/auth/logout', async (req, res) => {
  try {
    // Delete current session in Appwrite
    await AppwriteService.deleteCurrentSession();
    
    res.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: error.message || 'Failed to logout' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Add global error handlers
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start server
async function startServer() {
  try {
    console.log('🚀 Starting DevPilotAI Server...');
    console.log(`📍 Node.js version: ${process.version}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📍 PORT: ${PORT}`);
    
    // Check critical environment variables (non-blocking)
    const envChecks = {
      'CLIENT_URL': process.env.CLIENT_URL || 'Not set (using defaults)',
      'NODE_ENV': process.env.NODE_ENV || 'development',
      'PORT': PORT
    };
    
    console.log('🔧 Environment variables:');
    Object.entries(envChecks).forEach(([key, value]) => {
      console.log(`   ${key}: ${value}`);
    });
    
    // Initialize temp directory
    await initializeTempDir();
    
    // Start the server
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 DevOps AI Agent Server running on port ${PORT}`);
      console.log(`📁 Temp directory: ${TEMP_DIR}`);
      console.log(`🔗 Client URL: ${process.env.CLIENT_URL || "http://localhost:5173"}`);
      console.log('🤖 Multi-agent system: LangGraph + OpenAI');
      console.log('✅ Server startup complete!');
    });
    
    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
      } else {
        console.error('❌ Server error:', error);
      }
      process.exit(1);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

export default app; 