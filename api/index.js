import mongoose from 'mongoose';

// Set environment variables for serverless (these come from Vercel Environment Variables dashboard)
// dotenv is not needed on Vercel — env vars are injected automatically

// Import the shared Express app and DB connector
import app from '../backend/src/app.js';
import connectDB from '../backend/src/config/db.js';

// Reuse MongoDB connection across warm serverless invocations
let isConnected = false;

const ensureDbConnected = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }
  try {
    await connectDB();
    isConnected = true;
  } catch (error) {
    console.error('MongoDB connection error in serverless:', error.message);
    isConnected = false;
    throw error;
  }
};

// Vercel Serverless handler — wraps Express app
export default async function handler(req, res) {
  // Normalize req.url so Express router always sees correct route
  if (req.query && req.query.path) {
    const subPath = Array.isArray(req.query.path) ? req.query.path.join('/') : req.query.path;
    if (!req.url.startsWith(`/api/${subPath}`) && !req.url.startsWith(`/${subPath}`)) {
      const queryIdx = req.url.indexOf('?');
      const queryPart = queryIdx !== -1 ? req.url.slice(queryIdx) : '';
      req.url = `/api/${subPath}${queryPart}`;
    }
  }

  // If req.url points to serverless file path (e.g., /api/index.js or /api/[...path]), normalize to root /api
  if (req.url.startsWith('/api/index.js')) {
    req.url = req.url.replace('/api/index.js', '/api') || '/api';
  } else if (req.url.startsWith('/api/[...path]')) {
    req.url = req.url.replace('/api/[...path]', '/api') || '/api';
  }

  // Respond immediately to CORS preflight OPTIONS without blocking on DB
  if (req.method === 'OPTIONS') {
    return new Promise((resolve) => {
      res.on('finish', resolve);
      res.on('close', resolve);
      try {
        app(req, res);
      } catch (err) {
        resolve();
      }
    });
  }

  try {
    await ensureDbConnected();
  } catch (error) {
    return res.status(503).json({
      success: false,
      message: 'Database connection failed. Please check MongoDB Atlas configuration.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }

  // Delegate to Express and ensure the serverless runtime holds until response completes
  return new Promise((resolve) => {
    res.on('finish', resolve);
    res.on('close', resolve);
    try {
      app(req, res);
    } catch (err) {
      console.error('Express execution error:', err);
      if (!res.headersSent) {
        res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
      }
      resolve();
    }
  });
}
