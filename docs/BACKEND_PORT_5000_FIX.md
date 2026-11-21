# Backend Port 5000 Already In Use - Fixed

## ✅ Issue Resolved

Fixed the **EADDRINUSE** error that occurred when starting the backend server because port 5000 was already in use.

---

## 🐛 Error Analysis

### The Error
```
Error: listen EADDRINUSE: address already in use :::5000
    at Server.setupListenHandle [as _listen2] (node:net:1940:16)
    at Server.listen (node:net:2102:7)
    at app.listen (express\lib\application.js:635:24)
code: 'EADDRINUSE'
errno: -4091
syscall: 'listen'
address: '::'
port: 5000
```

### Root Cause
- Another Node.js process was already running on port 5000
- Previous backend server wasn't properly stopped
- Port remained occupied by PID **16316**

---

## 🔧 Solution Applied

### Step 1: Identify Process Using Port 5000
```bash
netstat -ano | findstr :5000
```

**Result:**
```
TCP    0.0.0.0:5000    0.0.0.0:0    LISTENING    16316
TCP    [::]:5000       [::]:0       LISTENING    16316
```

**Process ID (PID): 16316**

---

### Step 2: Kill the Process
```bash
taskkill /F /PID 16316
```

**Result:**
```
SUCCESS: The process with PID 16316 has been terminated.
```

---

### Step 3: Verify Port is Free
```bash
netstat -ano | findstr :5000 || echo "Port 5000 is free"
```

**Result:**
```
Port 5000 is free
```

---

### Step 4: Restart Backend Server
```bash
cd backend
npm start
```

**Result:**
```
✅ Backend server started on port 5000
✅ MongoDB connected
✅ API endpoints ready
```

---

## 📊 Complete Fix Flow

```
Error: Port 5000 already in use
  ↓
Run: netstat -ano | findstr :5000
  ↓
Found: PID 16316 using port 5000
  ↓
Run: taskkill /F /PID 16316
  ↓
Process terminated successfully
  ↓
Verify: Port 5000 is free
  ↓
Restart: npm start
  ↓
✅ Backend running on port 5000
```

---

## 🛠️ Quick Fix Commands

### Windows (PowerShell/CMD)
```bash
# 1. Find process using port 5000
netstat -ano | findstr :5000

# 2. Kill the process (replace PID with actual number)
taskkill /F /PID <PID>

# 3. Start backend
cd backend
npm start
```

### One-Liner Fix
```bash
# Kill all Node.js processes (use with caution)
taskkill /F /IM node.exe

# Then start backend
npm start
```

---

## 🔍 Prevention

### 1. **Properly Stop Server**
When done developing:
```bash
# Press Ctrl+C in terminal
# Wait for "Server stopped" message
```

### 2. **Use Nodemon**
Already configured in backend:
```json
{
  "scripts": {
    "dev": "nodemon src/server.js"
  }
}
```

Nodemon handles restarts better than manual `node` commands.

### 3. **Check Before Starting**
Add to package.json:
```json
{
  "scripts": {
    "predev": "netstat -ano | findstr :5000 && echo Port in use || echo Port free",
    "dev": "nodemon src/server.js"
  }
}
```

---

## 📝 Common Port Conflicts

| Port | Used By | Solution |
|------|---------|----------|
| 5000 | Backend API | Kill process, restart |
| 5173 | Frontend Vite | Kill process, restart |
| 27017 | MongoDB | Check MongoDB service |
| 3000 | Alternative backend | Change port in server.js |

---

## 🔧 Alternative Solutions

### Option 1: Change Backend Port
**File:** `backend/src/server.js`

```javascript
const PORT = process.env.PORT || 5001; // Change to 5001

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

**Update API URL in frontend:**
```env
# frontend/.env
VITE_API_URL=http://localhost:5001/api
```

---

### Option 2: Auto-Kill Script
**File:** `backend/scripts/fix-port.js`

```javascript
import { exec } from 'child_process';

exec('netstat -ano | findstr :5000', (error, stdout) => {
  if (stdout) {
    const pid = stdout.split(/\s+/).pop();
    exec(`taskkill /F /PID ${pid}`, () => {
      console.log(`Killed process ${pid}`);
      console.log('Port 5000 is now free');
    });
  } else {
    console.log('Port 5000 is already free');
  }
});
```

**Usage:**
```bash
node scripts/fix-port.js
npm start
```

---

## 🧪 Verification Checklist

### Before Fix
- [ ] Error: EADDRINUSE :::5000
- [ ] Cannot start backend
- [ ] Port 5000 in use

### After Fix
- [ ] Port 5000 is free
- [ ] Backend starts successfully
- [ ] Server listening on port 5000
- [ ] API endpoints accessible
- [ ] No errors in console

---

## 📊 Server Status Check

### Check if Backend is Running
```bash
# Windows
netstat -ano | findstr :5000

# Should show:
# TCP    0.0.0.0:5000    0.0.0.0:0    LISTENING    <PID>
```

### Test API Endpoint
```bash
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Backend is running"
}
```

---

## ⚠️ Warnings

### Mongoose Index Warning
```
[MONGOOSE] Warning: Duplicate schema index on {"user":1} found
```

**This is NOT critical** - just a warning about duplicate index definition in Order model. Can be fixed by:

**File:** `backend/src/models/Order.js`
```javascript
// Remove one of these:
// Option 1: Remove from schema definition
user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true,
  // index: true  ← Remove this
}

// Option 2: Remove schema.index() call
// orderSchema.index({ user: 1, createdAt: -1 }); ← Remove this
```

---

## ✅ Build & Restart Status

### Processes Killed
- ✅ PID 16316 (port 5000)
- ✅ PID 32236 (backend)
- ✅ PID 34144 (backend)

### Port Status
- ✅ Port 5000 is FREE
- ✅ Port 5173 (frontend) available

### Server Status
- ✅ Backend started on port 5000
- ✅ MongoDB connected
- ✅ API endpoints ready

---

## 🎉 Summary

**Problem:** Port 5000 already in use  
**Cause:** Previous backend process not stopped  
**Solution:** Kill process, restart server  

**Commands Used:**
```bash
netstat -ano | findstr :5000      # Find process
taskkill /F /PID <PID>            # Kill process
npm start                         # Restart server
```

**Result:** ✅ Backend running successfully on port 5000!

---

## 🚀 Quick Start Now

```bash
# Backend should already be running
# Check status:
netstat -ano | findstr :5000

# Test API:
curl http://localhost:5000/api/health

# Frontend:
cd ../frontend
npm run dev
```

---

**Fix Date:** 1 April 2026  
**Status:** ✅ Complete - Backend Running  
**Author:** Mathina FreshHub Development Team
