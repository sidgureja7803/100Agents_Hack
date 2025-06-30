import { StateGraph, END } from '@langchain/langgraph';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import fs from 'fs-extra';
import path from 'path';

// Initialize OpenAI model
const model = new ChatOpenAI({
  modelName: 'gpt-4-turbo-preview',
  temperature: 0.1,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

// Agent state interface
class AgentState {
  constructor() {
    this.repoUrl = '';
    this.repoPath = '';
    this.codebaseAnalysis = null;
    this.techStack = null;
    this.projectStructure = null;
    this.generatedFiles = {};
    this.currentStep = '';
    this.progress = 0;
    this.messages = [];
    this.errors = [];
  }
}

// Planner Agent - Decides what needs to be analyzed and built
const plannerAgent = async (state) => {
  console.log('🤔 Planner Agent: Planning project analysis...');
  
  state.currentStep = 'Planning project analysis';
  state.progress = 20;
  
  const plannerPrompt = `
You are a DevOps Planning Agent. Your task is to analyze the repository structure and create a comprehensive plan.

Repository URL: ${state.repoUrl}
Repository structure has been cloned to: ${state.repoPath}

Based on typical project patterns, create a plan that includes:
1. File types to analyze for tech stack detection
2. Key configuration files to examine
3. Dependencies to check
4. Deployment strategy recommendations

Return a JSON plan with these categories.
`;

  try {
    const response = await model.invoke([
      new SystemMessage(plannerPrompt),
      new HumanMessage(`Plan the analysis for: ${state.repoUrl}`)
    ]);
    
    state.messages.push({
      agent: 'planner',
      message: 'Created comprehensive analysis plan',
      timestamp: new Date().toISOString()
    });
    
    // Parse the response to extract planning information
    const planContent = response.content;
    state.analysisplan = planContent;
    
    return state;
  } catch (error) {
    state.errors.push(`Planner Agent Error: ${error.message}`);
    return state;
  }
};

// Analyzer Agent - Analyzes the codebase structure and determines tech stack
const analyzerAgent = async (state) => {
  console.log('🔍 Analyzer Agent: Analyzing codebase...');
  
  state.currentStep = 'Analyzing codebase structure';
  state.progress = 50;
  
  try {
    // Read project structure
    const projectFiles = await scanProjectStructure(state.repoPath);
    state.projectStructure = projectFiles;
    
    // Analyze tech stack
    const techStackAnalysis = await analyzeTechStack(state.repoPath, projectFiles);
    state.techStack = techStackAnalysis;
    
    // Detailed codebase analysis
    const detailedAnalysis = await performDetailedAnalysis(state.repoPath, projectFiles);
    state.codebaseAnalysis = detailedAnalysis;
    
    state.messages.push({
      agent: 'analyzer',
      message: `Detected tech stack: ${techStackAnalysis.primary}`,
      timestamp: new Date().toISOString()
    });
    
    return state;
  } catch (error) {
    state.errors.push(`Analyzer Agent Error: ${error.message}`);
    return state;
  }
};

// Generator Agent - Generates CI/CD files based on analysis
const generatorAgent = async (state) => {
  console.log('⚡ Generator Agent: Generating CI/CD files...');
  
  state.currentStep = 'Generating CI/CD configurations';
  state.progress = 80;
  
  const generatorPrompt = `
You are a DevOps Generation Agent. Based on the codebase analysis, generate production-ready files.

Tech Stack: ${JSON.stringify(state.techStack, null, 2)}
Project Structure: ${JSON.stringify(state.projectStructure, null, 2)}
Analysis: ${JSON.stringify(state.codebaseAnalysis, null, 2)}

Generate the following files with best practices:
1. Dockerfile - Multi-stage, optimized, secure
2. GitHub Actions Workflow - Complete CI/CD pipeline
3. .env.example - All required environment variables

For each file, provide the complete content optimized for this specific project.
`;

  try {
    // Generate Dockerfile
    const dockerfileResponse = await model.invoke([
      new SystemMessage(generatorPrompt),
      new HumanMessage('Generate an optimized Dockerfile for this project')
    ]);
    
    // Generate GitHub Actions
    const githubActionsResponse = await model.invoke([
      new SystemMessage(generatorPrompt),
      new HumanMessage('Generate a complete GitHub Actions CI/CD workflow')
    ]);
    
    // Generate .env.example
    const envExampleResponse = await model.invoke([
      new SystemMessage(generatorPrompt),
      new HumanMessage('Generate a comprehensive .env.example file')
    ]);
    
    state.generatedFiles = {
      dockerfile: dockerfileResponse.content,
      githubActions: githubActionsResponse.content,
      envExample: envExampleResponse.content
    };
    
    state.messages.push({
      agent: 'generator',
      message: 'Generated all CI/CD configuration files',
      timestamp: new Date().toISOString()
    });
    
    return state;
  } catch (error) {
    state.errors.push(`Generator Agent Error: ${error.message}`);
    return state;
  }
};

// Verifier Agent - Checks and validates generated files
const verifierAgent = async (state) => {
  console.log('✅ Verifier Agent: Validating generated files...');
  
  state.currentStep = 'Validating generated configurations';
  state.progress = 95;
  
  const verifierPrompt = `
You are a DevOps Verification Agent. Review the generated files for:
1. Syntax correctness
2. Security best practices
3. Performance optimizations
4. Compliance with standards

Generated Files:
- Dockerfile: ${state.generatedFiles.dockerfile?.substring(0, 500)}...
- GitHub Actions: ${state.generatedFiles.githubActions?.substring(0, 500)}...
- .env.example: ${state.generatedFiles.envExample?.substring(0, 500)}...

Provide verification results and any recommendations for improvements.
`;

  try {
    const response = await model.invoke([
      new SystemMessage(verifierPrompt),
      new HumanMessage('Verify and validate all generated files')
    ]);
    
    state.verificationResults = response.content;
    state.currentStep = 'Complete';
    state.progress = 100;
    
    state.messages.push({
      agent: 'verifier',
      message: 'Validation complete - all files verified',
      timestamp: new Date().toISOString()
    });
    
    return state;
  } catch (error) {
    state.errors.push(`Verifier Agent Error: ${error.message}`);
    return state;
  }
};

// Helper function to scan project structure
async function scanProjectStructure(repoPath) {
  const structure = {};
  
  const scanDirectory = async (dirPath, relativePath = '') => {
    const items = await fs.readdir(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const itemRelativePath = path.join(relativePath, item);
      
      // Skip node_modules, .git, and other common ignore patterns
      if (item.startsWith('.') && item !== '.env.example' && item !== '.gitignore') continue;
      if (item === 'node_modules' || item === 'vendor' || item === '__pycache__') continue;
      
      const stat = await fs.stat(fullPath);
      
      if (stat.isDirectory()) {
        structure[itemRelativePath] = { type: 'directory', items: {} };
        await scanDirectory(fullPath, itemRelativePath);
      } else {
        structure[itemRelativePath] = { 
          type: 'file', 
          size: stat.size,
          extension: path.extname(item)
        };
      }
    }
  };
  
  await scanDirectory(repoPath);
  return structure;
}

// Helper function to analyze tech stack
async function analyzeTechStack(repoPath, projectFiles) {
  const analysis = {
    primary: 'unknown',
    frontend: [],
    backend: [],
    database: [],
    deployment: [],
    languages: [],
    frameworks: [],
    confidence: 0
  };
  
  // Check for common files that indicate tech stack
  const files = Object.keys(projectFiles);
  
  // Package managers and language indicators
  if (files.includes('package.json')) {
    try {
      const packageJson = await fs.readJSON(path.join(repoPath, 'package.json'));
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      if (deps.react) analysis.frontend.push('React');
      if (deps.vue) analysis.frontend.push('Vue.js');
      if (deps.angular) analysis.frontend.push('Angular');
      if (deps.express) analysis.backend.push('Express.js');
      if (deps.fastify) analysis.backend.push('Fastify');
      if (deps.next) analysis.frameworks.push('Next.js');
      if (deps.typescript) analysis.languages.push('TypeScript');
      
      analysis.languages.push('JavaScript');
      analysis.primary = 'Node.js';
    } catch (error) {
      console.warn('Could not parse package.json:', error.message);
    }
  }
  
  if (files.includes('requirements.txt') || files.includes('pyproject.toml')) {
    analysis.primary = 'Python';
    analysis.languages.push('Python');
    
    if (files.includes('manage.py')) analysis.frameworks.push('Django');
    if (files.includes('app.py') || files.includes('main.py')) analysis.frameworks.push('Flask/FastAPI');
  }
  
  if (files.includes('go.mod')) {
    analysis.primary = 'Go';
    analysis.languages.push('Go');
  }
  
  if (files.includes('Cargo.toml')) {
    analysis.primary = 'Rust';
    analysis.languages.push('Rust');
  }
  
  if (files.includes('pom.xml') || files.includes('build.gradle')) {
    analysis.primary = 'Java';
    analysis.languages.push('Java');
    if (files.includes('pom.xml')) analysis.frameworks.push('Maven');
    if (files.includes('build.gradle')) analysis.frameworks.push('Gradle');
  }
  
  // Database indicators
  if (files.some(f => f.includes('docker-compose'))) {
    analysis.deployment.push('Docker Compose');
  }
  
  if (files.includes('Dockerfile')) {
    analysis.deployment.push('Docker');
  }
  
  return analysis;
}

// Helper function for detailed analysis
async function performDetailedAnalysis(repoPath, projectFiles) {
  const analysis = {
    fileCount: Object.keys(projectFiles).length,
    directories: Object.values(projectFiles).filter(f => f.type === 'directory').length,
    totalSize: Object.values(projectFiles).reduce((sum, f) => sum + (f.size || 0), 0),
    keyFiles: [],
    configFiles: [],
    hasTests: false,
    hasDocumentation: false,
    hasCICD: false
  };
  
  const files = Object.keys(projectFiles);
  
  // Identify key files
  const keyPatterns = [
    'package.json', 'requirements.txt', 'go.mod', 'Cargo.toml',
    'Dockerfile', 'docker-compose.yml', '.github/workflows',
    'README.md', 'LICENSE', '.gitignore'
  ];
  
  analysis.keyFiles = files.filter(file => 
    keyPatterns.some(pattern => file.includes(pattern))
  );
  
  // Check for tests
  analysis.hasTests = files.some(file => 
    file.includes('test') || file.includes('spec') || file.includes('__tests__')
  );
  
  // Check for documentation
  analysis.hasDocumentation = files.some(file => 
    file.toLowerCase().includes('readme') || file.toLowerCase().includes('docs')
  );
  
  // Check for existing CI/CD
  analysis.hasCICD = files.some(file => 
    file.includes('.github/workflows') || file.includes('.gitlab-ci') || file.includes('Jenkinsfile')
  );
  
  return analysis;
}

// Create the multi-agent workflow
export function createAgentWorkflow() {
  const workflow = new StateGraph();
  
  // Add nodes
  workflow.addNode('planner', plannerAgent);
  workflow.addNode('analyzer', analyzerAgent);
  workflow.addNode('generator', generatorAgent);
  workflow.addNode('verifier', verifierAgent);
  
  // Define the flow
  workflow.addEdge('planner', 'analyzer');
  workflow.addEdge('analyzer', 'generator');
  workflow.addEdge('generator', 'verifier');
  workflow.addEdge('verifier', END);
  
  // Set entry point
  workflow.setEntryPoint('planner');
  
  return workflow.compile();
}

// Main function to run the agent pipeline
export async function runAgentPipeline(repoUrl, repoPath, progressCallback = null) {
  const workflow = createAgentWorkflow();
  const initialState = new AgentState();
  
  initialState.repoUrl = repoUrl;
  initialState.repoPath = repoPath;
  
  try {
    const result = await workflow.invoke(initialState);
    
    if (progressCallback) {
      progressCallback({
        step: result.currentStep,
        progress: result.progress,
        messages: result.messages,
        errors: result.errors
      });
    }
    
    return result;
  } catch (error) {
    console.error('Agent pipeline failed:', error);
    throw error;
  }
}

export { AgentState }; 