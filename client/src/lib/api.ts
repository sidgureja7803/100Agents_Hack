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

// Appwrite Function URL - Replace with your actual function URL
const APPWRITE_FUNCTION_URL = import.meta.env.VITE_APPWRITE_FUNCTION_URL || 
  'https://cloud.appwrite.io/v1/functions/your-function-id/executions';

const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID || 'your-project-id';

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