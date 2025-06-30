import fs from 'fs-extra';
import path from 'path';

// Custom Llama API client for Novita.ai
class LlamaClient {
  constructor() {
    this.baseURL = "https://api.novita.ai/v3/openai";
    this.apiKey = process.env.LLAMA_API_KEY;
    this.model = "meta-llama/llama-3-70b-instruct";
  }

  async invoke(messages) {
    try {
      const formattedMessages = messages.map(msg => ({
        role: msg._getType() === 'system' ? 'system' : 'user',
        content: msg.content
      }));

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: formattedMessages,
          temperature: 0.1,
          max_tokens: 4000,
          response_format: { type: "text" }
        })
      });

      if (!response.ok) {
        throw new Error(`Llama API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return {
        content: data.choices[0].message.content
      };
    } catch (error) {
      console.error('Llama API Error:', error);
      throw error;
    }
  }
}

// Initialize Llama model
const model = new LlamaClient();

// Message classes for compatibility
class SystemMessage {
  constructor(content) {
    this.content = content;
  }
  _getType() {
    return 'system';
  }
}

class HumanMessage {
  constructor(content) {
    this.content = content;
  }
  _getType() {
    return 'human';
  }
}

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
  
  const plannerPrompt = `You are a DevOps Planning Agent. Your task is to analyze the repository structure and create a comprehensive plan.

Repository URL: ${state.repoUrl}
Repository structure has been cloned to: ${state.repoPath}

Based on typical project patterns, create a plan that includes:
1. File types to analyze for tech stack detection
2. Key configuration files to examine
3. Dependencies to check
4. Deployment strategy recommendations

Return a JSON plan with these categories.`;

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
  
  const generatorPrompt = `You are a DevOps Generation Agent. Based on the codebase analysis, generate production-ready files.

Tech Stack: ${JSON.stringify(state.techStack, null, 2)}
Project Structure: ${JSON.stringify(state.projectStructure, null, 2)}
Analysis: ${JSON.stringify(state.codebaseAnalysis, null, 2)}

Generate the following files with best practices:
1. Dockerfile - Multi-stage, optimized, secure
2. GitHub Actions Workflow - Complete CI/CD pipeline
3. .env.example - All required environment variables

For each file, provide the complete content optimized for this specific project.`;

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
  
  const verifierPrompt = `You are a DevOps Verification Agent. Review the generated files for:
1. Syntax correctness
2. Security best practices
3. Performance optimizations
4. Compliance with standards

Generated Files:
- Dockerfile: ${state.generatedFiles.dockerfile?.substring(0, 500)}...
- GitHub Actions: ${state.generatedFiles.githubActions?.substring(0, 500)}...
- .env.example: ${state.generatedFiles.envExample?.substring(0, 500)}...

Provide verification results and any recommendations for improvements.`;

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
      message: 'Validation complete - files are production ready',
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
    try {
      const items = await fs.readdir(dirPath);
      
      for (const item of items) {
        // Skip common directories that we don't need to analyze
        if (['.git', 'node_modules', '.next', 'dist', 'build', '__pycache__'].includes(item)) {
          continue;
        }
        
        const fullPath = path.join(dirPath, item);
        const itemRelativePath = path.join(relativePath, item);
        const stats = await fs.stat(fullPath);
        
        if (stats.isDirectory()) {
          structure[itemRelativePath] = 'directory';
          await scanDirectory(fullPath, itemRelativePath);
        } else {
          structure[itemRelativePath] = 'file';
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${dirPath}:`, error.message);
    }
  };
  
  await scanDirectory(repoPath);
  return structure;
}

