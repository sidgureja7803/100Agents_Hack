# 🤖 AI Agent-Based DevOps Automation System

A true AI agent-based DevOps automation system that uses LangGraph and multi-agent architecture to analyze codebases and generate production-ready CI/CD configurations.

## 🎯 Features

### ✨ Multi-Agent Architecture
- **🤔 Planner Agent**: Analyzes repository structure and creates comprehensive analysis plan
- **🔍 Analyzer Agent**: Detects tech stack, dependencies, and project patterns
- **⚡ Generator Agent**: Creates optimized Dockerfile, GitHub Actions, and .env files
- **✅ Verifier Agent**: Validates configurations for security and best practices

### 🔄 Real-Time Processing
- **📂 GitHub Repository Cloning**: Supports both public and private repositories
- **📡 WebSocket Communication**: Live progress updates from each agent
- **⏱️ Step-by-Step Progress**: Visual progress tracking with detailed agent logs
- **🚨 Error Handling**: Comprehensive error reporting and recovery

### 📊 Intelligent Analysis
- **🔬 Tech Stack Detection**: Automatic detection of frameworks, languages, and tools
- **📋 Dependency Analysis**: Analysis of package files and dependencies
- **🏗️ Project Structure**: Deep analysis of codebase organization
- **📈 Best Practices**: Security and performance optimization recommendations

## 🚀 Quick Start

### Prerequisites

1. **Node.js 18+**
2. **OpenAI API Key** (for GPT-4)
3. **Git** (for repository cloning)

### 1. Server Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Add your OpenAI API key to .env
OPENAI_API_KEY=your_openai_api_key_here
PORT=3001
CLIENT_URL=http://localhost:5173

# Start the AI agent server
npm run dev
```

### 2. Client Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Add server URL to environment
echo "VITE_SERVER_URL=http://localhost:3001" > .env.local

# Start the React client
npm run dev
```

### 3. Access the Application

Open your browser and navigate to `http://localhost:5173`

## 🔧 API Endpoints

### Repository Management
- `POST /api/clone-repo` - Clone GitHub repository
- `POST /api/analyze` - Trigger AI agent analysis
- `GET /api/files/:sessionId` - Get generated files
- `GET /api/status/:sessionId` - Get session status
- `GET /api/sessions` - List active sessions

### Enhanced Generation
- `POST /api/devpilot` - Enhanced generation with agents
- `GET /health` - Health check

### WebSocket Events
- `progress` - Real-time progress updates from agents

## 🤖 Agent Workflow

### 1. Repository Cloning (10-30s)
```
📂 Cloning repository from GitHub
├── Validates repository URL
├── Handles authentication (if needed)
└── Downloads to temporary directory
```

### 2. Planning Phase (15-45s)
```
🤔 Planner Agent
├── Analyzes project structure
├── Identifies key files and directories
├── Creates analysis strategy
└── Plans optimization approach
```

### 3. Analysis Phase (30-60s)
```
🔍 Analyzer Agent
├── Detects programming languages
├── Identifies frameworks and libraries
├── Analyzes dependencies
├── Determines deployment patterns
└── Assesses project complexity
```

### 4. Generation Phase (45-90s)
```
⚡ Generator Agent
├── Creates optimized Dockerfile
├── Generates GitHub Actions workflow
├── Produces .env.example template
├── Applies best practices
└── Optimizes for performance
```

### 5. Verification Phase (15-30s)
```
✅ Verifier Agent
├── Validates syntax correctness
├── Checks security practices
├── Reviews performance optimizations
├── Ensures compliance standards
└── Provides improvement recommendations
```

## 📁 Project Structure

```
├── server/
│   ├── agents/
│   │   └── index.js          # Multi-agent system (LangGraph)
│   ├── server.js             # Express server with WebSocket
│   ├── index.js              # Legacy function (fallback)
│   ├── package.json          # Server dependencies
│   └── env.example           # Environment template
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AgentProgress.tsx      # Real-time progress UI
│   │   │   └── AgentGenerationForm.tsx # Enhanced form
│   │   ├── lib/
│   │   │   └── agentApi.ts            # WebSocket API client
│   │   └── pages/
│   │       └── EnhancedDashboard.tsx  # Updated dashboard
│   └── package.json          # Client dependencies
└── README-AI-AGENTS.md       # This documentation
```

## 🔧 Configuration

### Environment Variables

```bash
# Required
OPENAI_API_KEY=your_openai_api_key_here
PORT=3001
CLIENT_URL=http://localhost:5173

# Optional (for observability)
MEM0_API_KEY=your_mem0_api_key_here
KEYWORDS_AI_API_KEY=your_keywords_ai_api_key_here

# Optional (for private repos)
GITHUB_TOKEN=your_github_token_here
```

### Tech Stack Support

The system automatically detects and supports:

- **Frontend**: React, Vue.js, Angular, Next.js, Nuxt.js
- **Backend**: Node.js, Python, Go, Java, .NET, PHP
- **Databases**: PostgreSQL, MySQL, MongoDB, Redis
- **Languages**: JavaScript, TypeScript, Python, Go, Java, C#, PHP, Rust
- **Frameworks**: Express, FastAPI, Django, Spring, Laravel

## 📊 Real-Time Features

### Progress Tracking
```
[1/5] 📂 Cloning repository... (25%)
[2/5] 🤔 Planner Agent analyzing... (35%)
[3/5] 🔍 Analyzer detecting tech stack... (55%)
[4/5] ⚡ Generator creating CI/CD... (80%)
[5/5] ✅ Verifier validating... (100%)
```

### Live Agent Logs
- Real-time messages from each agent
- Timestamped activity log
- Error reporting and recovery
- Tech stack detection results

### Generated Outputs
- **Dockerfile**: Multi-stage, optimized, secure
- **GitHub Actions**: Complete CI/CD with testing
- **.env.example**: Environment variable template
- **Verification Report**: Security and best practices

## 🛠️ Advanced Usage

### Custom Agent Configuration

```javascript
// Extend the agent system
import { createAgentWorkflow } from './agents/index.js';

const customWorkflow = createAgentWorkflow({
  additionalAgents: ['security', 'performance'],
  customPrompts: { ... },
  advancedFeatures: true
});
```

### WebSocket Integration

```javascript
// Frontend WebSocket usage
import { AgentAPI } from '@/lib/agentApi';

const socket = AgentAPI.initializeSocket((progress) => {
  console.log(`Step: ${progress.step}, Progress: ${progress.progress}%`);
});

const result = await AgentAPI.runCompleteWorkflow(repoUrl);
```

## 🔍 Troubleshooting

### Common Issues

1. **OpenAI API Key Issues**
   ```bash
   Error: OpenAI API key not configured
   Solution: Add OPENAI_API_KEY to your .env file
   ```

2. **Repository Access Issues**
   ```bash
   Error: Repository not accessible
   Solution: Add GITHUB_TOKEN for private repos
   ```

3. **WebSocket Connection Issues**
   ```bash
   Error: Cannot connect to server
   Solution: Ensure server is running on correct port
   ```

### Performance Optimization

- **Concurrent Processing**: Agents run in parallel where possible
- **Caching**: Repository analysis results are cached
- **Cleanup**: Automatic cleanup of temporary files
- **Error Recovery**: Graceful handling of agent failures

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-agent`
3. Add your changes
4. Test the agent system: `npm test`
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Documentation**: Check this README and inline comments
- **Issues**: Create GitHub issues for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions

---

**Built with ❤️ using LangGraph, OpenAI GPT-4, and modern web technologies** 