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

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;
const TEMP_DIR = path.join(process.cwd(), 'temp');

// Middleware
app.use(cors());
app.use(express.json());

// Ensure temp directory exists
await fs.ensureDir(TEMP_DIR);

// Store active sessions
const activeSessions = new Map();

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

// Clone repository endpoint
app.post('/api/clone-repo', async (req, res) => {
  try {
    const { repoUrl, authToken } = req.body;
    
    if (!repoUrl) {
      return res.status(400).json({ error: 'Repository URL is required' });
    }
    
    // Validate GitHub URL
    const githubUrlPattern = /^https:\/\/github\.com\/[\w\-\.]+\/[\w\-\.]+(?:\.git)?$/;
    if (!githubUrlPattern.test(repoUrl)) {
      return res.status(400).json({ error: 'Invalid GitHub repository URL' });
    }
    
    const sessionId = uuidv4();
    const repoName = repoUrl.split('/').pop().replace('.git', '');
    const clonePath = path.join(TEMP_DIR, sessionId, repoName);
    
    // Create session
    activeSessions.set(sessionId, {
      repoUrl,
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
    
    // Add authentication if provided
    if (authToken) {
      const authenticatedUrl = repoUrl.replace('https://', `https://${authToken}@`);
      await git.clone(authenticatedUrl, clonePath, cloneOptions);
    } else {
      await git.clone(repoUrl, clonePath, cloneOptions);
    }
    
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 DevOps AI Agent Server running on port ${PORT}`);
  console.log(`📁 Temp directory: ${TEMP_DIR}`);
  console.log(`🔗 Client URL: ${process.env.CLIENT_URL || "http://localhost:5173"}`);
  console.log('🤖 Multi-agent system: LangGraph + OpenAI');
});

export default app; 