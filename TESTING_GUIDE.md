# 🧪 Quick Testing Guide - After Bug Fixes

**Purpose:** Verify all bug fixes are working correctly  
**Time Required:** 15-20 minutes  
**Status:** Ready to test

---

## 🚀 STEP 1: Setup & Start Servers

### Backend Setup
```bash
# Open Terminal 1
cd backend

# Install dependencies (if not done)
npm install

# Seed database with fixed data
npm run seed

# Expected output:
# ✅ Inserted 20 products
# ✅ Created shop owner account
#    Email: mathinachicken@gmail.com
#    Password: mathina
# ✅ Created sample customer
# 🎉 Database seeded successfully!

# Start backend server
npm run dev

# Expected output:
# ✅ MongoDB Connected: localhost
# 🚀 Server running on port 5000
```

### Frontend Setup
```bash
# Open Terminal 2
cd frontend

# Install dependencies (if not done)
npm install

# Start frontend server
npm run dev

# Expected output:
# ➜  Local:   http://localhost:5173/
```

---

## ✅ STEP 2: Test Critical Fixes

### Test 1: Admin Login (AuthContext Fix)
**What we're testing:** Fixed API integration in AuthContext

1. Open browser: `http://localhost:5173`
2. Click "Login" button
3. Enter credentials:
   - Email: `mathinachicken@gmail.com`
   - Password: `mathina`
4. Click "Login"

**Expected Result:**
- ✅ Login successful
- ✅ Redirected to home page
- ✅ "Welcome back, Shajan A.J.!" toast message
- ✅ Admin menu visible in navbar

**If it fails:**
- Check backend is running on port 5000
- Check frontend `.env` has `VITE_API_URL=http://localhost:5000/api`
- Check browser console for errors

---

### Test 2: Customer Registration (AuthContext Fix)
**What we're testing:** Fixed API integration for registration

1. Logout if logged in
2. Click "Register" button
3. Fill form:
   - Name: `Test User`
   - Email: `test@example.com`
   - Phone: `9876543210`
   - Password: `Test@123`
   - Confirm Password: `Test@123`
4. Click "Register"

**Expected Result:**
- ✅ Registration successful
- ✅ Automatically logged in
- ✅ "Registration successful!" toast message
- ✅ Redirected to home page

---

### Test 3: Checkout Default City (City Fix)
**What we're testing:** Default city changed from Cuddalore to Chennai

1. Login as customer (test@example.com / Test@123)
2. Add any product to cart
3. Go to cart and click "Proceed to Checkout"
4. Check the "City" field in delivery address

**Expected Result:**
- ✅ City field shows "Chennai" (not Cuddalore)

---

### Test 4: JWT Secret Validation (Security Fix)
**What we're testing:** JWT secret is required, no fallback

1. Stop backend server (Ctrl+C)
2. Edit `backend/.env` and comment out JWT_SECRET:
   ```env
   # JWT_SECRET=cluckfresh_super_secret_jwt_key_2024_production_ready
   ```
3. Try to start backend: `npm run dev`

**Expected Result:**
- ❌ Server should fail to start OR
- ❌ Login should fail with error: "JWT_SECRET is not configured"

4. Uncomment JWT_SECRET and restart server

---

### Test 5: Database Performance (Index Fix)
**What we're testing:** Queries are faster with indexes

1. Open MongoDB Compass or mongo shell
2. Connect to: `mongodb://localhost:27017/cluckfresh_hub`
3. Check indexes:
   ```javascript
   // In mongo shell:
   db.users.getIndexes()
   db.products.getIndexes()
   db.orders.getIndexes()
   ```

**Expected Result:**
- ✅ Users collection has indexes on: email, role, createdAt
- ✅ Products collection has indexes on: name, category, isFeatured, price, ratings
- ✅ Orders collection has indexes on: user, orderStatus, paymentInfo.status

---

## 🎯 STEP 3: Feature Testing

### Test Product Browsing
1. Go to "Products" page
2. Try filters:
   - Category: Chicken Cuts
   - Price range: 200-300
   - Sort by: Price Low to High

**Expected Result:**
- ✅ Products load quickly (< 1 second)
- ✅ Filters work correctly
- ✅ Images display properly

---

### Test Cart & Checkout Flow
1. Add 2-3 products to cart
2. Go to cart
3. Update quantities
4. Click "Proceed to Checkout"
5. Fill delivery address (should default to Chennai)
6. Select delivery time: Morning
7. Select payment: Cash on Delivery
8. Click "Place Order"

**Expected Result:**
- ✅ Order created successfully
- ✅ Redirected to orders page
- ✅ Order shows in "My Orders"
- ✅ Stock reduced for products

---

### Test AI Chatbot
1. Click the chat widget (bottom right)
2. Try these messages:
   - "Hello"
   - "Show me chicken breast"
   - "What's the price of wings?"
   - "Track my order"

**Expected Result:**
- ✅ Bot responds (using Gemini or Ollama)
- ✅ Responses are relevant
- ✅ No errors in console

---

### Test Admin Dashboard
1. Login as admin (mathinachicken@gmail.com / mathina)
2. Go to Admin Dashboard
3. Check:
   - Total orders count
   - Revenue stats
   - Recent orders list
   - Product inventory

