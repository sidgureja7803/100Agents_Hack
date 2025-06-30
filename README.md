# DevPilotAI - AI-Powered DevOps Automation Platform

DevPilotAI is a comprehensive AI-powered platform that automates DevOps workflows by analyzing GitHub repositories and generating production-ready CI/CD configurations. The platform uses a multi-agent system to intelligently analyze codebases, detect tech stacks, and create deployment-ready files.

## 🚀 Features

- **Multi-Agent AI System**: Uses LangGraph with specialized agents for different tasks
- **GitHub Integration**: Connect your GitHub account and analyze any repository
- **Tech Stack Detection**: Automatically detects programming languages and frameworks
- **CI/CD Generation**: Creates Dockerfiles, GitHub Actions workflows, and environment files
- **Real-time Progress**: Live updates during analysis with WebSocket integration
- **Secure Authentication**: Powered by Appwrite with OAuth support
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS

## 🏗️ Architecture

### Authentication & Database
- **Appwrite**: Handles user authentication (email/password + OAuth) and data storage
- **GitHub OAuth**: Integrated through Appwrite for seamless GitHub account connection

### Repository Operations
- **GitHub API**: Used for repository discovery, access, and cloning operations
- **Simple Git**: Handles repository cloning and file operations

### AI & Intelligence
- **LangGraph Multi-Agent System**: Four specialized agents working together:
  - **Planner Agent**: Analyzes repository structure and creates execution plans
  - **Analyzer Agent**: Detects tech stack and dependencies
  - **Generator Agent**: Creates CI/CD files (Dockerfile, GitHub Actions, .env.example)
  - **Verifier Agent**: Validates and optimizes generated configurations
- **Llama 3 70B**: Powers the AI agents via Novita.ai API
- **Tavily API**: Provides real-time deployment documentation and best practices
- **Mem0**: Stores user interaction history and preferences for personalized recommendations

### Real-time Communication
- **Socket.IO**: Enables real-time progress updates and agent communication
- **WebSocket**: Live streaming of analysis progress to the frontend

## 🛠️ Technology Stack

### Frontend
- React 18 + TypeScript
- Tailwind CSS + shadcn/ui components
- React Router for navigation
- Socket.IO client for real-time updates
- Appwrite SDK for authentication

### Backend
- Node.js + Express
- Socket.IO for real-time communication
- Appwrite for authentication and database
- GitHub API for repository operations
- LangGraph for multi-agent orchestration

### AI & External Services
- **Llama 3 70B** (via Novita.ai) - Core AI model
- **Tavily API** - Real-time search and documentation
- **Mem0** - User memory and preferences
- **Appwrite** - Authentication and database
- **GitHub API** - Repository operations

## 🔧 Environment Variables

### Frontend (.env)
```bash
# API Configuration
VITE_API_URL=https://your-backend-url.com

# Appwrite Configuration
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-appwrite-project-id
```

### Backend (.env)
```bash
# Server Configuration
PORT=3001
NODE_ENV=production
CLIENT_URL=https://your-frontend-url.com

# Appwrite Configuration (for user authentication & database)
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your-appwrite-project-id
APPWRITE_API_KEY=your-appwrite-api-key

# GitHub Configuration (for repository operations)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_REDIRECT_URI=https://your-backend-url.com/auth/github/callback
JWT_SECRET=your-jwt-secret-for-github-sessions

# AI & External Services
LLAMA_API_KEY=your-novita-ai-api-key
TAVILY_API_KEY=your-tavily-api-key
MEM0_API_KEY=your-mem0-api-key
KEYWORDS_AI_API_KEY=your-keywords-ai-api-key
```

## 🔐 Authentication Flow

1. **User Authentication**: Handled entirely by Appwrite
   - Email/Password signup and login
   - GitHub OAuth (for user authentication)
   - Google OAuth (optional)
   - Session management and user profiles

2. **GitHub Repository Access**: Separate from authentication
   - Uses GitHub API with personal access tokens
   - Required for repository discovery and cloning
   - Enables access to private repositories

## 📋 Setup Instructions

### 1. Appwrite Setup
1. Create an Appwrite project at [cloud.appwrite.io](https://cloud.appwrite.io)
2. Enable Authentication providers:
   - Email/Password
   - GitHub OAuth (callback: `https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/github`)
   - Google OAuth (optional)
3. Get your Project ID and API Key

### 2. GitHub OAuth App (for repository access)
1. Go to GitHub Developer Settings
2. Create a new OAuth App with:
   - Homepage URL: `https://your-frontend-url.com`
   - Authorization callback URL: `https://your-backend-url.com/auth/github/callback`
3. Get Client ID and Client Secret

### 3. External API Keys
- **Novita.ai**: For Llama 3 70B model access
- **Tavily**: For real-time search and documentation
- **Mem0**: For user memory and preferences
- **Keywords AI**: For observability (optional)

### 4. Installation

```bash
# Clone the repository
git clone https://github.com/your-repo/devpilot-ai.git
cd devpilot-ai

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start the development servers
# Backend
cd server
npm run dev

# Frontend (in another terminal)
cd client
npm run dev
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Deploy to Vercel
npm run build
vercel --prod
```

### Backend (Render)
```bash
# Deploy to Render
# Connect your GitHub repository to Render
# Set environment variables in Render dashboard
```

## 🤖 Multi-Agent System

The platform uses a sophisticated multi-agent system powered by LangGraph:

### Agent Workflow
1. **Planner Agent**: Analyzes repository structure and creates execution plan
2. **Analyzer Agent**: Detects tech stack, dependencies, and patterns
3. **Generator Agent**: Creates optimized CI/CD files
4. **Verifier Agent**: Validates configurations and suggests improvements

### Agent Communication
- Agents communicate through a shared state graph
- Real-time progress updates via WebSocket
- Error handling and recovery mechanisms
- Parallel execution where possible

## 📊 Key Integrations

### GitHub Integration
- **Purpose**: Repository discovery, access, and cloning
- **Scope**: `repo`, `user:email`
- **Usage**: After Appwrite authentication, users can connect GitHub for repo access

### Appwrite Integration
- **Purpose**: User authentication, session management, data storage
- **Features**: Email/password auth, OAuth providers, user profiles
- **Database**: Stores user preferences, project history, and settings

### AI Services Integration
- **Llama 3 70B**: Core reasoning and code analysis
- **Tavily**: Real-time documentation and best practices
- **Mem0**: Personalized recommendations based on user history

## 🔍 API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### GitHub Operations
- `GET /auth/github` - Initiate GitHub OAuth for repo access
- `GET /auth/github/callback` - GitHub OAuth callback
- `GET /api/github/repositories` - Get user repositories
- `GET /api/github/organizations/:org/repositories` - Get org repositories

### AI Analysis
- `POST /api/clone-repo` - Clone repository for analysis
- `POST /api/analyze` - Run multi-agent analysis
- `GET /api/analysis/:sessionId` - Get analysis results
- `GET /api/files/:sessionId/:filename` - Download generated files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review environment variable setup

---

Built with ❤️ using Appwrite, GitHub API, LangGraph, and modern web technologies. 