import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

// Mem0 API configuration
const MEM0_CONFIG = {
  apiKey: process.env.MEM0_API_KEY,
  baseUrl: 'https://api.mem0.ai/v1'
};

// Keywords AI observability configuration
const KEYWORDS_AI_CONFIG = {
  apiKey: process.env.KEYWORDS_AI_API_KEY,
  baseUrl: process.env.KEYWORDS_AI_BASE_URL || 'https://api.keywordsai.co'
};

/**
 * Track events with Keywords AI for observability using direct API calls
 */
async function trackEvent(eventType, data, metadata = {}) {
  if (!KEYWORDS_AI_CONFIG.apiKey) {
    console.log(`Keywords AI API key not available, skipping tracking for event: ${eventType}`);
    return;
  }

  try {
    const payload = {
      event_type: eventType,
      timestamp: new Date().toISOString(),
      data,
      metadata: {
        service: 'DevPilotAI',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        ...metadata
      }
    };

    const response = await fetch(`${KEYWORDS_AI_CONFIG.baseUrl}/api/events/track`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${KEYWORDS_AI_CONFIG.apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'DevPilotAI/1.0.0'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      console.log(`✅ Tracked event: ${eventType}`);
    } else {
      console.warn(`⚠️ Keywords AI tracking failed for ${eventType}: ${response.status}`);
    }
  } catch (error) {
    console.error(`❌ Failed to track event ${eventType}:`, error.message);
  }
}

/**
 * DevPilotAI Backend Function
 * Generates DevOps configuration files and deployment instructions
 */
export async function devPilotAI(req, res) {
  try {
    const { repoUrl, techStack, userId } = req.body;

    // Validate input
    if (!repoUrl || !techStack || !userId) {
      return res.status(400).json({
        error: 'Missing required parameters: repoUrl, techStack, and userId are required'
      });
    }

    console.log(`Processing request for user: ${userId}, repo: ${repoUrl}, tech stack: ${techStack}`);

    // Track request initiation
    await trackEvent('devpilot_request_started', {
      repoUrl,
      techStack,
      userId
    }, {
      userId,
      techStack,
      repoUrl
    });

    // Generate configuration files
    const dockerfile = await generateDockerfileWithTracking(techStack, { userId, repoUrl });
    const githubActions = await generateGitHubActionsWithTracking(techStack, { userId, repoUrl });
    const envExample = generateEnvExample(techStack);

    // Fetch deployment instructions using Tavily API
    const docs = await fetchDeploymentInstructions(techStack, { userId, repoUrl });

    // Store interaction in Mem0
    await storeInteraction(userId, {
      repoUrl,
      techStack,
      timestamp: new Date().toISOString(),
      generatedFiles: ['Dockerfile', 'GitHub Actions workflow', '.env.example']
    });

    // Return response
    const response = {
      dockerfile,
      githubActions,
      envExample,
      docs
    };

    console.log(`Successfully generated DevOps configuration for ${techStack}`);
    
    // Track successful completion
    await trackEvent('devpilot_request_completed', {
      repoUrl,
      techStack,
      userId,
      response_size: JSON.stringify(response).length,
      generated_files: ['dockerfile', 'githubActions', 'envExample'],
      docs_count: response.docs?.length || 0
    }, {
      userId,
      techStack,
      repoUrl
    });
    
    if (res) {
      return res.status(200).json(response);
    }
    
    return response;

  } catch (error) {
    console.error('Error in devPilotAI function:', error);
    
    // Track error
    await trackEvent('devpilot_request_failed', {
      repoUrl: req.body?.repoUrl,
      techStack: req.body?.techStack,
      userId: req.body?.userId,
      error: error.message,
      stack: error.stack
    }, {
      userId: req.body?.userId,
      techStack: req.body?.techStack,
      repoUrl: req.body?.repoUrl
    });
    
    const errorResponse = {
      error: 'Internal server error',
      message: error.message
    };
    
    if (res) {
      return res.status(500).json(errorResponse);
    }
    
    throw error;
  }
}

/**
 * Generate production-grade Dockerfile with Keywords AI tracking
 */
async function generateDockerfileWithTracking(techStack, metadata = {}) {
  const startTime = Date.now();
  
  try {
    // Track Dockerfile generation start
    await trackEvent('dockerfile_generation_started', {
      techStack,
      timestamp: new Date().toISOString()
    }, metadata);

    const dockerfile = generateDockerfile(techStack);
    
    // Track successful Dockerfile generation
    await trackEvent('dockerfile_generation_completed', {
      techStack,
      dockerfile_length: dockerfile.length,
      lines_count: dockerfile.split('\n').length,
      generation_time_ms: Date.now() - startTime,
      dockerfile_preview: dockerfile.substring(0, 200) + '...'
    }, metadata);

    return dockerfile;
  } catch (error) {
    // Track generation failure
    await trackEvent('dockerfile_generation_failed', {
      techStack,
      error: error.message,
      generation_time_ms: Date.now() - startTime
    }, metadata);
    throw error;
  }
}

/**
 * Generate production-grade Dockerfile based on tech stack
 */
function generateDockerfile(techStack) {
  const stack = techStack.toLowerCase();
  
  if (stack.includes('react') && stack.includes('node')) {
    return `# Multi-stage build for React + Node.js application
FROM node:18-alpine AS frontend-builder

# Set working directory for frontend
WORKDIR /app/frontend

# Copy frontend package files
COPY package*.json ./
RUN npm ci --only=production

# Copy frontend source code
COPY . .

# Build frontend
RUN npm run build

# Backend stage
FROM node:18-alpine AS backend

# Set working directory
WORKDIR /app

# Copy backend package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \\
    adduser -S nodejs -u 1001

# Copy backend source code
COPY . .

# Copy built frontend from previous stage
COPY --from=frontend-builder /app/frontend/build ./public

# Change ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD node healthcheck.js || exit 1

# Start application
CMD ["npm", "start"]`;
  }
  
  if (stack.includes('node')) {
    return `# Production-grade Node.js Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \\
    adduser -S nodejs -u 1001

# Copy source code
COPY . .

# Change ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD node healthcheck.js || exit 1

# Start application
CMD ["npm", "start"]`;
  }
  
  if (stack.includes('python')) {
    return `# Production-grade Python Dockerfile
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \\
    gcc \\
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Create non-root user
RUN adduser --disabled-password --gecos '' appuser
USER appuser

# Copy source code
COPY . .

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD python healthcheck.py || exit 1

# Start application
CMD ["python", "app.py"]`;
  }
  
  // Default generic Dockerfile
  return `# Generic application Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

RUN addgroup -g 1001 -S appgroup && \\
    adduser -S appuser -u 1001

COPY . .
RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["npm", "start"]`;
}

/**
 * Generate GitHub Actions CI/CD workflow with Keywords AI tracking
 */
async function generateGitHubActionsWithTracking(techStack, metadata = {}) {
  const startTime = Date.now();
  
  try {
    // Track GitHub Actions generation start
    await trackEvent('github_actions_generation_started', {
      techStack,
      timestamp: new Date().toISOString()
    }, metadata);

    const githubActions = generateGitHubActions(techStack);
    
    // Track successful GitHub Actions generation
    await trackEvent('github_actions_generation_completed', {
      techStack,
      yaml_length: githubActions.length,
      lines_count: githubActions.split('\n').length,
      generation_time_ms: Date.now() - startTime,
      workflow_preview: githubActions.substring(0, 200) + '...'
    }, metadata);

    return githubActions;
  } catch (error) {
    // Track generation failure
    await trackEvent('github_actions_generation_failed', {
      techStack,
      error: error.message,
      generation_time_ms: Date.now() - startTime
    }, metadata);
    throw error;
  }
}

/**
 * Generate GitHub Actions CI/CD workflow
 */
function generateGitHubActions(techStack) {
  const stack = techStack.toLowerCase();
  
  if (stack.includes('react') && stack.includes('node')) {
    return `name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  NODE_VERSION: '18'
  REGISTRY: ghcr.io
  IMAGE_NAME: \${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: \${{ env.NODE_VERSION }}
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run linter
      run: npm run lint

    - name: Run tests
      run: npm test

    - name: Build frontend
      run: npm run build

  build-and-push:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    
    permissions:
      contents: read
      packages: write

    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Docker Buildx
      uses: docker/setup-buildx-action@v3

    - name: Login to Container Registry
      uses: docker/login-action@v3
      with:
        registry: \${{ env.REGISTRY }}
        username: \${{ github.actor }}
        password: \${{ secrets.GITHUB_TOKEN }}

    - name: Extract metadata
      id: meta
      uses: docker/metadata-action@v5
      with:
        images: \${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}
        tags: |
          type=ref,event=branch
          type=ref,event=pr
          type=sha

    - name: Build and push Docker image
      uses: docker/build-push-action@v5
      with:
        context: .
        platforms: linux/amd64,linux/arm64
        push: true
        tags: \${{ steps.meta.outputs.tags }}
        labels: \${{ steps.meta.outputs.labels }}
        cache-from: type=gha
        cache-to: type=gha,mode=max

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Deploy to production
      run: |
        echo "Deploy to your preferred platform (AWS, GCP, Azure, etc.)"
        # Add your deployment commands here`;
  }
  
  // Default workflow for Node.js
  return `name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  NODE_VERSION: '18'
  REGISTRY: ghcr.io
  IMAGE_NAME: \${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: \${{ env.NODE_VERSION }}
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run tests
      run: npm test

  build-and-push:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    
    permissions:
      contents: read
      packages: write

    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Docker Buildx
      uses: docker/setup-buildx-action@v3

    - name: Login to Container Registry
      uses: docker/login-action@v3
      with:
        registry: \${{ env.REGISTRY }}
        username: \${{ github.actor }}
        password: \${{ secrets.GITHUB_TOKEN }}

    - name: Extract metadata
      id: meta
      uses: docker/metadata-action@v5
      with:
        images: \${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}

    - name: Build and push Docker image
      uses: docker/build-push-action@v5
      with:
        context: .
        push: true
        tags: \${{ steps.meta.outputs.tags }}
        labels: \${{ steps.meta.outputs.labels }}`;
}

/**
 * Generate .env.example file based on tech stack
 */
function generateEnvExample(techStack) {
  const stack = techStack.toLowerCase();
  
  let envVars = [
    '# Application Configuration',
    'NODE_ENV=production',
    'PORT=3000',
    'HOST=0.0.0.0',
    '',
    '# API Keys',
    'API_KEY=your_api_key_here',
    'JWT_SECRET=your_jwt_secret_here',
    '',
    '# Database Configuration',
    'DATABASE_URL=your_database_url_here',
    'DB_HOST=localhost',
    'DB_PORT=5432',
    'DB_NAME=your_database_name',
    'DB_USER=your_database_user',
    'DB_PASSWORD=your_database_password',
    '',
    '# Redis Configuration (if using caching)',
    'REDIS_URL=redis://localhost:6379',
    '',
    '# External Services',
    'TAVILY_API_KEY=your_tavily_api_key',
    'MEM0_API_KEY=your_mem0_api_key'
  ];

  if (stack.includes('react')) {
    envVars.push(
      '',
      '# Frontend Configuration',
      'REACT_APP_API_URL=http://localhost:3000/api',
      'REACT_APP_ENV=production'
    );
  }

  if (stack.includes('mongo')) {
    envVars.push(
      '',
      '# MongoDB Configuration',
      'MONGODB_URI=mongodb://localhost:27017/your_database'
    );
  }

  if (stack.includes('aws') || stack.includes('s3')) {
    envVars.push(
      '',
      '# AWS Configuration',
      'AWS_ACCESS_KEY_ID=your_aws_access_key',
      'AWS_SECRET_ACCESS_KEY=your_aws_secret_key',
      'AWS_REGION=us-east-1',
      'S3_BUCKET_NAME=your_s3_bucket'
    );
  }

  return envVars.join('\n');
}

/**
 * Fetch deployment instructions using Tavily API
 */
async function fetchDeploymentInstructions(techStack, metadata = {}) {
  const startTime = Date.now();
  const query = `How to deploy a ${techStack} application to cloud platforms`;
  
  try {
    // Track Tavily query start
    await trackEvent('tavily_query_started', {
      query,
      techStack,
      timestamp: new Date().toISOString()
    }, metadata);

    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TAVILY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        search_depth: 'basic',
        include_answer: true,
        include_raw_content: false,
        max_results: 5
      })
    });

    if (!response.ok) {
      console.warn('Tavily API request failed:', response.status);
      
      // Track Tavily API failure
      await trackEvent('tavily_query_failed', {
        query,
        techStack,
        status_code: response.status,
        response_time_ms: Date.now() - startTime,
        fallback_used: true
      }, metadata);
      
      return getFallbackDocs(techStack);
    }

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const processedResults = data.results.map(result => ({
        title: result.title,
        url: result.url,
        content: result.content?.substring(0, 200) + '...' || ''
      }));

      // Track successful Tavily response
      await trackEvent('tavily_query_completed', {
        query,
        techStack,
        results_count: processedResults.length,
        response_time_ms: Date.now() - startTime,
        results_preview: processedResults.map(r => r.title).join(', ')
      }, metadata);

      return processedResults;
    }
    
    // Track empty results
    await trackEvent('tavily_query_empty_results', {
      query,
      techStack,
      response_time_ms: Date.now() - startTime,
      fallback_used: true
    }, metadata);
    
    return getFallbackDocs(techStack);
    
  } catch (error) {
    console.error('Error fetching deployment instructions:', error);
    
    // Track Tavily error
    await trackEvent('tavily_query_error', {
      query,
      techStack,
      error: error.message,
      response_time_ms: Date.now() - startTime,
      fallback_used: true
    }, metadata);
    
    return getFallbackDocs(techStack);
  }
}

