import { io, Socket } from 'socket.io-client';

// Types for the agent system
export interface AgentSession {
  sessionId: string;
  status: 'cloning' | 'cloned' | 'analyzing' | 'completed' | 'failed';
  repoUrl: string;
  repoName: string;
  createdAt: string;
  clonedAt?: string;
  analysisStartedAt?: string;
  completedAt?: string;
  error?: string;
}

export interface AgentProgress {
  sessionId: string;
  step: string;
  progress: number;
  status: string;
  messages?: Array<{
    agent: string;
    message: string;
    timestamp: string;
  }>;
  errors?: string[];
  techStack?: any;
  generatedFiles?: string[];
}

export interface AgentResult {
  files: {
    dockerfile: string;
    githubActions: string;
    envExample: string;
  };
  techStack: {
    primary: string;
    frontend: string[];
    backend: string[];
    languages: string[];
    frameworks: string[];
  };
  codebaseAnalysis: {
    fileCount: number;
    directories: number;
    totalSize: number;
    hasTests: boolean;
    hasDocumentation: boolean;
    hasCICD: boolean;
  };
  verificationResults: string;
  metadata: {
    repoUrl: string;
    repoName: string;
    completedAt: string;
  };
}

class AgentAPIService {
  private socket: Socket | null = null;
  private baseUrl: string;
  
  constructor() {
    this.baseUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';
  }

  // Initialize WebSocket connection
  initializeSocket(onProgress?: (progress: AgentProgress) => void): Socket {
    if (!this.socket) {
      this.socket = io(this.baseUrl);
      
      this.socket.on('connect', () => {
        console.log('🔗 Connected to AI Agent server');
      });
      
      this.socket.on('disconnect', () => {
        console.log('❌ Disconnected from AI Agent server');
      });
      
      if (onProgress) {
        this.socket.on('progress', onProgress);
      }
    }
    
    return this.socket;
  }

  // Disconnect WebSocket
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Clone repository
  async cloneRepository(repoUrl: string, authToken?: string): Promise<{ sessionId: string; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/clone-repo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ repoUrl, authToken }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to clone repository');
      }

      return await response.json();
    } catch (error) {
      console.error('Clone repository error:', error);
      throw error;
    }
  }

  // Analyze repository with AI agents
  async analyzeRepository(sessionId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Analysis failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Analyze repository error:', error);
      throw error;
    }
  }

  // Get generated files
  async getGeneratedFiles(sessionId: string): Promise<AgentResult> {
    try {
      const response = await fetch(`${this.baseUrl}/api/files/${sessionId}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to retrieve files');
      }

      return await response.json();
    } catch (error) {
      console.error('Get files error:', error);
      throw error;
    }
  }

  // Get session status
  async getSessionStatus(sessionId: string): Promise<AgentSession> {
    try {
      const response = await fetch(`${this.baseUrl}/api/status/${sessionId}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to get status');
      }

      return await response.json();
    } catch (error) {
      console.error('Get status error:', error);
      throw error;
    }
  }

  // List all active sessions
  async getSessions(): Promise<{ sessions: AgentSession[] }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/sessions`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to get sessions');
      }

      return await response.json();
    } catch (error) {
      console.error('Get sessions error:', error);
      throw error;
    }
  }

  // Complete workflow: clone + analyze
  async runCompleteWorkflow(
    repoUrl: string,
    authToken?: string,
    onProgress?: (progress: AgentProgress) => void
  ): Promise<AgentResult> {
    // Initialize socket if progress callback provided
    if (onProgress) {
      this.initializeSocket(onProgress);
    }

    try {
      // Step 1: Clone repository
      const cloneResult = await this.cloneRepository(repoUrl, authToken);
      
      // Step 2: Analyze repository
      const analysisResult = await this.analyzeRepository(cloneResult.sessionId);
      
      // Step 3: Get final results
      const finalResult = await this.getGeneratedFiles(cloneResult.sessionId);
      
      return finalResult;
    } catch (error) {
      console.error('Complete workflow error:', error);
      throw error;
    }
  }

  // Enhanced DevPilot endpoint with agent support
  async generateWithAgents(
    repoUrl: string,
    techStack?: string,
    userId?: string
  ): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/devpilot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          repoUrl, 
          techStack, 
          userId, 
          useAgents: true 
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Generation failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Generate with agents error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const AgentAPI = new AgentAPIService();

// Helper function to format progress messages
export function formatProgressMessage(progress: AgentProgress): string {
  const statusEmojis = {
    cloning: '📂',
    cloned: '✅',
    analyzing: '🔍',
    completed: '🎉',
    failed: '❌'
  };

  const emoji = statusEmojis[progress.status as keyof typeof statusEmojis] || '⏳';
  return `${emoji} ${progress.step}`;
}

// Helper function to get progress color
export function getProgressColor(status: string): string {
  const statusColors = {
    cloning: 'bg-blue-500',
    cloned: 'bg-green-500',
    analyzing: 'bg-yellow-500',
    completed: 'bg-green-600',
    failed: 'bg-red-500'
  };

  return statusColors[status as keyof typeof statusColors] || 'bg-gray-500';
}

// Helper function to validate GitHub URL
export function validateGitHubUrl(url: string): boolean {
  const githubUrlPattern = /^https:\/\/github\.com\/[\w\-\.]+\/[\w\-\.]+(?:\.git)?$/;
  return githubUrlPattern.test(url);
} 