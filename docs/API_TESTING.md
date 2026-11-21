# 🧪 CluckFresh Hub - API Testing Guide

## Quick Test with cURL

### 1. Health Check
```bash
curl http://localhost:5000/health
```

### 2. Register New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "9876543210",
    "password": "Test@123",
    "address": {
      "street": "123 Main St",
      "area": "T Nagar",
      "city": "Chennai",
      "state": "Tamil Nadu",
      "pincode": "600017"
    }
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "Customer@123"
  }'
```

Save the token from response for authenticated requests.

### 4. Get All Products
```bash
curl http://localhost:5000/api/products
```

### 5. Get Featured Products
```bash
curl http://localhost:5000/api/products/featured
```

### 6. Get Product by ID
```bash
curl http://localhost:5000/api/products/PRODUCT_ID
```

### 7. Create Order (Authenticated)
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "items": [
      {
        "product": "PRODUCT_ID",
        "quantity": 2,
        "weight": 500
      }
    ],
    "deliveryAddress": {
      "street": "123 Main St",
      "area": "T Nagar",
      "city": "Chennai",
      "state": "Tamil Nadu",
      "pincode": "600017",
      "phone": "9876543210"
    },
    "deliveryTime": "morning",
    "paymentMethod": "cod"
  }'
```

### 8. Get My Orders (Authenticated)
```bash
curl http://localhost:5000/api/orders/my-orders \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 9. Create Subscription (Authenticated)
```bash
curl -X POST http://localhost:5000/api/subscriptions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "planType": "weekly",
    "items": [
      {
        "product": "PRODUCT_ID",
        "quantity": 1,
        "price": 280
      }
    ],
    "frequency": "every-week",
    "deliveryDay": "monday",
    "deliveryTime": "morning",
    "startDate": "2024-01-01"
  }'
```

### 10. Generate AI Recipe (Authenticated)
```bash
curl -X POST http://localhost:5000/api/ai/recipe \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "dishType": "Biryani",
    "preferences": "Spicy"
  }'
```

### 11. Scan QR Code
```bash
curl http://localhost:5000/api/qr/scan/CLUCKFRESH-PRODUCT_ID-TIMESTAMP
```

### 12. Get Dashboard Stats (Admin)
```bash
curl http://localhost:5000/api/dashboard/stats \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

## Postman Collection

Import this JSON into Postman for easy testing:

```json
{
  "info": {
    "name": "CluckFresh Hub API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "url": "http://localhost:5000/api/auth/register",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Test User\",\n  \"email\": \"test@example.com\",\n  \"phone\": \"9876543210\",\n  \"password\": \"Test@123\"\n}"
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "url": "http://localhost:5000/api/auth/login",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"customer@example.com\",\n  \"password\": \"Customer@123\"\n}"
            }
          }
        }
      ]
    },
    {
      "name": "Products",
      "item": [
        {
          "name": "Get All Products",
          "request": {
            "method": "GET",
            "url": "http://localhost:5000/api/products"
          }
        },
        {
          "name": "Get Featured Products",
          "request": {
            "method": "GET",
            "url": "http://localhost:5000/api/products/featured"
          }
        }
      ]
    }
  ]
}
```

## Frontend Testing Checklist

### Customer Flow
- [ ] Register new account
- [ ] Login with credentials
- [ ] Browse products
- [ ] Filter products by category
- [ ] Search products
- [ ] View product details
- [ ] Add to cart
- [ ] Update cart quantity
- [ ] Checkout
- [ ] View order history
- [ ] Create subscription
- [ ] Generate AI recipe
- [ ] Scan QR code
- [ ] Update profile

### Admin Flow
- [ ] Login as admin
- [ ] View dashboard
- [ ] View analytics
- [ ] Add new product
- [ ] Edit product
- [ ] Delete product
- [ ] Generate QR code for product
- [ ] View all orders
- [ ] Update order status
- [ ] View customer analytics
- [ ] Manage chats

## Common Issues & Solutions

### Issue: Cannot connect to MongoDB
**Solution:**
```bash
# Start MongoDB locally
mongod

# Or use MongoDB Atlas connection string in .env
```

### Issue: Token expired
**Solution:** Login again to get new token

### Issue: Port 5000 already in use
**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Change PORT in backend/.env
```

### Issue: AI recipes not working
**Solution:**
- Get free Gemini API key from https://makersuite.google.com/app/apikey
- Add to backend/.env: `GEMINI_API_KEY=your_key`
- Fallback recipes work without API key

## Performance Testing

### Load Test with Apache Bench
```bash
# Test products endpoint
ab -n 1000 -c 10 http://localhost:5000/api/products

# Test with authentication
ab -n 1000 -c 10 -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/orders/my-orders
```

## Security Testing

### Test Protected Routes
```bash
# Should fail without token
curl http://localhost:5000/api/orders/my-orders

# Should succeed with token
curl http://localhost:5000/api/orders/my-orders \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Admin Routes
```bash
# Customer token should fail
curl http://localhost:5000/api/dashboard/stats \
  -H "Authorization: Bearer CUSTOMER_TOKEN"

# Admin token should succeed
curl http://localhost:5000/api/dashboard/stats \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

## Happy Testing! 🎉