/**
 * Fallback documentation when Tavily API is unavailable
 */
function getFallbackDocs(techStack) {
  const stack = techStack.toLowerCase();
  
  const docs = [
    {
      title: "Docker Deployment Guide",
      url: "https://docs.docker.com/get-started/",
      content: "Comprehensive guide to deploying applications with Docker"
    },
    {
      title: "GitHub Actions Documentation",
      url: "https://docs.github.com/en/actions",
      content: "Complete documentation for GitHub Actions CI/CD"
    }
  ];

  if (stack.includes('node')) {
    docs.push({
      title: "Deploy Node.js Apps",
      url: "https://render.com/docs/deploy-node-express-app",
      content: "Guide to deploying Node.js applications on various platforms"
    });
  }

  if (stack.includes('react')) {
    docs.push({
      title: "Deploy React Apps",
      url: "https://create-react-app.dev/docs/deployment/",
      content: "Official React deployment documentation"
    });
  }

  return docs;
}

/**
 * Store interaction using Mem0 HTTP API
 */
async function storeInteraction(userId, interactionData) {
  try {
    if (!MEM0_CONFIG.apiKey) {
      console.log('Mem0 API key not available, skipping memory storage');
      return;
    }

    const content = `DevPilotAI generated DevOps configuration for ${interactionData.techStack} project. Repository: ${interactionData.repoUrl}. Generated files: ${interactionData.generatedFiles.join(', ')}. Timestamp: ${interactionData.timestamp}`;
    
    const response = await fetch(`${MEM0_CONFIG.baseUrl}/memories/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MEM0_CONFIG.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [{ role: "user", content }],
        user_id: userId
      })
    });

    if (response.ok) {
      console.log('Interaction stored successfully in Mem0');
    } else {
      console.warn(`Mem0 storage failed: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error storing interaction in Mem0:', error);
    // Don't throw error to avoid breaking the main function
  }
}

// For Appwrite Cloud Functions compatibility
export default async function(req, res) {
  return await devPilotAI(req, res);
} 