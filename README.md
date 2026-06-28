# 🐔 CluckFresh Hub - AI-Powered Chicken Marketplace

> **"Fresh Chicken. Smarter Delivery."**

A full-stack MERN application for local chicken shop owners in Chennai, enabling customers to order fresh chicken online with farm-to-table transparency via QR codes, AI-generated recipes, and subscription-based deliveries.

![CluckFresh Hub](https://img.shields.io/badge/CluckFresh-Hub-green)
![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🚀 Features

### Customer Features
- 🔐 **JWT Authentication** - Secure login/signup with role-based access
- 🛒 **Product Catalog** - Browse chicken products with advanced filters
- 📦 **Smart Ordering** - Add to cart, one-click checkout, multiple payment options
- 🔁 **Subscriptions** - Weekly/monthly recurring orders with pause/resume
- 🤖 **AI Recipes** - Gemini-powered recipe suggestions based on order history
- 💬 **AI Chatbot** - Ollama-powered assistant for product help & FAQs
- 🔍 **QR Traceability** - Scan QR codes to view farm-to-table journey
- 📊 **Order Tracking** - Real-time order status updates
- 👤 **User Profile** - Manage address, preferences, and order history

### Admin Features
- 📈 **Dashboard Analytics** - Revenue, orders, customers, and product insights
- 📦 **Product Management** - CRUD operations, stock management, QR generation
- 🛍️ **Order Management** - View, update status, track deliveries
- 👥 **Customer Analytics** - Retention rate, top customers, purchase patterns
- 📊 **Revenue Reports** - Category-wise sales, daily/weekly trends

### Local Chennai Features
- 🌧️ Monsoon delivery alerts
- 🎉 Festival offers (Pongal, Ramzan specials)
- 🏃 Gym-friendly lean meat section
- 🗣️ Tamil + English language support

## 🧱 Tech Stack

### Frontend
- **React 18** - UI library with functional components + hooks
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Modern responsive UI
- **Axios** - API calls
- **React Hot Toast** - Notifications
- **React Icons** - Icon library
- **Context API** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt.js** - Password hashing
- **QRCode** - QR code generation
- **Helmet** - Security headers
- **Morgan** - HTTP request logger

### Integrations
- **Gemini API** - AI recipe generation (✅ Configured)
- **Razorpay** - Payment processing (✅ Fully Integrated)
- **Ollama AI** - Local AI chatbot (✅ Fully Integrated)
- **Google Maps API** - Delivery optimization (configured, ready to use)

📖 **See [GEMINI_API_GUIDE.md](./GEMINI_API_GUIDE.md) for Gemini AI documentation**  
💳 **See [RAZORPAY_INTEGRATION.md](./RAZORPAY_INTEGRATION.md) for payment documentation**  
🤖 **See [OLLAMA_CHATBOT_GUIDE.md](./OLLAMA_CHATBOT_GUIDE.md) for AI chatbot documentation**

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
cd mathina
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Configure environment variables:
```bash
# Copy the example env file
copy .env.example .env

# Edit .env with your credentials
```

**Environment Variables:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/cluckfresh_hub
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
FRONTEND_URL=http://localhost:5173
```

Seed the database with sample data:
```bash
npm run seed
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup

Open a new terminal:
```bash
cd frontend
npm install
```

Start the development server:
```bash
npm run dev
```

The application will be available at: `http://localhost:5173`

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |
| PUT | `/api/auth/profile` | Update profile | ✅ |
| PUT | `/api/auth/change-password` | Change password | ✅ |

### Products
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/products` | Get all products | ❌ |
| GET | `/api/products/:id` | Get single product | ❌ |
| GET | `/api/products/featured` | Get featured products | ❌ |
| POST | `/api/products` | Create product | ✅ Admin |
| PUT | `/api/products/:id` | Update product | ✅ Admin |
| DELETE | `/api/products/:id` | Delete product | ✅ Admin |
| POST | `/api/products/:id/qr-code` | Generate QR code | ✅ Admin |

### Orders
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/orders` | Create order | ✅ |
| GET | `/api/orders/my-orders` | Get user orders | ✅ |
| GET | `/api/orders/:id` | Get order details | ✅ |
| PUT | `/api/orders/:id/cancel` | Cancel order | ✅ |
| GET | `/api/orders/admin/all` | Get all orders | ✅ Admin |
| PUT | `/api/orders/:id/status` | Update order status | ✅ Admin |

### Subscriptions
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/subscriptions` | Create subscription | ✅ |
| GET | `/api/subscriptions/my-subscriptions` | Get user subscriptions | ✅ |
| PUT | `/api/subscriptions/:id/pause` | Pause subscription | ✅ |
| PUT | `/api/subscriptions/:id/resume` | Resume subscription | ✅ |
| PUT | `/api/subscriptions/:id/cancel` | Cancel subscription | ✅ |

### AI Recipes
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/ai/recipe` | Generate recipe | ✅ |
| GET | `/api/ai/suggestions` | Get meal suggestions | ✅ |

### QR Codes
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/qr/scan/:qrCodeString` | Scan QR code | ❌ |
| GET | `/api/qr` | Get all QR codes | ✅ Admin |
| GET | `/api/qr/analytics` | Get QR analytics | ✅ Admin |

### Chat
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/chat/order/:orderId` | Get/Create chat for order | ✅ |
| POST | `/api/chat/:chatId/message` | Send message | ✅ |
| PUT | `/api/chat/:chatId/read` | Mark as read | ✅ |
| GET | `/api/chat` | Get all chats | ✅ Admin |
| PUT | `/api/chat/:chatId/close` | Close chat | ✅ Admin |

### Dashboard (Admin Only)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/dashboard/stats` | Get dashboard stats | ✅ Admin |
| GET | `/api/dashboard/revenue` | Get revenue analytics | ✅ Admin |
| GET | `/api/dashboard/customers` | Get customer analytics | ✅ Admin |
| GET | `/api/dashboard/products` | Get product analytics | ✅ Admin |

## 👥 User Roles & Credentials

### Admin Account
- **Email:** `MathinaFreshHub@gmail.com`
- **Password:** `Admin@123`

### Customer Account
- **Email:** `customer@example.com`
- **Password:** `Customer@123`

## 📱 Pages & Routes

### Public Pages
- `/` - Home page with featured products
- `/products` - Product listing with filters
- `/products/:id` - Product details
- `/login` - Login page
- `/register` - Registration page
- `/qr-scan` - QR code scanner

### Protected Pages (Customer)
- `/cart` - Shopping cart
- `/checkout` - Checkout page
- `/orders` - Order history
- `/profile` - User profile
- `/subscriptions` - Subscription management
- `/ai-recipes` - AI recipe generator

### Protected Pages (Admin)
- `/admin` - Admin dashboard
- `/admin/products` - Product management
- `/admin/orders` - Order management
- `/admin/analytics` - Analytics dashboard

## 🎨 UI Components

- **ProductCard** - Reusable product display card
- **Navbar** - Responsive navigation with role-based links
- **Footer** - Site footer with links and contact info
- **LoadingSpinner** - Loading indicator
- **ProtectedRoute** - Route protection wrapper

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Protected API routes
- CORS configuration
- Helmet security headers
- Input validation
- Rate limiting ready

## 🚀 Deployment

### Backend (Render/Railway)
1. Push code to GitHub
2. Connect repository to Render/Railway
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Deploy

### MongoDB Atlas
1. Create free cluster at mongodb.com
2. Get connection string
3. Update `MONGODB_URI` in backend `.env`

## 📊 Database Schema

### User
```javascript
{
  name, email, phone, password,
  role: 'customer' | 'admin',
  address: { street, area, city, state, pincode },
  preferences: { language, dietaryPreferences },
  loyaltyPoints
}
```

### Product
```javascript
{
  name, description, category, price, stock,
  weightOptions: [{ weight, price }],
  freshnessTag: 'fresh' | 'frozen',
  halalCertified, organic, antibioticFree,
  farmOrigin: { name, location },
  qrCode, ratings, nutritionInfo
}
```

### Order
```javascript
{
  user, items: [{ product, quantity, price }],
  totalAmount, finalAmount,
  deliveryAddress, deliveryTime,
  orderStatus, paymentInfo,
  tracking: { placed, confirmed, processing, delivered }
}
```

### Subscription
```javascript
{
  user, planType, items, frequency,
  deliveryDay, deliveryTime,
  startDate, nextDeliveryDate,
  status: 'active' | 'paused' | 'cancelled'
}
```

### QRCode
```javascript
{
  product, qrCodeString, qrCodeImage,
  traceabilityData: {
    farmName, farmLocation,
    processingDate, vaccinationDetails,
    qualityCheck
  },
  scanCount
}
```

### Chat
```javascript
{
  user, admin, order,
  messages: [{
    sender: 'user' | 'admin',
    message, timestamp, isRead
  }],
  lastMessage, lastMessageAt, isActive
}
```

## 🧪 Testing

### Backend
```bash
# Test with Postman
# Import collection from /backend/postman_collection.json (if available)
```

### Frontend
```bash
cd frontend
npm run build  # Test production build
```

## 📝 Future Enhancements

- [ ] Socket.io for real-time chat (upgrade from REST API)
- [ ] WhatsApp order notifications
- [ ] Loyalty points redemption
- [ ] Referral program
- [ ] Voice-based ordering
- [ ] Multi-language support (Tamil/English toggle)
- [ ] Push notifications
- [ ] Mobile app (React Native)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

Built with ❤️ for CluckFresh Hub - Chennai's premier chicken marketplace

## 🆘 Support

For issues and questions:
- Create an issue on GitHub
- Email: MathinaFreshHub@gmail.com
- Phone: +91 98765 43210

---

**Happy Shopping! 🐔🛒**
