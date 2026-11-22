import app from '../backend/src/app.js';
import connectDB from '../backend/src/config/db.js';

// Asynchronously connect or reuse database connection
connectDB().catch((err) => {
  console.warn('MongoDB connection notice in serverless:', err.message);
});

// Vercel Serverless entry point
export default function handler(req, res) {
  // Normalize req.url if rewritten directly to /api/index.js
  if (req.url.startsWith('/api/index.js')) {
    req.url = req.url.replace('/api/index.js', '/api') || '/api';
  }
  return app(req, res);
}
