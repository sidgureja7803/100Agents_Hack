# DevPilotAI Backend

AI-powered DevOps assistant backend function that generates production-grade Dockerfiles, CI/CD workflows, environment files, and deployment instructions.

## 🚀 Features

- **Production-grade Dockerfile generation** based on tech stack
- **GitHub Actions CI/CD workflows** with best practices
- **Environment file templates** with common variables
- **Deployment instructions** fetched via Tavily API
- **Memory storage** using Mem0 for session tracking
- **Appwrite Cloud Functions** compatible

## 📋 Requirements

- Node.js 18+
- npm or yarn
- API keys for:
  - [Tavily](https://tavily.com) (for deployment instructions)
  - [Mem0](https://mem0.ai) (for memory storage)

## 🛠️ Setup

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Required API Keys:**
   - `TAVILY_API_KEY`: Get from [Tavily Dashboard](https://app.tavily.com)
   - `MEM0_API_KEY`: Get from [Mem0 Dashboard](https://app.mem0.ai)

## 🧪 Testing

Run the test harness to validate functionality:

```bash
npm test
```

Test without API keys (uses fallback data):
```bash
# Remove or comment out API keys in .env
npm test
```

## 📚 API Usage

### Input Format

```json
{
  "repoUrl": "https://github.com/user/repo",
  "techStack": "React + Node",
  "userId": "unique-user-id"
}
```

### Output Format

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

### Supported Tech Stacks

- React + Node.js
- Node.js only
- Python Flask/Django
- Generic applications

## 🚀 Deployment

### Local Development

```bash
npm run dev
```

### Appwrite Cloud Functions

1. Use the `appwrite.js` file as your function entry point
2. Configure environment variables in Appwrite dashboard
3. Deploy using Appwrite CLI:

```bash
appwrite functions createDeployment \
  --functionId=your-function-id \
  --entrypoint=appwrite.js \
  --code=.
```

## 🔧 Function Architecture

```
DevPilotAI Function
├── Input Validation
├── File Generation
│   ├── Dockerfile (production-ready)
│   ├── GitHub Actions (CI/CD)
│   └── .env.example (tech-specific)
├── External APIs
│   ├── Tavily (deployment docs)
│   └── Mem0 (memory storage)
└── Response Formation
```

## 🌟 Examples

### React + Node.js App

```javascript
const response = await devPilotAI({
  body: {
    repoUrl: 'https://github.com/example/react-app',
    techStack: 'React + Node',
    userId: 'user123'
  }
});
```

### Python Flask API

```javascript
const response = await devPilotAI({
  body: {
    repoUrl: 'https://github.com/example/flask-api',
    techStack: 'Python Flask',
    userId: 'user456'
  }
});
```

## 🔍 Error Handling

The function includes comprehensive error handling:

- Input validation
- API failure fallbacks
- Memory storage error tolerance
- Graceful degradation

## 📝 License

MIT License - see LICENSE file for details. 