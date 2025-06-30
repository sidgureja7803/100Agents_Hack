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

## ☁️ **Production Deployment**

### **Option 1: Vercel + Railway (Recommended)**

#### **Deploy Frontend to Vercel**

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy frontend
   cd client
   vercel --prod
   ```

2. **Configure Environment Variables in Vercel Dashboard**
   ```bash
   VITE_SERVER_URL=https://your-railway-app.railway.app
   VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   VITE_APPWRITE_PROJECT_ID=your-project-id
   VITE_APPWRITE_FUNCTION_ID=your-function-id
   ```

#### **Deploy Backend to Railway**

1. **Create Railway Account** at [railway.app](https://railway.app)

2. **Deploy via GitHub**
   - Connect your GitHub repository
   - Select the `server` folder as root
   - Configure environment variables

3. **Railway Environment Variables**
   ```bash
   OPENAI_API_KEY=sk-your-openai-api-key
   NODE_ENV=production
   PORT=3001
   CLIENT_URL=https://your-vercel-app.vercel.app
   MEM0_API_KEY=your-mem0-api-key
   KEYWORDS_AI_API_KEY=your-keywords-ai-key
   TAVILY_API_KEY=your-tavily-api-key
   ```

### **Option 2: Docker Deployment**

#### **Create Docker Files**

**Server Dockerfile** (`server/Dockerfile`)
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Create temp directory
RUN mkdir -p temp

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

CMD ["npm", "start"]
```

**Client Dockerfile** (`client/Dockerfile`)
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Production image
FROM nginx:alpine

# Copy built app
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**Docker Compose** (`docker-compose.yml`)
```yaml
version: '3.8'

services:
  server:
    build: ./server
    ports:
      - "3001:3001"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - CLIENT_URL=http://localhost:3000
    volumes:
      - ./server/temp:/app/temp
    restart: unless-stopped

  client:
    build: ./client
    ports:
      - "3000:80"
    environment:
      - VITE_SERVER_URL=http://localhost:3001
    depends_on:
      - server
    restart: unless-stopped

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    restart: unless-stopped
```

#### **Deploy with Docker**

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Scale services
docker-compose up -d --scale server=3
```

### **Option 4: Kubernetes Deployment**

#### **Kubernetes Manifests**

**Namespace** (`k8s/namespace.yaml`)
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: devpilot-ai
```

**ConfigMap** (`k8s/configmap.yaml`)
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: devpilot-config
  namespace: devpilot-ai
data:
  NODE_ENV: "production"
  PORT: "3001"
  CLIENT_URL: "https://your-domain.com"
```

**Secret** (`k8s/secret.yaml`)
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: devpilot-secrets
  namespace: devpilot-ai
type: Opaque
stringData:
  OPENAI_API_KEY: "sk-your-openai-api-key"
  MEM0_API_KEY: "your-mem0-key"
  KEYWORDS_AI_API_KEY: "your-keywords-ai-key"
```

**Deployment** (`k8s/deployment.yaml`)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: devpilot-server
  namespace: devpilot-ai
spec:
  replicas: 3
  selector:
    matchLabels:
      app: devpilot-server
  template:
    metadata:
      labels:
        app: devpilot-server
    spec:
      containers:
      - name: server
        image: your-registry/devpilot-server:latest
        ports:
        - containerPort: 3001
        envFrom:
        - configMapRef:
            name: devpilot-config
        - secretRef:
            name: devpilot-secrets
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "2Gi"
            cpu: "1000m"
        readinessProbe:
          httpGet:
            path: /health
            port: 3001
          initialDelaySeconds: 30
          periodSeconds: 10
```

**Service** (`k8s/service.yaml`)
```yaml
apiVersion: v1
kind: Service
metadata:
  name: devpilot-server-service
  namespace: devpilot-ai
spec:
  selector:
    app: devpilot-server
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3001
  type: ClusterIP
```

**Ingress** (`k8s/ingress.yaml`)
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: devpilot-ingress
  namespace: devpilot-ai
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/websocket-services: "devpilot-server-service"
spec:
  tls:
  - hosts:
    - api.your-domain.com
    secretName: devpilot-tls
  rules:
  - host: api.your-domain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: devpilot-server-service
            port:
              number: 80
```

#### **Deploy to Kubernetes**

```bash
# Apply all manifests
kubectl apply -f k8s/

# Check deployment status
kubectl get pods -n devpilot-ai

# View logs
kubectl logs -f deployment/devpilot-server -n devpilot-ai

# Scale deployment
kubectl scale deployment/devpilot-server --replicas=5 -n devpilot-ai
```

---

## 🔐 **Security Configuration**

### **Environment Security**

1. **API Key Management**
   ```bash
   # Use environment variable managers
   # AWS: Secrets Manager
   # Azure: Key Vault
   # GCP: Secret Manager
   # Railway: Environment Variables
   # Vercel: Environment Variables
   ```

2. **Network Security**
   ```bash
   # Enable HTTPS only
   # Configure CORS properly
   # Use API rate limiting
   # Enable request validation
   ```

### **Appwrite Security Setup**