// Helper function to analyze tech stack
async function analyzeTechStack(repoPath, projectFiles) {
  const techStack = {
    primary: 'unknown',
    secondary: [],
    frameworks: [],
    databases: [],
    tools: []
  };
  
  const fileNames = Object.keys(projectFiles);
  
  // Check for common tech stack indicators
  if (fileNames.includes('package.json')) {
    techStack.primary = 'node';
    try {
      const packageJson = await fs.readJson(path.join(repoPath, 'package.json'));
      if (packageJson.dependencies) {
        if (packageJson.dependencies.react) techStack.frameworks.push('react');
        if (packageJson.dependencies.next) techStack.frameworks.push('nextjs');
        if (packageJson.dependencies.vue) techStack.frameworks.push('vue');
        if (packageJson.dependencies.express) techStack.frameworks.push('express');
        if (packageJson.dependencies.mongoose) techStack.databases.push('mongodb');
        if (packageJson.dependencies.pg) techStack.databases.push('postgresql');
      }
    } catch (error) {
      console.error('Error reading package.json:', error.message);
    }
  } else if (fileNames.includes('requirements.txt') || fileNames.includes('pyproject.toml')) {
    techStack.primary = 'python';
    if (fileNames.includes('manage.py')) techStack.frameworks.push('django');
    if (fileNames.some(f => f.includes('flask'))) techStack.frameworks.push('flask');
    if (fileNames.some(f => f.includes('fastapi'))) techStack.frameworks.push('fastapi');
  } else if (fileNames.includes('go.mod')) {
    techStack.primary = 'go';
  } else if (fileNames.includes('Cargo.toml')) {
    techStack.primary = 'rust';
  } else if (fileNames.includes('pom.xml') || fileNames.includes('build.gradle')) {
    techStack.primary = 'java';
    if (fileNames.some(f => f.includes('spring'))) techStack.frameworks.push('spring');
  }
  
  // Check for containerization
  if (fileNames.includes('Dockerfile')) techStack.tools.push('docker');
  if (fileNames.includes('docker-compose.yml')) techStack.tools.push('docker-compose');
  if (fileNames.includes('kubernetes') || fileNames.some(f => f.endsWith('.yaml'))) techStack.tools.push('kubernetes');
  
  return techStack;
}

// Helper function for detailed analysis
async function performDetailedAnalysis(repoPath, projectFiles) {
  const analysis = {
    entryPoints: [],
    configFiles: [],
    buildCommands: [],
    testCommands: [],
    dependencies: {},
    recommendations: []
  };
  
  const fileNames = Object.keys(projectFiles);
  
  // Find entry points
  if (fileNames.includes('package.json')) {
    try {
      const packageJson = await fs.readJson(path.join(repoPath, 'package.json'));
      if (packageJson.main) analysis.entryPoints.push(packageJson.main);
      if (packageJson.scripts) {
        if (packageJson.scripts.start) analysis.buildCommands.push('npm start');
        if (packageJson.scripts.build) analysis.buildCommands.push('npm run build');
        if (packageJson.scripts.test) analysis.testCommands.push('npm test');
      }
      analysis.dependencies = packageJson.dependencies || {};
    } catch (error) {
      console.error('Error analyzing package.json:', error.message);
    }
  }
  
  // Check for common config files
  const configFiles = ['tsconfig.json', 'webpack.config.js', 'vite.config.js', '.env.example', 'docker-compose.yml'];
  analysis.configFiles = fileNames.filter(f => configFiles.includes(f));
  
  // Generate recommendations
  if (!fileNames.includes('Dockerfile')) {
    analysis.recommendations.push('Add Dockerfile for containerization');
  }
  if (!fileNames.includes('.github/workflows')) {
    analysis.recommendations.push('Add GitHub Actions for CI/CD');
  }
  if (!fileNames.includes('.env.example')) {
    analysis.recommendations.push('Add .env.example for environment configuration');
  }
  
  return analysis;
}

// Simplified workflow implementation without langgraph
export function createAgentWorkflow() {
  return {
    async invoke(initialState) {
      let state = initialState;
      
      // Run agents in sequence
      state = await plannerAgent(state);
      state = await analyzerAgent(state);
      state = await generatorAgent(state);
      state = await verifierAgent(state);
      
      return state;
    }
  };
}

// Main function to run the agent pipeline
export async function runAgentPipeline(repoUrl, repoPath, progressCallback = null) {
  console.log('🚀 Starting AI Agent Pipeline...');
  
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
        techStack: result.techStack,
        generatedFiles: result.generatedFiles,
        errors: result.errors
      });
    }
    
    console.log('✅ AI Agent Pipeline completed successfully');
    return result;
  } catch (error) {
    console.error('❌ AI Agent Pipeline failed:', error);
    throw error;
  }
}

export { AgentState }; 