import app from '../backend/src/app.js';
import connectDB from '../backend/src/config/db.js';

let isConnected = false;

// Vercel Serverless entry point
export default async function handler(req, res) {
  // Normalize req.url if rewritten directly to /api/index.js
  if (req.url.startsWith('/api/index.js')) {
    req.url = req.url.replace('/api/index.js', '/api') || '/api';
  }

  // Gracefully initialize or reuse database connection
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (err) {
      console.warn('DB connect notice in serverless handler:', err.message);
    }
  }

  return app(req, res);
}
