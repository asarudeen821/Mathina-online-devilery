import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Load environment variables FIRST before any other imports that need them
dotenv.config();

import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/error.js';

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

// Connect to database
connectDB();

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps, curl)
      if (!origin) return callback(null, true);
      const allowed = new Set([
        process.env.FRONTEND_URL || 'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
        'http://localhost:5176',
        'http://localhost:5177',
      ]);
      return allowed.has(origin) ? callback(null, true) : callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware (development only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CluckFresh Hub API is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/utils', utilsRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/price-schedules', priceScheduleRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/dashboard/ai', aiDashboardRoutes);
app.use('/api/hierarchical-pricing', hierarchicalPricingRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to CluckFresh Hub API',
    version: '1.0.0',
    endpoints: {
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
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🐔 CluckFresh Hub API Server                            ║
║                                                           ║
║   🚀 Server running on port ${PORT}                       ║
║   📍 Environment: ${process.env.NODE_ENV || 'development'}                            ║
║   🗄️  Database: Connected                                 ║
║   🤖 AI Chatbot: OpenAI + Ollama (fallback)               ║
║   💳 Razorpay: Ready                                      ║
║                                                           ║
║   API Endpoints:                                          ║
║   • Auth: /api/auth                                       ║
║   • Products: /api/products                               ║
║   • Orders: /api/orders                                   ║
║   • Subscriptions: /api/subscriptions                     ║
║   • AI Chat: /api/ai/chat                                 ║
║   • AI Recipes: /api/ai/chat/recipe                       ║
║   • QR Codes: /api/qr                                     ║
║   • Dashboard: /api/dashboard                             ║
║   • Chat: /api/chat                                       ║
║   • Utils: /api/utils                                     ║
║   • Payment: /api/payment                                 ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// Handle server errors (e.g., port already in use)
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} is already in use. Please free the port or use a different one.`);
    console.error(`   Run: npx kill-port ${PORT}  (or use the free-port script)\n`);
  } else {
    console.error(`❌ Server error: ${err.message}`);
  }
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  console.error(err.stack);
  server.close(() => process.exit(1));
});

export default app;
