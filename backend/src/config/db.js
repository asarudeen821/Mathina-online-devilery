import mongoose from 'mongoose';
import { ensureAdminUser } from '../utils/ensureAdmin.js';

let isConnecting = false;

const connectDB = async () => {
  // If already connected, reuse existing active connection
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (isConnecting) {
    // Wait briefly for in-flight connection
    return new Promise((resolve) => setTimeout(resolve, 300));
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    const errorMsg = 'MONGODB_URI is not defined in environment variables';
    console.error(`❌ Database Configuration Error: ${errorMsg}`);
    if (process.env.VERCEL) {
      throw new Error(errorMsg);
    }
    process.exit(1);
  }

  try {
    isConnecting = true;
    const conn = await mongoose.connect(uri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    isConnecting = false;

    // Safely ensure default admin without blocking or crashing
    try {
      await ensureAdminUser();
    } catch (adminErr) {
      console.warn('⚠️ Admin initialization notice:', adminErr.message);
    }

    return conn;
  } catch (error) {
    isConnecting = false;
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // In Vercel serverless, throw error instead of calling process.exit(1)
    if (process.env.VERCEL) {
      throw error;
    }
    process.exit(1);
  }
};

export default connectDB;
