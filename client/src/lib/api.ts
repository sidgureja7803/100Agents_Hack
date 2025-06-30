export interface DevPilotRequest {
  repoUrl: string;
  techStack: string;
  userId: string;
}

export interface DevPilotResponse {
  dockerfile: string;
  githubActions: string;
  envExample: string;
  docs: string;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface ProjectData {
  id?: string;
  name: string;
  repoUrl: string;
  techStack: string;
  status: 'active' | 'archived' | 'pending';
  createdAt?: string;
  updatedAt?: string;
}

export interface AnalyticsData {
  deployments: number;
  successRate: number;
  buildTime: number;
  lastDeployment: string;
}

// Appwrite Configuration
const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const APPWRITE_FUNCTION_ID = import.meta.env.VITE_APPWRITE_FUNCTION_ID;

// Validate required environment variables
if (!APPWRITE_PROJECT_ID || !APPWRITE_FUNCTION_ID) {
  console.error('Missing required environment variables: VITE_APPWRITE_PROJECT_ID and VITE_APPWRITE_FUNCTION_ID must be set');
}

// Appwrite Function URL
const APPWRITE_FUNCTION_URL = `${APPWRITE_ENDPOINT}/functions/${APPWRITE_FUNCTION_ID}/executions`;

export class DevPilotAPI {
  private static async makeRequest(data: DevPilotRequest): Promise<DevPilotResponse> {
    try {
      const response = await fetch(APPWRITE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Appwrite-Project': APPWRITE_PROJECT_ID,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Handle Appwrite function response format
      if (result.responseBody) {
        return JSON.parse(result.responseBody);
      }
      
      return result;
    } catch (error) {
      console.error('API request failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to generate CI/CD setup');
    }
  }

  static async generateCICD(repoUrl: string, techStack: string, userId: string = 'anonymous'): Promise<DevPilotResponse> {
    // Validate inputs
    if (!repoUrl || !techStack) {
      throw new Error('Repository URL and tech stack are required');
    }

    // Validate repo URL format
    const githubUrlPattern = /^https:\/\/github\.com\/[\w\-\.]+\/[\w\-\.]+$/;
    if (!githubUrlPattern.test(repoUrl)) {
      throw new Error('Please enter a valid GitHub repository URL');
    }

    return this.makeRequest({ repoUrl, techStack, userId });
  }
}

export class AuthAPI {
  static async login(data: AuthRequest): Promise<any> {
    try {
      const response = await fetch(`${APPWRITE_FUNCTION_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Appwrite-Project': APPWRITE_PROJECT_ID,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  static async signup(data: AuthRequest): Promise<any> {
    try {
      const response = await fetch(`${APPWRITE_FUNCTION_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Appwrite-Project': APPWRITE_PROJECT_ID,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  }

  static async logout(): Promise<void> {
    try {
      const response = await fetch(`${APPWRITE_FUNCTION_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'X-Appwrite-Project': APPWRITE_PROJECT_ID,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }
}

export class ProjectsAPI {
  static async getProjects(): Promise<ProjectData[]> {
    try {
      const response = await fetch(`${APPWRITE_FUNCTION_URL}/projects`, {
        headers: {
          'X-Appwrite-Project': APPWRITE_PROJECT_ID,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      throw error;
    }
  }

  static async createProject(data: Omit<ProjectData, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProjectData> {
    try {
      const response = await fetch(`${APPWRITE_FUNCTION_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Appwrite-Project': APPWRITE_PROJECT_ID,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    } catch (error) {
      console.error('Failed to create project:', error);
      throw error;
    }
  }

  static async updateProject(id: string, data: Partial<ProjectData>): Promise<ProjectData> {
    try {
      const response = await fetch(`${APPWRITE_FUNCTION_URL}/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Appwrite-Project': APPWRITE_PROJECT_ID,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    } catch (error) {
      console.error('Failed to update project:', error);
      throw error;
    }
  }

  static async deleteProject(id: string): Promise<void> {
    try {
      const response = await fetch(`${APPWRITE_FUNCTION_URL}/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'X-Appwrite-Project': APPWRITE_PROJECT_ID,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    } catch (error) {
      console.error('Failed to delete project:', error);
      throw error;
    }
  }
}

export class AnalyticsAPI {
  static async getProjectAnalytics(projectId: string): Promise<AnalyticsData> {
    try {
      const response = await fetch(`${APPWRITE_FUNCTION_URL}/analytics/projects/${projectId}`, {
        headers: {
          'X-Appwrite-Project': APPWRITE_PROJECT_ID,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    } catch (error) {
      console.error('Failed to fetch project analytics:', error);
      throw error;
    }
  }

  static async getOverallAnalytics(): Promise<{ projects: AnalyticsData[] }> {
    try {
      const response = await fetch(`${APPWRITE_FUNCTION_URL}/analytics/overall`, {
        headers: {
          'X-Appwrite-Project': APPWRITE_PROJECT_ID,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    } catch (error) {
      console.error('Failed to fetch overall analytics:', error);
      throw error;
    }
  }
}

export class GitHubAPI {
  static async connectGitHubAccount(): Promise<void> {
    try {
      const response = await fetch(`${APPWRITE_FUNCTION_URL}/github/connect`, {
        method: 'POST',
        headers: {
          'X-Appwrite-Project': APPWRITE_PROJECT_ID,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    } catch (error) {
      console.error('Failed to connect GitHub account:', error);
      throw error;
    }
  }

  static async disconnectGitHubAccount(): Promise<void> {
    try {
      const response = await fetch(`${APPWRITE_FUNCTION_URL}/github/disconnect`, {
        method: 'POST',
        headers: {
          'X-Appwrite-Project': APPWRITE_PROJECT_ID,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    } catch (error) {
      console.error('Failed to disconnect GitHub account:', error);
      throw error;
    }
  }

  static async getGitHubRepositories(): Promise<Array<{id: string, name: string, url: string}>> {
    try {
      const response = await fetch(`${APPWRITE_FUNCTION_URL}/github/repositories`, {
        headers: {
          'X-Appwrite-Project': APPWRITE_PROJECT_ID,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    } catch (error) {
      console.error('Failed to fetch GitHub repositories:', error);
      throw error;
    }
  }

  static async getGitHubAccountStatus(): Promise<{connected: boolean, username?: string}> {
    try {
      const response = await fetch(`${APPWRITE_FUNCTION_URL}/github/status`, {
        headers: {
          'X-Appwrite-Project': APPWRITE_PROJECT_ID,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    } catch (error) {
      console.error('Failed to get GitHub account status:', error);
      throw error;
    }
  }
} 