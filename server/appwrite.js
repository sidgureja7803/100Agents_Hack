import { devPilotAI } from './index.js';

/**
 * Appwrite Cloud Functions compatible wrapper
 * This file provides the correct function signature for Appwrite deployment
 */

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