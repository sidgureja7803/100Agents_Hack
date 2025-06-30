export const MOCK_CHAT_QA = [
  {
    id: 'intro',
    question: 'What does this platform do?',
    answer: `DevPilotAI automates your entire DevOps workflow by analyzing your repository and generating deployment-ready pipelines. It uses AI to:

- Generate Dockerfiles tailored to your tech stack
- Create GitHub Actions workflows for CI/CD
- Set up environment configurations
- Provide deployment instructions for various cloud platforms
- Generate comprehensive documentation`,
  },
  {
    id: 'tech',
    question: 'What technologies does it use?',
    answer: `DevPilotAI leverages cutting-edge AI and cloud technologies:

- **AI & Search**: Tavily for code analysis, Mem0 for context retention
- **Image Generation**: DALL·E for architecture diagrams
- **Backend**: Appwrite for scalable serverless functions
- **Auth**: Clerk.dev for secure authentication
- **LLM**: Anthropic Claude for intelligent code generation
- **Development**: React + TypeScript for a robust frontend`,
  },
  {
    id: 'nodejs',
    question: 'Can it generate a CI/CD pipeline for a Node.js app?',
    answer: `Absolutely! For Node.js applications, DevPilotAI generates:

1. **Dockerfile**:
\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

2. **GitHub Actions Workflow**:
\`\`\`yaml
name: Node.js CI/CD
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run build
      - name: Deploy to Production
        if: github.ref == 'refs/heads/main'
        run: npm run deploy
\`\`\``,
  },
  {
    id: 'security',
    question: 'Is it secure?',
    answer: `Yes, DevPilotAI takes security seriously:

- **Token Management**: All API keys and secrets are securely stored and never exposed
- **Zero Storage**: Code is analyzed in memory and never persisted without explicit consent
- **OAuth Integration**: Secure GitHub integration via OAuth
- **Rate Limiting**: Built-in protection against abuse
- **Audit Logs**: Comprehensive logging of all operations
- **Compliance**: GDPR and SOC 2 compliant architecture`,
  },
];

export const MOCK_TECH_STACKS = [
  {
    id: 'react',
    name: 'React',
    description: 'Modern frontend applications',
    icon: '⚛️',
    config: {
      dockerfile: `FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`,
      
      workflow: `name: React CI/CD
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run build
      - name: Deploy to Production
        if: github.ref == 'refs/heads/main'
        uses: netlify/actions/cli@master
        with:
          args: deploy --prod
        env:
          NETLIFY_AUTH_TOKEN: \${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: \${{ secrets.NETLIFY_SITE_ID }}`,
          
      envExample: `VITE_API_URL=https://api.example.com
VITE_GA_TRACKING_ID=UA-XXXXXXXXX-X
VITE_SENTRY_DSN=https://xxxxx@xxx.ingest.sentry.io/xxxxx`,
      
      deployment: `## Deployment Instructions

1. **Setup Netlify**:
   - Connect your GitHub repository
   - Set build command: \`npm run build\`
   - Set publish directory: \`dist\`
   - Add environment variables

2. **Configure DNS**:
   - Add custom domain in Netlify
   - Update DNS records
   - Enable HTTPS

3. **Monitor**:
   - Check Netlify analytics
   - Setup uptime monitoring
   - Configure error tracking`
    }
  },
  {
    id: 'node',
    name: 'Node.js',
    description: 'Backend API services',
    icon: '🟢',
    config: {
      dockerfile: `FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]`,
      
      workflow: `name: Node.js CI/CD
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - name: Deploy to Production
        if: github.ref == 'refs/heads/main'
        uses: digitalocean/action-doctl@v2
        with:
          token: \${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}`,
          
      envExample: `NODE_ENV=production
PORT=3000
DATABASE_URL=postgres://user:pass@host:5432/db
JWT_SECRET=your-secret-key
REDIS_URL=redis://localhost:6379`,
      
      deployment: `## Deployment Instructions

1. **Setup DigitalOcean**:
   - Create new App Platform project
   - Connect GitHub repository
   - Configure environment variables
   
2. **Database Setup**:
   - Create managed database
   - Run migrations
   - Setup backups
   
3. **Monitoring**:
   - Setup New Relic
   - Configure logging
   - Setup alerts`
    }
  }
];

export const MOCK_REPOSITORIES = [
  {
    id: 1,
    name: 'e-commerce-platform',
    description: 'A modern e-commerce platform built with React and Node.js',
    language: 'TypeScript',
    stars: 128,
    forks: 45,
    updatedAt: '2024-03-10T10:30:00Z'
  },
  {
    id: 2,
    name: 'chat-application',
    description: 'Real-time chat application using WebSocket and React',
    language: 'JavaScript',
    stars: 89,
    forks: 23,
    updatedAt: '2024-03-09T15:45:00Z'
  },
  {
    id: 3,
    name: 'task-management-api',
    description: 'RESTful API for task management using Express and MongoDB',
    language: 'TypeScript',
    stars: 67,
    forks: 12,
    updatedAt: '2024-03-08T09:20:00Z'
  }
]; 