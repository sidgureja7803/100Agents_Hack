import { devPilotAI } from './index.js';
import { Client, Account, ID, Storage, Databases, Query } from 'node-appwrite';

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
    this.storage = new Storage(this.client);
    this.databases = new Databases(this.client);
    
    this.bucketId = process.env.APPWRITE_STORAGE_BUCKET_ID;
    this.databaseId = process.env.APPWRITE_DATABASE_ID;
    this.fileCollection = process.env.APPWRITE_FILES_COLLECTION_ID;
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
  
  /**
   * Save a generated file to Appwrite Storage
   * @param {string} userId - Appwrite User ID
   * @param {string} content - File content
   * @param {string} name - File name (e.g., Dockerfile)
   * @param {string} type - File type (e.g., dockerfile, github_actions, env)
   * @param {string} repoUrl - Repository URL this file was generated for
   * @returns {Object} Created file record
   */
  async saveGeneratedFile(userId, content, name, type, repoUrl) {
    try {
      // First, upload the file to storage
      const file = await this.storage.createFile(
        this.bucketId,
        ID.unique(),
        new Blob([content], { type: 'text/plain' }),
        name
      );
      
      // Then create a database record with metadata
      const record = await this.databases.createDocument(
        this.databaseId,
        this.fileCollection,
        ID.unique(),
        {
          userId,
          fileId: file.$id,
          name,
          type,
          repoUrl,
          createdAt: new Date().toISOString()
        }
      );
      
      return {
        success: true,
        fileId: file.$id,
        recordId: record.$id,
        name,
        type
      };
    } catch (error) {
      console.error('Appwrite saveGeneratedFile error:', error);
      throw new Error(`Failed to save file: ${error.message}`);
    }
  }
  
  /**
   * Get saved files for a user
   * @param {string} userId - Appwrite User ID
   * @param {number} limit - Number of files to fetch
   * @returns {Array} List of saved files
   */
  async getSavedFiles(userId, limit = 50) {
    try {
      const records = await this.databases.listDocuments(
        this.databaseId,
        this.fileCollection,
        [
          Query.equal('userId', userId),
          Query.orderDesc('createdAt'),
          Query.limit(limit)
        ]
      );
      
      return records.documents;
    } catch (error) {
      console.error('Appwrite getSavedFiles error:', error);
      throw new Error(`Failed to get saved files: ${error.message}`);
    }
  }
  
  /**
   * Get a file's download URL
   * @param {string} fileId - Appwrite Storage File ID
   * @returns {string} File download URL
   */
  async getFileDownloadUrl(fileId) {
    try {
      const url = await this.storage.getFileDownload(this.bucketId, fileId);
      return url;
    } catch (error) {
      console.error('Appwrite getFileDownloadUrl error:', error);
      throw new Error(`Failed to get file download URL: ${error.message}`);
    }
  }
}

const appwriteService = new AppwriteService();
export default appwriteService;

// Appwrite Cloud Functions export - commented out to avoid duplicate default exports
// For Appwrite Functions deployment, uncomment this and comment out the export above
/*
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
*/