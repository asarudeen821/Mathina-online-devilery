# 🚀 Mathina FreshHub - Startup Guide

## The errors you saw mean the backend server is NOT running.
## Follow these steps in order:

---

## Step 1 — Start MongoDB
Open a terminal and run:
```
mongod
```
Or if using MongoDB as a Windows service, it may already be running.
Check: open browser → http://localhost:27017 (should show "It looks like you are trying to access MongoDB over HTTP")

---

## Step 2 — Start Backend (Terminal 1)
```
cd C:\Users\mohamed asarudeen\Downloads\mathina\backend
npm install
npm run dev
```
✅ You should see: "Server running on port 5000"
✅ You should see: "MongoDB Connected"

---

## Step 3 — Seed the Database (only first time)
In a NEW terminal:
```
cd C:\Users\mohamed asarudeen\Downloads\mathina\backend
npm run seed
```
✅ This creates all products + admin account

---

## Step 4 — Start Frontend (Terminal 2)
```
cd C:\Users\mohamed asarudeen\Downloads\mathina\frontend
npm install
npm run dev
```
✅ Open browser → http://localhost:5173

---

## Login Credentials
- **Shop Owner:** mathinachicken@gmail.com / mathina
- **Customer:** customer@example.com / Customer@123

---

## Error Diagnosis

| Error | Cause | Fix |
|-------|-------|-----|
| ERR_CONNECTION_REFUSED on :5000 | Backend not running | Run `npm run dev` in backend folder |
| 500 on /api/auth/login | MongoDB not connected OR JWT error | Start MongoDB + backend |
| Network Error on /api/products/featured | Backend not running | Start backend |
| React Router warnings | Future flags | Already fixed in App.jsx |

---

## Quick Check
- Backend health: http://localhost:5000/health
- MongoDB: mongodb://localhost:27017
