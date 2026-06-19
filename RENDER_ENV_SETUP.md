# 🔧 CRITICAL: Render Environment Variables Setup

## ❗ IMPORTANT: You MUST update these on Render for the app to work!

### Backend Service Environment Variables

Go to your **Backend Web Service** on Render → Environment tab → Add these:

```bash
# 1. MongoDB Connection (CRITICAL - Must include database name!)
MONGO_URI= //USE YOUR OWN

# 2. CORS Origin (CRITICAL - Must match your frontend URL EXACTLY!)
# Replace with your actual frontend URL from Render
CORS_ORIGIN=https://your-frontend-name.onrender.com

# Example if you have multiple (local + production):
# CORS_ORIGIN=https://your-frontend-name.onrender.com,http://localhost:5173

# 3. JWT Secret (use a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# 4. Node Environment
NODE_ENV=production
```

### Frontend Service Environment Variables

Go to your **Frontend Static Site** on Render → Environment tab → Add this:

```bash
# Backend API URL (CRITICAL - Must include /api at the end!)
# Replace with your actual backend URL from Render
VITE_API_URL=https://your-backend-name.onrender.com/api
```

---

## 🚨 Common Mistakes to Avoid

### ❌ WRONG MongoDB URI (Missing database name):
```
mongodb+srv://user:pass@cluster.mongodb.net/?appName=Cluster0
```

### ✅ CORRECT MongoDB URI (With database name):
```
mongodb+srv://user:pass@cluster.mongodb.net/alumniprofiles?retryWrites=true&w=majority&appName=Cluster0
```

### ❌ WRONG CORS_ORIGIN (Trailing slash):
```
CORS_ORIGIN=https://myapp.onrender.com/
```

### ✅ CORRECT CORS_ORIGIN (No trailing slash):
```
CORS_ORIGIN=https://myapp.onrender.com
```

### ❌ WRONG VITE_API_URL (Missing /api):
```
VITE_API_URL=https://mybackend.onrender.com
```

### ✅ CORRECT VITE_API_URL (With /api):
```
VITE_API_URL=https://mybackend.onrender.com/api
```

---

## 📋 Step-by-Step Instructions

### Step 1: Get Your Render URLs

1. Go to Render Dashboard
2. Note your **Backend URL**: `https://your-backend-name.onrender.com`
3. Note your **Frontend URL**: `https://your-frontend-name.onrender.com`

### Step 2: Update Backend Environment Variables

1. Go to your **Backend Web Service**
2. Click **Environment** in left sidebar
3. Add/Update each variable listed above
4. Replace placeholder URLs with your actual URLs
5. Click **Save Changes**
6. Backend will auto-redeploy

### Step 3: Update Frontend Environment Variables

1. Go to your **Frontend Static Site**
2. Click **Environment** in left sidebar
3. Add `VITE_API_URL` with your backend URL + `/api`
4. Click **Save Changes**
5. **IMPORTANT**: Go to **Manual Deploy** → **Clear build cache & deploy**

### Step 4: Verify Deployment

1. Wait for both services to finish deploying
2. Check backend logs for:
   ```
   🔧 CORS Configuration:
      Allowed Origins: [ 'https://your-frontend.onrender.com' ]
   ✅ MongoDB Connected Successfully!
      Database: alumniprofiles
   ```

3. Open your frontend URL
4. Press F12 → Console tab
5. Try to register/login
6. Look for:
   ```
   🌐 API Request: POST /auth/register
   ✅ API Response: POST /auth/register 201
   ```

---

## 🧪 Testing Your Setup

### Test 1: Backend Health Check
```
https://your-backend.onrender.com/api/health
```
Should return:
```json
{
  "status": "OK",
  "database": "Connected"
}
```

### Test 2: Database Info
```
https://your-backend.onrender.com/api/debug/info
```
Should show your database name and collections.

### Test 3: Frontend Console
1. Open frontend
2. F12 → Console
3. Should see CORS configuration logs
4. Should NOT see any CORS errors

---

## 🔍 Troubleshooting

### If you see CORS errors:
1. Check `CORS_ORIGIN` matches frontend URL exactly
2. No trailing slashes
3. Check backend logs for "CORS BLOCKED" messages

### If login/register fails:
1. Check browser console for errors
2. Check backend logs for authentication errors
3. Verify MongoDB connection is successful

### If alumni directory is empty:
1. Check `/api/debug/info` to verify data exists
2. Check browser console for API errors
3. Verify `VITE_API_URL` is correct

---

## ✅ Checklist

- [ ] Updated `MONGO_URI` with `/alumniprofiles` database name
- [ ] Updated `CORS_ORIGIN` with exact frontend URL (no trailing slash)
- [ ] Set `JWT_SECRET` to a secure value
- [ ] Set `NODE_ENV=production`
- [ ] Updated `VITE_API_URL` with backend URL + `/api`
- [ ] Redeployed backend (automatic)
- [ ] Redeployed frontend (manual - clear cache)
- [ ] Tested `/api/health` endpoint
- [ ] Tested registration
- [ ] Tested login
- [ ] Verified alumni directory loads
- [ ] No CORS errors in browser console
