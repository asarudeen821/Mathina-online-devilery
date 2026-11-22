import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { errorHandler, notFound } from './middleware/error.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Route imports
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import aiRoutes from './modules/ai/ai.routes.js';
import qrRoutes from './routes/qrRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import utilsRoutes from './routes/utilsRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import deliveryRoutes from './routes/deliveryRoutes.js';
import priceScheduleRoutes from './routes/priceScheduleRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import aiDashboardRoutes from './routes/aiDashboardRoutes.js';
import hierarchicalPricingRoutes from './routes/hierarchicalPricingRoutes.js';

// Create and configure Express app (no listen — used by both server.js and Vercel serverless)
const app = express();

// CORS configuration — allow Vercel frontend + local dev + production
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);
app.options('*', cors());

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount all API routes with and without /api prefix for robust serverless compatibility
const mountAllRoutes = (prefix = '') => {
  app.use(`${prefix}/auth`, authRoutes);
  app.use(`${prefix}/products`, productRoutes);
  app.use(`${prefix}/orders`, orderRoutes);
  app.use(`${prefix}/subscriptions`, subscriptionRoutes);
  app.use(`${prefix}/ai`, aiRoutes);
  app.use(`${prefix}/qr`, qrRoutes);
  app.use(`${prefix}/dashboard`, dashboardRoutes);
  app.use(`${prefix}/chat`, chatRoutes);
  app.use(`${prefix}/utils`, utilsRoutes);
  app.use(`${prefix}/payment`, paymentRoutes);
  app.use(`${prefix}/notifications`, notificationRoutes);
  app.use(`${prefix}/feedback`, feedbackRoutes);
  app.use(`${prefix}/delivery`, deliveryRoutes);
  app.use(`${prefix}/price-schedules`, priceScheduleRoutes);
  app.use(`${prefix}/coupons`, couponRoutes);
  app.use(`${prefix}/dashboard/ai`, aiDashboardRoutes);
  app.use(`${prefix}/hierarchical-pricing`, hierarchicalPricingRoutes);
  app.get(`${prefix}/health`, (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Mathina Chicken Center API is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    });
  });
};

mountAllRoutes('/api');
mountAllRoutes('');

// Root API status endpoint
const apiStatusHandler = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Mathina Chicken Center API is running',
    version: '1.0.0',
    status: 'online',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      products: '/api/products',
      orders: '/api/orders',
      subscriptions: '/api/subscriptions',
      ai: '/api/ai',
      qr: '/api/qr',
      dashboard: '/api/dashboard',
      chat: '/api/chat',
      utils: '/api/utils',
      payment: '/api/payment',
    },
  });
};

app.get('/api', apiStatusHandler);

// If frontend/dist is present in the build, serve it statically for all non-API paths
const distPath = path.resolve(__dirname, '../../frontend/dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.url.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // If dist is not present (standalone backend service), respond with API status instead of 404
  app.get('/', apiStatusHandler);
}

// Error handling for unmatched /api routes
app.use(notFound);
app.use(errorHandler);

export default app;
