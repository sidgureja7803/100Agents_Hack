# 🚀 DevPilotAI Deployment Guide

Complete deployment guide for the multi-agent AI DevOps automation platform.

## 📋 **Prerequisites**

### Required Services & API Keys

1. **OpenAI API Key** (Required)
   - Sign up at [OpenAI Platform](https://platform.openai.com)
   - Create API key with GPT-4 access
   - Cost: ~$0.02-0.06 per analysis

2. **Appwrite Instance** (Backend Services)
   - Option A: [Appwrite Cloud](https://cloud.appwrite.io) (Recommended)
   - Option B: Self-hosted Appwrite
   - Features: Authentication, Database, Real-time APIs

3. **Keywords AI** (Optional - Observability)
   - Sign up at [Keywords AI](https://keywordsai.co)
   - Used for monitoring and analytics

4. **Mem0** (Optional - Memory & Context)
   - Sign up at [Mem0](https://mem0.ai)
   - Provides persistent memory for AI agents

5. **Tavily** (Optional - Enhanced Search)
   - Sign up at [Tavily](https://tavily.com)
   - AI-powered search capabilities

### System Requirements

- **Node.js 18+**
- **Git**
- **2GB+ RAM** (for agent processing)
- **1GB+ Storage** (for temporary repos)

---

## 🏗️ **Local Development Setup**

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/your-org/devpilot-ai.git
cd devpilot-ai

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Configuration

Create environment files:

#### **Server Environment** (`server/.env`)
```bash
# Required - AI Core
OPENAI_API_KEY=sk-your-openai-api-key
NODE_ENV=development
PORT=3001

# Required - Frontend URL
CLIENT_URL=http://localhost:5173

# Optional - Observability
MEM0_API_KEY=your-mem0-api-key
KEYWORDS_AI_API_KEY=your-keywords-ai-api-key
KEYWORDS_AI_BASE_URL=https://api.keywordsai.co

# Optional - Enhanced Search
TAVILY_API_KEY=your-tavily-api-key

# Optional - Private Repository Access
GITHUB_TOKEN=ghp_your-github-token

# System Configuration
TEMP_DIR=./temp
CLEANUP_INTERVAL=3600000
LOG_LEVEL=info
```

#### **Client Environment** (`client/.env.local`)
```bash
# Server URL
VITE_SERVER_URL=http://localhost:3001

# Appwrite Configuration
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-appwrite-project-id
VITE_APPWRITE_FUNCTION_ID=your-function-id
```

### 3. Run Development Servers

```bash
# Terminal 1 - Start AI Agent Server
cd server
npm run dev

# Terminal 2 - Start React Client
cd client
npm run dev
```

Access the application at `http://localhost:5173`

---

## 🚀 Quick Production Deployment

### Deployment Issue Resolution

**FIXED**: The deployment issue was caused by a missing Vite plugin dependency.

**Solution Applied**:
- Updated `client/package.json` to use `@vitejs/plugin-react-swc` instead of `@vitejs/plugin-react`
- Updated `render.yaml` to include both frontend and backend services
- Enhanced build process for production deployment

### Platform-Specific Deployment

#### 1. Vercel Deployment (Frontend)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd client
vercel --prod

# Configure environment variables in Vercel dashboard:
# VITE_API_URL=https://your-backend-domain.onrender.com
# VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
# VITE_APPWRITE_PROJECT_ID=your-appwrite-project-id
```

#### 2. Render.com Deployment (Full Stack)

The project includes a `render.yaml` configuration for automatic deployment:

```yaml
services:
  # Backend API Service
  - type: web
    name: devpilot-ai-backend
    env: node
    buildCommand: cd server && npm install
    startCommand: cd server && node server.js
    envVars:
      - key: NODE_ENV
        value: production
    healthCheckPath: /health

  # Frontend Static Site
  - type: web
    name: devpilot-ai-frontend
    env: static
    buildCommand: cd client && npm install && npm run build
    staticPublishPath: ./client/dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

**Deploy Steps**:
1. Connect your GitHub repository to Render
2. Use the `render.yaml` file for automatic configuration
3. Set environment variables in Render dashboard

## 🔧 Environment Configuration

### Frontend Environment Variables (.env.local)

```bash
# Client Environment Variables
VITE_API_URL=https://your-backend-domain.onrender.com
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-appwrite-project-id
```

### Backend Environment Variables (.env)

```bash
# Server Configuration
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.vercel.app

# Appwrite Configuration  
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your-appwrite-project-id
APPWRITE_API_KEY=your-appwrite-api-key

# GitHub OAuth Configuration
GITHUB_CLIENT_ID=your-github-oauth-app-client-id
GITHUB_CLIENT_SECRET=your-github-oauth-app-client-secret

# AI Service Configuration
OPENAI_API_KEY=your-openai-api-key
NOVITA_API_KEY=your-novita-api-key
TAVILY_API_KEY=your-tavily-api-key
MEM0_API_KEY=your-mem0-api-key
KEYWORDS_AI_API_KEY=your-keywords-ai-api-key
```

## 🔒 Appwrite Configuration

### 1. Create Appwrite Project

1. Go to [Appwrite Cloud](https://cloud.appwrite.io)
2. Create a new project
3. Note your Project ID

### 2. Configure Authentication

**OAuth Providers**:
- **GitHub OAuth**: 
  - Callback URL: `https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/github`
  - Success URL: `https://your-frontend-domain.vercel.app/auth-success`
  - Failure URL: `https://your-frontend-domain.vercel.app/auth?error=oauth`

- **Google OAuth**:
  - Callback URL: `https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/google`
  - Success URL: `https://your-frontend-domain.vercel.app/auth-success`
  - Failure URL: `https://your-frontend-domain.vercel.app/auth?error=oauth`

### 3. Database Setup

Create collections for:
- `users` - User profiles and preferences
- `projects` - DevOps automation projects
- `sessions` - AI agent session data

### 4. API Keys

Generate an API key with the following scopes:
- `users.read`, `users.write`
- `databases.read`, `databases.write`
- `sessions.read`, `sessions.write`

## 🔑 GitHub OAuth App Setup

### 1. Create GitHub OAuth App

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Click "New OAuth App"

**Application Details**:
- Application name: `DevPilotAI`
- Homepage URL: `https://your-frontend-domain.vercel.app`
- Authorization callback URL: `https://your-backend-domain.onrender.com/auth/github/callback`

### 2. Configure for Production

**Dual OAuth System**:
1. **Appwrite GitHub OAuth**: For user authentication
2. **Direct GitHub OAuth**: For repository access

Both need separate OAuth apps in GitHub.

## 🤖 AI Services Setup

### 1. Novita.ai (Llama 3 70B)
```bash
# Get API key from https://novita.ai
NOVITA_API_KEY=your-novita-api-key
```

### 2. Tavily (Search & Analysis)
```bash
# Get API key from https://tavily.com
TAVILY_API_KEY=your-tavily-api-key
```

### 3. Mem0 (AI Memory)
```bash
# Get API key from https://mem0.ai
MEM0_API_KEY=your-mem0-api-key
```

### 4. Keywords AI (Observability)
```bash
# Get API key from https://keywordsai.co
KEYWORDS_AI_API_KEY=your-keywords-ai-api-key
```

## 🚀 Production Checklist

### Pre-Deployment

- [ ] **Dependencies Fixed**: Updated to `@vitejs/plugin-react-swc`
- [ ] **Build Process**: Verified `npm run build` works locally
- [ ] **Environment Variables**: All required variables configured
- [ ] **Appwrite Project**: Created and configured
- [ ] **GitHub OAuth**: Both apps created and configured
- [ ] **AI Service Keys**: All API keys obtained and tested

### Appwrite Configuration

- [ ] **Project Created**: New Appwrite project with unique ID
- [ ] **OAuth Providers**: GitHub and Google OAuth configured
- [ ] **Database Schema**: Collections created for users, projects, sessions
- [ ] **API Permissions**: Proper scopes set for API keys
- [ ] **CORS Settings**: Frontend domain added to allowed origins

### GitHub OAuth Setup

- [ ] **User Auth OAuth**: Appwrite GitHub OAuth configured
- [ ] **Repository Access OAuth**: Direct GitHub OAuth for repo operations
- [ ] **Callback URLs**: Proper callback URLs for both environments
- [ ] **Client Secrets**: Securely stored in environment variables

### AI Services Integration

- [ ] **Novita.ai**: API key configured for Llama 3 70B access
- [ ] **Tavily**: Search API configured for code analysis
- [ ] **Mem0**: Memory service configured for persistent context
- [ ] **Keywords AI**: Observability configured for monitoring

### Deployment Testing

- [ ] **Frontend Build**: Vercel deployment successful
- [ ] **Backend API**: Render deployment successful with health checks
- [ ] **Authentication Flow**: OAuth login/signup working
- [ ] **GitHub Integration**: Repository selection and access working
- [ ] **AI Agent Pipeline**: Multi-agent workflow functional
- [ ] **Real-time Updates**: WebSocket connections working
- [ ] **File Downloads**: Generated files downloadable

## 🔍 Troubleshooting

### Common Issues

1. **Build Failures**
   - Ensure `@vitejs/plugin-react-swc` is installed
   - Check for TypeScript errors
   - Verify all environment variables are set

2. **Authentication Issues**
   - Check Appwrite project ID and endpoint
   - Verify OAuth callback URLs
   - Ensure CORS origins are configured

3. **GitHub Integration Issues**
   - Verify both GitHub OAuth apps are configured
   - Check redirect URIs match exactly
   - Ensure GitHub permissions are granted

4. **AI Service Issues**
   - Verify all API keys are valid
   - Check rate limits and quotas
   - Monitor error logs for specific failures

### Performance Optimization

1. **Frontend**
   - Enable gzip compression
   - Optimize bundle size with code splitting
   - Use CDN for static assets

2. **Backend**
   - Enable API response caching
   - Implement connection pooling
   - Monitor memory usage

3. **AI Services**
   - Implement request queuing
   - Add retry logic with exponential backoff
   - Cache frequent AI responses

## 📊 Monitoring & Analytics

### Production Monitoring

1. **Keywords AI Dashboard**: Monitor AI service usage and performance
2. **Appwrite Console**: Track user registrations and API usage  
3. **Render Logs**: Monitor backend performance and errors
4. **Vercel Analytics**: Track frontend performance and user engagement

### Key Metrics to Track

- User registration and authentication success rates
- GitHub repository connection success rates
- AI agent pipeline completion rates
- File generation and download success rates
- Response times for critical API endpoints
- Error rates across all services

## 🔒 Security Considerations

### Production Security

1. **Environment Variables**: Never commit sensitive keys to version control
2. **HTTPS Everywhere**: Ensure all services use HTTPS in production
3. **API Rate Limiting**: Implement rate limiting on all public endpoints
4. **Input Validation**: Validate all user inputs and API requests
5. **Secret Rotation**: Regularly rotate API keys and OAuth secrets

### Compliance

- **Data Privacy**: Ensure GDPR compliance for user data
- **API Security**: Follow OAuth 2.0 security best practices  
- **Audit Logging**: Log all security-relevant events
- **Access Control**: Implement proper user authorization

---

## 🎯 Ready for Production!

With these configurations, DevPilotAI is ready for production deployment with:

✅ **Multi-Agent AI System**: Four specialized agents working in harmony
✅ **Enterprise Authentication**: Secure Appwrite backend with OAuth
✅ **GitHub Integration**: Seamless repository access and operations  
✅ **Real-time Updates**: WebSocket-powered progress tracking
✅ **Scalable Infrastructure**: Cloud-native deployment architecture
✅ **Comprehensive Monitoring**: Full observability across all services

**Next Steps**: Follow the deployment checklist above and deploy to your preferred platform! 