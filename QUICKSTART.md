# CluckFresh Hub - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### Step 2: Configure Environment

**Backend (.env):**
```bash
cd backend
# The .env file is already created with default values
# Update these if needed:
# - MONGODB_URI (if using MongoDB Atlas)
# - GEMINI_API_KEY (for AI recipes)
# - RAZORPAY keys (for payments)
```

### Step 3: Seed Database

```bash
cd backend
npm run seed
```

This creates:
- 12 sample products
- 1 admin user (MathinaFreshHub@gmail.com / Admin@123)
- 1 customer user (customer@example.com / Customer@123)

### Step 4: Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs on: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on: http://localhost:5173

### Step 5: Access the Application

1. Open browser: http://localhost:5173
2. Login as customer or browse products
3. Admin can access: http://localhost:5173/admin

## 📋 Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | MathinaFreshHub@gmail.com | Admin@123 |
| Customer | customer@example.com | Customer@123 |

## 🎯 Key Features to Try

### Customer
1. Browse products on home page
2. Add items to cart
3. Checkout with COD
4. View order history
5. Generate AI recipes
6. Scan QR codes for traceability
7. Create subscriptions

### Admin
1. Login with admin credentials
2. View dashboard analytics
3. Manage products (add/edit/delete)
4. Generate QR codes for products
5. Manage orders (update status)
6. View customer analytics

## 🔧 Troubleshooting

### Backend won't start
- Ensure MongoDB is running: `mongod`
- Check port 5000 is not in use
- Verify .env file exists

### Frontend won't start
- Ensure Node.js v16+ is installed
- Clear node_modules: `rm -rf node_modules && npm install`
- Check port 5173 is not in use

### Database connection error
- Update MONGODB_URI in .env
- For local: `mongodb://localhost:27017/cluckfresh_hub`
- For Atlas: Use your connection string

### AI recipes not working
- Get free Gemini API key from Google AI Studio
- Add to backend/.env: `GEMINI_API_KEY=your_key`
- Fallback recipes work without API key

## 📱 Mobile Testing

The app is fully responsive. Test on mobile:
1. Find your computer's IP address
2. Access: `http://YOUR_IP:5173`
3. Or use browser DevTools mobile view

## 🎨 Customization

### Change Colors
Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  primary: { /* your colors */ },
  accent: { /* your colors */ },
}
```

### Add Products
1. Login as admin
2. Go to Admin Dashboard
3. Click "Manage Products"
4. Add new products with images

### Enable Payments
1. Sign up at razorpay.com
2. Get test API keys
3. Update backend/.env:
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`

## 📊 Project Structure

```
mathina/
├── backend/
│   ├── src/
│   │   ├── config/       # Database config
│   │   ├── controllers/  # Business logic
│   │   ├── middleware/   # Auth, error handling
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # API routes
│   │   ├── utils/        # Seed data, helpers
│   │   └── server.js     # Entry point
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── context/      # Auth, Cart context
│   │   ├── pages/        # Page components
│   │   │   ├── admin/    # Admin pages
│   │   ├── utils/        # API utilities
│   │   ├── App.jsx       # Main app
│   │   └── main.jsx      # Entry point
│   ├── index.html
│   └── package.json
│
└── README.md
```

## 🎉 You're Ready!

Start exploring CluckFresh Hub. For more details, see the full README.md.

**Happy Coding! 🚀**
