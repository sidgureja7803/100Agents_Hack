import { devPilotAI } from './index.js';
import { Client, Account, ID } from 'node-appwrite';

/**
 * Appwrite Cloud Functions compatible wrapper
 * This file provides the correct function signature for Appwrite deployment
 */

class AppwriteService {
  constructor() {
    this.client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
      .setProject(process.env.APPWRITE_PROJECT_ID);
    
    this.account = new Account(this.client);
  }

  async createUser(email, password) {
    try {
      const user = await this.account.create(
        ID.unique(),
        email,
        password,
        email.split('@')[0] // Use part before @ as name
      );
      return user;
    } catch (error) {
      console.error('Appwrite createUser error:', error);
      throw new Error(error.message);
    }
  }

  async createSession(email, password) {
    try {
      const session = await this.account.createEmailSession(email, password);
      return session;
    } catch (error) {
      console.error('Appwrite createSession error:', error);
      throw new Error('Invalid credentials');
    }
  }

  async deleteCurrentSession() {
    try {
      await this.account.deleteSession('current');
    } catch (error) {
      console.error('Appwrite deleteSession error:', error);
      throw new Error('Failed to delete session');
    }
  }
}

const appwriteService = new AppwriteService();
export default appwriteService;

export default async ({ req, res, log, error }) => {
  try {
    // Log incoming request
    log('DevPilotAI function invoked');
    log(`Request method: ${req.method}`);
    log(`Request body: ${JSON.stringify(req.body)}`);

    // Validate request method
    if (req.method !== 'POST') {
      return res.json({
        error: 'Method not allowed. Use POST.',
        statusCode: 405
      }, 405);
    }

    // Call the main function
    const result = await devPilotAI(req, res);
    
    log('DevPilotAI function completed successfully');
    return result;

  } catch (err) {
    error('DevPilotAI function error:', err);
    
    return res.json({
      error: 'Internal server error',
      message: err.message,
      statusCode: 500
    }, 500);
  }
}; 