1. **Create Appwrite Project**
   - Go to [Appwrite Console](https://cloud.appwrite.io)
   - Create new project
   - Configure authentication methods

2. **Database Setup**
   ```javascript
   // Create collections for:
   // - Users
   // - Projects
   // - Analysis Results
   // - Agent Logs
   ```

3. **Function Deployment**
   ```bash
   # Deploy server function to Appwrite
   appwrite functions create \
     --functionId=devpilot-ai \
     --name="DevPilot AI Agent System" \
     --runtime=node-18.0
   ```

---

## 📊 **Monitoring & Observability**

### **Keywords AI Setup**

1. **Configure Tracking**
   ```javascript
   // In server/index.js
   const KEYWORDS_AI_CONFIG = {
     apiKey: process.env.KEYWORDS_AI_API_KEY,
     baseUrl: 'https://api.keywordsai.co'
   };
   ```

2. **Monitor Metrics**
   - Agent performance
   - API response times  
   - Error rates
   - User engagement

### **Health Checks**

```bash
# Server health check
curl https://your-api-domain.com/health

# Expected response
{
  "status": "healthy",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "services": {
    "openai": "connected",
    "filesystem": "accessible",
    "memory": "optimal"
  }
}
```

---

## 🔄 **CI/CD Pipeline**

### **GitHub Actions** (`.github/workflows/deploy.yml`)

```yaml
name: Deploy DevPilot AI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: |
        cd server && npm ci
        cd ../client && npm ci
    
    - name: Run tests
      run: |
        cd server && npm test
        cd ../client && npm test

  deploy-server:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v4
    
    - name: Deploy to Railway
      uses: railway/cli@v2
      with:
        service: devpilot-server
        token: ${{ secrets.RAILWAY_TOKEN }}

  deploy-client:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v4
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        working-directory: ./client
```

---

## 🐛 **Troubleshooting**

### **Common Issues**

1. **OpenAI API Rate Limits**
   ```bash
   Error: Rate limit exceeded
   Solution: Implement request queuing and retry logic
   ```

2. **Memory Issues**
   ```bash
   Error: Out of memory during repository cloning
   Solution: Increase server memory or implement streaming
   ```

3. **WebSocket Connection Failures**
   ```bash
   Error: WebSocket connection failed
   Solution: Check CORS settings and proxy configuration
   ```

4. **Agent Pipeline Timeouts**
   ```bash
   Error: Agent analysis timeout
   Solution: Increase timeout limits or optimize prompts
   ```

### **Debug Commands**

```bash
# Check server logs
docker logs devpilot-server

# Monitor resource usage
docker stats

# Test API endpoints
curl -X POST https://api.your-domain.com/api/clone-repo \
  -H "Content-Type: application/json" \
  -d '{"repoUrl": "https://github.com/test/repo"}'

# Check agent status
curl https://api.your-domain.com/api/sessions
```

---

## 🎯 **Performance Optimization**

### **Server Optimization**

1. **Caching Strategy**
   ```javascript
   // Implement Redis caching for:
   // - Repository analysis results
   // - Agent workflow states
   // - Generated configurations
   ```

2. **Load Balancing**
   ```bash
   # Use multiple server instances
   # Implement session affinity
   # Configure health checks
   ```

### **Client Optimization**

1. **Build Optimization**
   ```bash
   # Enable code splitting
   # Optimize bundle size
   # Implement lazy loading
   ```

2. **CDN Configuration**
   ```bash
   # Use Vercel Edge Network
   # Configure caching headers
   # Optimize static assets
   ```

---

## 📈 **Scaling Guidelines**

### **Horizontal Scaling**

```bash
# Scale server instances
kubectl scale deployment/devpilot-server --replicas=10

# Add Redis cluster for session management
# Implement database read replicas
# Use CDN for static content
```

### **Resource Requirements by Scale**

| Users    | Server Instances | Memory/Instance | CPU/Instance |
|----------|------------------|------------------|--------------|
| 1-100    | 1-2             | 1GB             | 1 vCPU       |
| 100-1K   | 2-5             | 2GB             | 2 vCPU       |
| 1K-10K   | 5-15            | 4GB             | 4 vCPU       |
| 10K+     | 15+             | 8GB             | 8 vCPU       |

---

## 🆘 **Support & Maintenance**

### **Regular Maintenance**

1. **Weekly Tasks**
   - Monitor API usage and costs
   - Review error logs
   - Update dependencies

2. **Monthly Tasks**
   - Performance analysis
   - Security updates
   - Backup verification

3. **Quarterly Tasks**
   - Infrastructure review
   - Cost optimization
   - Feature planning

### **Support Channels**

- **GitHub Issues**: Bug reports and feature requests
- **Documentation**: Check README-AI-AGENTS.md
- **Community**: Discord server for discussions

---

## 🎉 **Success Checklist**

After deployment, verify:

- ✅ **Frontend accessible** at your domain
- ✅ **API health check** returns 200 status
- ✅ **WebSocket connection** working for real-time updates
- ✅ **Repository cloning** functional
- ✅ **AI agents pipeline** completing successfully
- ✅ **File generation** producing valid outputs
- ✅ **Error handling** working correctly
- ✅ **Monitoring** collecting metrics
- ✅ **Security** properly configured

---

**🚀 Your AI Agent DevOps Platform is now ready for production!**

For additional support, refer to our [comprehensive documentation](./README-AI-AGENTS.md) or reach out through our support channels. 