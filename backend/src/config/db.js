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
    console.warn('⚠️ MONGODB_URI is not defined in environment. Running in resilient mode.');
    return null;
  }

  try {
    isConnecting = true;
    const conn = await mongoose.connect(uri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
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
    console.warn(`⚠️ MongoDB Connection Notice: ${error.message}`);
    return null;
  }
};

export default connectDB;
