import { Account, Client, ID } from 'appwrite';

// Appwrite configuration
const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID || 'your-project-id';

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

// Initialize Account service
const account = new Account(client);

export interface User {
  $id: string;
  name: string;
  email: string;
  emailVerification: boolean;
  prefs: Record<string, any>;
}

export class AuthService {
  // Get current user
  static async getCurrentUser(): Promise<User | null> {
    try {
      return await account.get();
    } catch (error) {
      console.log('No active session:', error);
      return null;
    }
  }

  // Login with OAuth (Google)
  static async loginWithGoogle(): Promise<void> {
    try {
      account.createOAuth2Session('google', 
        `${window.location.origin}/dashboard`, // Success URL
        `${window.location.origin}/login`      // Failure URL
      );
    } catch (error) {
      console.error('Google OAuth failed:', error);
      throw error;
    }
  }

  // Login with OAuth (GitHub)
  static async loginWithGitHub(): Promise<void> {
    try {
      account.createOAuth2Session('github', 
        `${window.location.origin}/dashboard`, // Success URL
        `${window.location.origin}/login`      // Failure URL
      );
    } catch (error) {
      console.error('GitHub OAuth failed:', error);
      throw error;
    }
  }

  // Login with email and password
  static async loginWithEmail(email: string, password: string): Promise<User> {
    try {
      await account.createEmailSession(email, password);
      return await account.get();
    } catch (error) {
      console.error('Email login failed:', error);
      throw error;
    }
  }

  // Register with email and password
  static async registerWithEmail(email: string, password: string, name: string): Promise<User> {
    try {
      await account.create(ID.unique(), email, password, name);
      return await this.loginWithEmail(email, password);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  // Logout
  static async logout(): Promise<void> {
    try {
      await account.deleteSession('current');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  // Delete all sessions (logout from all devices)
  static async logoutAll(): Promise<void> {
    try {
      await account.deleteSessions();
    } catch (error) {
      console.error('Logout all failed:', error);
      throw error;
    }
  }

  // Get user preferences
  static async getPreferences(): Promise<Record<string, any>> {
    try {
      const user = await account.get();
      return user.prefs || {};
    } catch (error) {
      console.error('Failed to get preferences:', error);
      return {};
    }
  }

  // Update user preferences
  static async updatePreferences(prefs: Record<string, any>): Promise<User> {
    try {
      return await account.updatePrefs(prefs);
    } catch (error) {
      console.error('Failed to update preferences:', error);
      throw error;
    }
  }
}

export { client, account }; 