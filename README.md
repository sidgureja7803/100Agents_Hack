# DevPilotAI 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

> **AI-powered DevOps assistant that generates production-grade Dockerfiles, CI/CD workflows, environment files, and deployment instructions from any GitHub repository.**

## 🌟 Features

### 🤖 AI-Powered Generation
- **Smart Repository Analysis**: AI analyzes your codebase to understand the tech stack
- **Production-Ready Dockerfiles**: Multi-stage builds with security best practices
- **Complete CI/CD Pipelines**: GitHub Actions workflows with testing, building, and deployment
- **Environment Templates**: Comprehensive `.env.example` files with all necessary variables
- **Deployment Documentation**: Step-by-step guides for various cloud platforms

### 🔧 Tech Stack Support
- **React + Node.js**: Full-stack web applications
- **Node.js**: API servers and backend services  
- **Python Flask/Django**: Python web applications
- **Generic Applications**: Automatic detection and configuration

### 🛡️ Security & Privacy
- **No Code Storage**: Source code is analyzed but never stored permanently
- **OAuth Authentication**: Secure login with Google and GitHub
- **Server-Side Processing**: All sensitive operations handled securely on backend

### 📊 Advanced Features
- **Memory Integration**: Persistent user preferences and generation history
- **Real-time Observability**: Advanced analytics and monitoring
- **Interactive Chat**: AI assistant for deployment questions
- **Modern UI**: Beautiful, responsive interface built with shadcn/ui

## 🏗️ Architecture

```
DevPilotAI/
├── client/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Application pages
│   │   ├── lib/            # API clients and utilities
│   │   └── contexts/       # React contexts
│   └── package.json
└── server/                 # Node.js backend
    ├── index.js            # Main server function
    ├── test.js             # Test suite
    └── package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/DevPilot.git
cd DevPilot
```

### 2. Backend Setup
```bash
cd server
npm install

# Create environment file
cp .env.example .env
# Edit .env with your API keys (see Configuration section)

# Test the backend
npm test

# Start development server
npm run dev
```

### 3. Frontend Setup
```bash
cd ../client
npm install

# Create environment file
cp .env.example .env.local
# Add your Appwrite configuration

# Start development server
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:5173
- Backend: http://localhost:3000 (if running standalone)

## ⚙️ Configuration

### Backend Environment Variables (.env)
```bash
# Required API Keys
TAVILY_API_KEY=your_tavily_api_key_here
MEM0_API_KEY=your_mem0_api_key_here
KEYWORDS_AI_API_KEY=your_keywords_ai_api_key_here

# Optional Configuration
NODE_ENV=development
PORT=3000
KEYWORDS_AI_BASE_URL=https://api.keywordsai.co
```

### Frontend Environment Variables (.env.local)
```bash
# Appwrite Configuration
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_appwrite_project_id

# API Endpoint (if different from default)
VITE_API_URL=http://localhost:3000
```

### Getting API Keys

1. **Tavily API** (Documentation Search)
   - Visit: https://tavily.com
   - Sign up and get your API key from the dashboard

2. **Mem0 API** (Memory Storage)
   - Visit: https://mem0.ai
   - Create account and get API key from dashboard

3. **Keywords AI** (Observability - Optional)
   - Visit: https://keywordsai.co
   - Get API key for analytics and monitoring

4. **Appwrite** (Authentication)
   - Visit: https://appwrite.io
   - Create project and configure OAuth providers

## 🧪 Testing

### Backend Tests
```bash
cd server
npm test
```

The test suite includes:
- ✅ React + Node.js application generation
- ✅ Node.js API generation  
- ✅ Python Flask application generation
- ✅ Input validation
- ✅ Error handling
- ✅ Performance testing

### Frontend Tests
```bash
cd client
npm run build    # Test production build
npm run lint     # Run linting
```

## 📦 Deployment

### Backend Deployment

#### Appwrite Cloud Functions
```bash
# Install Appwrite CLI
npm install -g appwrite-cli

# Login to Appwrite
appwrite login

# Deploy function
appwrite functions createDeployment \
  --functionId=your-function-id \
  --entrypoint=appwrite.js \
  --code=.
```

#### Docker Deployment
```bash
cd server
docker build -t devpilot-backend .
docker run -p 3000:3000 --env-file .env devpilot-backend
```

### Frontend Deployment

#### Vercel (Recommended)
```bash
cd client
npm install -g vercel
vercel --prod
```

#### Netlify
```bash
cd client
npm run build
# Upload dist/ folder to Netlify
```

#### Docker
```bash
cd client
docker build -t devpilot-frontend .
docker run -p 80:80 devpilot-frontend
```

## 🔌 API Reference

### Generate CI/CD Configuration

**POST** `/api/generate`

```json
{
  "repoUrl": "https://github.com/username/repository",
  "techStack": "React + Node",
  "userId": "user-unique-id"
}
```

**Response:**
```json
{
  "dockerfile": "# Production Dockerfile content...",
  "githubActions": "# CI/CD workflow YAML...",
  "envExample": "# Environment variables...",
  "docs": [
    {
      "title": "Deployment Guide",
      "url": "https://...",
      "content": "Guide description..."
    }
  ]
}
```

## 🛠️ Development

### Project Structure

#### Frontend (`/client`)
- **Framework**: React 18 + TypeScript + Vite
- **UI Library**: shadcn/ui + Tailwind CSS
- **State Management**: React Query + Context API
- **Authentication**: Appwrite
- **Routing**: React Router

#### Backend (`/server`)
- **Runtime**: Node.js 18+
- **APIs**: Tavily, Mem0, Keywords AI
- **Architecture**: Cloud Functions compatible
- **Testing**: Custom test harness

### Adding New Tech Stacks

1. Update `generateDockerfile()` in `server/index.js`
2. Add corresponding CI/CD templates in `generateGitHubActions()`
3. Update environment templates in `generateEnvExample()`
4. Add tech stack option in frontend `TechStackSelector` component

### Local Development Tips

```bash
# Run both frontend and backend
npm run dev:all    # If you have concurrently installed

# Or run separately
cd server && npm run dev &
cd client && npm run dev
```

## 🐛 Troubleshooting

### Common Issues

**Backend Tests Failing**
- Ensure Node.js 18+ is installed
- Check API keys in `.env` file
- Run `npm install` in server directory

**Frontend Build Errors**
- Update browserslist: `npx update-browserslist-db@latest`
- Clear node_modules: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run type-check`

**Authentication Issues**
- Verify Appwrite project configuration
- Check OAuth provider settings
- Ensure correct redirect URLs

**API Rate Limits**
- Tavily: 1000 requests/month free tier
- Mem0: Check your quota in dashboard
- Consider implementing request caching

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

### Development Guidelines
- Follow TypeScript best practices
- Add tests for new features
- Update documentation
- Use conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Tavily](https://tavily.com) - AI-powered web search
- [Mem0](https://mem0.ai) - Memory and context management
- [Keywords AI](https://keywordsai.co) - Observability platform
- [Appwrite](https://appwrite.io) - Backend-as-a-Service
- [shadcn/ui](https://ui.shadcn.com) - UI component library

## 📞 Support

- 📧 Email: support@devpilotai.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/DevPilot/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/your-username/DevPilot/discussions)

---

<div align="center">
  <p>Built with ❤️ by the DevPilotAI team</p>
  <p>⭐ Star us on GitHub if this project helped you!</p>
</div> 