**Expected Result:**
- ✅ Dashboard loads quickly
- ✅ Stats are accurate
- ✅ Charts display correctly

---

## 🔍 STEP 4: Verify Fixes in Code

### Check 1: AuthContext Uses API Instance
```bash
# Open file
code frontend/src/context/AuthContext.jsx

# Verify line 1-3:
import api, { authAPI } from '../utils/api';

# Verify login function uses:
const { data } = await authAPI.login({ email, password });
```

**Expected:** ✅ No direct axios imports, uses api instance

---

### Check 2: Checkout Default City
```bash
# Open file
code frontend/src/pages/Checkout.jsx

# Find line ~16:
city: user?.address?.city || 'Chennai',
```

**Expected:** ✅ Default is 'Chennai', not 'Cuddalore'

---

### Check 3: JWT Secret Validation
```bash
# Open file
code backend/src/controllers/authController.js

# Find generateToken function:
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not configured...');
}
```

**Expected:** ✅ No fallback secret, throws error if missing

---

### Check 4: Seed Data Password
```bash
# Open file
code backend/src/utils/seedData.js

# Find console.log around line 580:
console.log(`Admin: ${adminUser.email} / ${process.env.ADMIN_PASSWORD || 'mathina'}`);
```

**Expected:** ✅ Shows 'mathina', not 'Admin@123'

---

### Check 5: Database Indexes
```bash
# Open files and verify indexes exist:
code backend/src/models/User.js
code backend/src/models/Product.js
code backend/src/models/Order.js

# Look for lines like:
userSchema.index({ email: 1 });
productSchema.index({ category: 1, freshnessTag: 1 });
orderSchema.index({ user: 1, orderStatus: 1 });
```

**Expected:** ✅ Multiple indexes defined in each model

---

## 📊 STEP 5: Performance Testing

### Test Query Speed
```javascript
// In MongoDB Compass or mongo shell:

// Test 1: Find user by email (should use index)
db.users.find({ email: "mathinachicken@gmail.com" }).explain("executionStats")
// Check: executionStats.totalDocsExamined should be 1

// Test 2: Find products by category (should use index)
db.products.find({ category: "chicken-cuts" }).explain("executionStats")
// Check: Should use index, not COLLSCAN

// Test 3: Find orders by user (should use index)
db.orders.find({ user: ObjectId("...") }).explain("executionStats")
// Check: Should use index on user field
```

**Expected Result:**
- ✅ All queries use indexes (not COLLSCAN)
- ✅ totalDocsExamined is minimal
- ✅ executionTimeMillis < 10ms

---

## 🎉 SUCCESS CRITERIA

### All Tests Pass If:
- ✅ Admin login works with 'mathina' password
- ✅ Customer registration works
- ✅ Checkout shows Chennai as default city
- ✅ JWT secret is required (no fallback)
- ✅ Database indexes are created
- ✅ All features work correctly
- ✅ No console errors
- ✅ API calls use correct baseURL

---

## 🐛 Troubleshooting

### Issue: Login fails with 401
**Solution:**
- Clear localStorage: `localStorage.clear()`
- Check backend is running
- Verify credentials: mathinachicken@gmail.com / mathina

### Issue: API calls fail with CORS error
**Solution:**
- Check backend CORS config in `server.js`
- Verify FRONTEND_URL in backend `.env`
- Restart backend server

### Issue: Products not loading
**Solution:**
- Run seed script: `npm run seed`
- Check MongoDB is running
- Verify connection string in `.env`

### Issue: Chatbot not responding
**Solution:**
- Check Gemini API key in backend `.env`
- Ollama should work as fallback
- Check backend logs for AI errors

### Issue: Checkout fails
**Solution:**
- Ensure user is logged in
- Check cart has items
- Verify order creation in backend logs

---

## 📝 Test Results Template

```
# Test Results - [Date]

## Critical Fixes
- [ ] Admin Login (AuthContext) - PASS/FAIL
- [ ] Customer Registration - PASS/FAIL
- [ ] Checkout Default City - PASS/FAIL
- [ ] JWT Secret Validation - PASS/FAIL
- [ ] Database Indexes - PASS/FAIL

## Feature Tests
- [ ] Product Browsing - PASS/FAIL
- [ ] Cart & Checkout - PASS/FAIL
- [ ] AI Chatbot - PASS/FAIL
- [ ] Admin Dashboard - PASS/FAIL

## Performance Tests
- [ ] Query Speed - PASS/FAIL
- [ ] Index Usage - PASS/FAIL

## Overall Status: PASS/FAIL

Notes:
[Add any issues or observations here]
```

---

## 🎯 Next Steps After Testing

### If All Tests Pass:
1. ✅ Configure Razorpay API keys
2. ✅ Test payment integration
3. ✅ Deploy to staging
4. ✅ Perform load testing

### If Tests Fail:
1. ❌ Check error messages
2. ❌ Review console logs
3. ❌ Verify environment variables
4. ❌ Re-run seed script
5. ❌ Contact support if needed

---

**Happy Testing! 🚀**

**Support:** MathinaFreshHub@gmail.com | +91 7708032726
