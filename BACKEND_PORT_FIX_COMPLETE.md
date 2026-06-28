# Backend Port 5000 Fix - Complete Solution

## ✅ Permanent Fix Implemented

Added automatic port cleanup script that runs before every backend start to prevent EADDRINUSE errors.

---

## 🎯 Solution Overview

### Problem
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Cause:** Previous backend process not properly stopped, leaving port 5000 occupied.

---

## 🔧 Permanent Fix Applied

### 1. **Created Auto-Cleanup Script** ✅
**File:** `backend/scripts/free-port.js`

**Features:**
- Automatically finds processes using port 5000
- Kills all processes holding the port
- Works on Windows, macOS, and Linux
- Runs before every `npm start` and `npm run dev`

**Code:**
```javascript
// Automatically kills processes on port 5000
const PORT = 5000;

// Windows: Uses netstat + taskkill
// macOS/Linux: Uses lsof + kill
```

---

### 2. **Updated package.json** ✅
**File:** `backend/package.json`

**Changes:**
```json
{
  "scripts": {
    "predev": "node scripts/free-port.js",
    "dev": "nodemon src/server.js",
    "prestart": "node scripts/free-port.js",
    "start": "node src/server.js"
  }
}
```

**How It Works:**
- `predev` runs automatically before `npm run dev`
- `prestart` runs automatically before `npm start`
- Cleans up port 5000 before server tries to bind
- Prevents EADDRINUSE errors

---

## 📊 Usage Flow

### Before Fix
```
npm run dev
  ↓
Port 5000 in use
  ↓
❌ EADDRINUSE error
  ↓
Server crashes
```

### After Fix
```
npm run dev
  ↓
predev: node scripts/free-port.js
  ↓
Port 5000 cleaned up ✅
  ↓
dev: nodemon src/server.js
  ↓
✅ Server starts successfully
```

---

## 🚀 How to Use

### Normal Start (Now Automatic)
```bash
cd backend
npm run dev
```

**What Happens:**
1. `predev` script runs automatically
2. Checks port 5000
3. Kills any processes using it
4. `nodemon` starts server
5. Server runs on port 5000 ✅

### Manual Cleanup (If Needed)
```bash
# Run cleanup script manually
node scripts/free-port.js

# Then start server
npm run dev
```

---

## 🛠️ Quick Fix Commands

### Windows (PowerShell/CMD)
```bash
# 1. Kill all Node processes
taskkill /F /IM node.exe

# 2. Start backend (auto-cleanup enabled)
cd backend
npm run dev
```

### One-Command Fix
```bash
taskkill /F /IM node.exe && cd backend && npm run dev
```

---

## 📝 Script Output Example

### Successful Cleanup
```
🔧 Checking port 5000...
🔍 Found 1 process(es) using port 5000
✅ Killed process 19080
✅ Port 5000 is ready for use
```

### Port Already Free
```
🔧 Checking port 5000...
✅ Port 5000 is free
✅ Port 5000 is ready for use
```

---

## 🧪 Testing

### Test 1: Normal Start
```bash
cd backend
npm run dev
```

**Expected Output:**
```
🔧 Checking port 5000...
✅ Port 5000 is free
✅ Port 5000 is ready for use

[nodemon] starting `node src/server.js`
╔═══════════════════════════════════════════════════════════╗
║   🐔 CluckFresh Hub API Server                            ║
║   🚀 Server running on port 5000                          ║
║   📍 Environment: development                             ║
║   🗄️  Database: Connected                                 ║
╚═══════════════════════════════════════════════════════════╝
```

### Test 2: Port In Use
```bash
# Start a process on port 5000
node -e "require('http').createServer((req,res)=>{}).listen(5000)"

# In another terminal, try to start backend
cd backend
npm run dev
```

**Expected Output:**
```
🔧 Checking port 5000...
🔍 Found 1 process(es) using port 5000
✅ Killed process <PID>
✅ Port 5000 is ready for use

[nodemon] starting `node src/server.js`
✅ Server starts successfully
```

---

## 🔍 Verification

### Check Port Status
```bash
# Windows
netstat -ano | findstr :5000

# Should show backend process LISTENING
TCP    0.0.0.0:5000    0.0.0.0:0    LISTENING    <PID>
```

### Test API
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

## ⚠️ Troubleshooting

### If Port Still In Use

**Option 1: Manual Kill**
```bash
# Find PID
netstat -ano | findstr :5000

# Kill it
taskkill /F /PID <PID>
```

**Option 2: Kill All Node**
```bash
taskkill /F /IM node.exe
```

**Option 3: Change Port**
Edit `backend/src/server.js`:
```javascript
const PORT = process.env.PORT || 5001; // Use 5001 instead
```

Update frontend `.env`:
```env
VITE_API_URL=http://localhost:5001/api
```

---

## 📋 Files Created/Modified

### New Files
1. ✅ `backend/scripts/free-port.js` - Auto-cleanup script

### Modified Files
1. ✅ `backend/package.json` - Added predev and prestart scripts

---

## 🎯 Best Practices

### 1. Always Stop Server Properly
```bash
# In terminal running backend
# Press Ctrl+C
# Wait for "Server stopped" message
```

### 2. Use Nodemon (Already Configured)
```bash
npm run dev  # Uses nodemon, handles restarts better
```

### 3. Check Before Starting
```bash
# If you get EADDRINUSE error:
node scripts/free-port.js
npm run dev
```

---

## ✅ Current Status

| Component | Status | Port |
|-----------|--------|------|
| **Cleanup Script** | ✅ Created | - |
| **package.json** | ✅ Updated | - |
| **Port 5000** | ✅ Free/Cleaned | 5000 |
| **Backend Server** | ✅ Running | 5000 |
| **MongoDB** | ✅ Connected | 27017 |

---

## 🎉 Summary

**Problem:** Port 5000 already in use, server won't start  
**Root Cause:** Previous process not stopped properly  
**Solution:** Automatic port cleanup before server start  

**Implementation:**
1. ✅ Created `scripts/free-port.js`
2. ✅ Added `predev` and `prestart` scripts
3. ✅ Automatic cleanup on every start
4. ✅ Cross-platform support

**Result:** ✅ No more EADDRINUSE errors!

---

## 🚀 Quick Start Now

```bash
# Backend (auto-cleanup enabled)
cd backend
npm run dev

# Frontend (in separate terminal)
cd frontend
npm run dev
```

**Backend will automatically:**
- ✅ Clean up port 5000
- ✅ Start server
- ✅ Connect to MongoDB
- ✅ Run on http://localhost:5000

---

**Fix Date:** 1 April 2026  
**Status:** ✅ Complete - Permanent Fix  
**Author:** Mathina FreshHub Development Team
