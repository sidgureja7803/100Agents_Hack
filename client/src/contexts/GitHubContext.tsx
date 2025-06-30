import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface GitHubUser {
  id: number;
  login: string;
  name: string;
  email: string;
  avatarUrl: string;
}

interface GitHubContextType {
  isConnected: boolean;
  user: GitHubUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  connectGitHub: () => void;
  disconnect: () => void;
  setTokenFromCallback: (token: string) => void;
}

const GitHubContext = createContext<GitHubContextType | undefined>(undefined);

interface GitHubProviderProps {
  children: ReactNode;
}

export const GitHubProvider: React.FC<GitHubProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('github_token');
    if (savedToken) {
      setToken(savedToken);
      validateAndSetUser(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Validate token and set user
  const validateAndSetUser = async (authToken: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('http://localhost:3001/api/github/repositories', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Invalid or expired token');
      }

      const data = await response.json();
      setUser(data.user);
      setIsConnected(true);
    } catch (error) {
      console.error('Token validation failed:', error);
      setError('Authentication failed. Please reconnect.');
      disconnect();
    } finally {
      setIsLoading(false);
    }
  };

  // Initiate GitHub OAuth flow
  const connectGitHub = async () => {
    try {
      setError(null);
      const response = await fetch('http://localhost:3001/auth/github');
      
      if (!response.ok) {
        throw new Error('Failed to initiate GitHub authentication');
      }

      const data = await response.json();
      
      // Open OAuth URL in a popup or redirect
      window.location.href = data.authUrl;
    } catch (error) {
      console.error('GitHub connection error:', error);
      setError('Failed to connect to GitHub. Please try again.');
    }
  };

  // Set token from OAuth callback
  const setTokenFromCallback = (authToken: string) => {
    setToken(authToken);
    localStorage.setItem('github_token', authToken);
    validateAndSetUser(authToken);
  };

  // Disconnect and clear all data
  const disconnect = () => {
    setToken(null);
    setUser(null);
    setIsConnected(false);
    setError(null);
    localStorage.removeItem('github_token');
  };

  const value: GitHubContextType = {
    isConnected,
    user,
    token,
    isLoading,
    error,
    connectGitHub,
    disconnect,
    setTokenFromCallback
  };

  return (
    <GitHubContext.Provider value={value}>
      {children}
    </GitHubContext.Provider>
  );
};

export const useGitHub = (): GitHubContextType => {
  const context = useContext(GitHubContext);
  if (context === undefined) {
    throw new Error('useGitHub must be used within a GitHubProvider');
  }
  return context;
};

export default GitHubProvider; 