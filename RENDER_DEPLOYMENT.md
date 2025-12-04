# Render Deployment Environment Variables

## 🔴 CRITICAL: MongoDB Connection String

Your current MongoDB connection string is **MISSING THE DATABASE NAME**!

### ❌ Current (Incorrect):
```
mongodb+srv://adinathhanumantgore_db_user:rqSZw5DMChpP8PaC@cluster0.eyuoilj.mongodb.net/?appName=Cluster0
```

### ✅ Correct Format:
```
mongodb+srv://adinathhanumantgore_db_user:rqSZw5DMChpP8PaC@cluster0.eyuoilj.mongodb.net/alumniprofiles?retryWrites=true&w=majority&appName=Cluster0
```

**Key Changes:**
- Added `/alumniprofiles` before the `?` to specify the database name
- Added `retryWrites=true&w=majority` for better reliability

---

## Backend Environment Variables (Render Web Service)

Set these in your Render backend service dashboard:

### Required Variables:

1. **MONGO_URI**
   ```
   mongodb+srv://adinathhanumantgore_db_user:rqSZw5DMChpP8PaC@cluster0.eyuoilj.mongodb.net/alumniprofiles?retryWrites=true&w=majority&appName=Cluster0
   ```

2. **CORS_ORIGIN**
   - Your frontend URL on Render
   - Example: `https://studentnetwork.onrender.com`
   - If you have multiple URLs (local + production), use comma-separated:
     ```
     https://studentnetwork.onrender.com,http://localhost:5173
     ```

3. **JWT_SECRET**
   - Your JWT secret key
   - Example: `your-super-secret-jwt-key-here`

4. **NODE_ENV**
   ```
   production
   ```

5. **PORT** (Usually auto-set by Render)
   ```
   5000
   ```

---

## Frontend Environment Variables (Render Static Site)

Set these in your Render frontend service dashboard:

### Required Variables:

1. **VITE_API_URL**
   - Your backend API URL on Render
   - Example: `https://studentnetwork-backend.onrender.com/api`
   - **IMPORTANT**: Include `/api` at the end!

---

## How to Set Environment Variables on Render

### For Backend (Web Service):
1. Go to your backend service on Render dashboard
2. Click on "Environment" in the left sidebar
3. Click "Add Environment Variable"
4. Add each variable with its value
5. Click "Save Changes"
6. Render will automatically redeploy

### For Frontend (Static Site):
1. Go to your frontend service on Render dashboard
2. Click on "Environment" in the left sidebar
3. Click "Add Environment Variable"
4. Add `VITE_API_URL` with your backend URL
5. Click "Save Changes"
6. **IMPORTANT**: You must manually trigger a redeploy for frontend env vars to take effect
   - Go to "Manual Deploy" and click "Clear build cache & deploy"

---

## MongoDB Atlas Network Access

Make sure MongoDB Atlas allows connections from Render:

1. Go to MongoDB Atlas Dashboard
2. Click "Network Access" in the left sidebar
3. Click "Add IP Address"
4. Click "Allow Access from Anywhere" (or add Render's IP ranges)
5. Click "Confirm"

---

## Testing Your Deployment

### 1. Test Backend Health
Open in browser:
```
https://your-backend.onrender.com/api/health
```

Should return:
```json
{
  "status": "OK",
  "timestamp": "2024-12-04T...",
  "environment": "production",
  "database": "Connected"
}
```

### 2. Test Database Connection
Open in browser:
```
https://your-backend.onrender.com/api/debug/info
```

Should return database info and counts.

### 3. Test Alumni API
Open in browser:
```
https://your-backend.onrender.com/api/alumni
```

Should return array of alumni profiles.

### 4. Check Frontend Console
1. Open your deployed frontend
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Look for the logs we added:
   - "🔄 Fetching alumni data..."
   - "API Base URL: ..."
   - "✅ Alumni data received: ..."

---

## Troubleshooting

### If you see "No alumni profiles found":
1. Check MongoDB connection string has `/alumniprofiles` database name
2. Verify data exists in MongoDB Atlas
3. Check backend logs on Render for connection errors

### If you see CORS errors:
1. Verify `CORS_ORIGIN` includes your frontend URL
2. Make sure there are no trailing slashes
3. Check backend logs for "CORS blocked origin" messages

### If frontend can't connect to backend:
1. Verify `VITE_API_URL` is set correctly
2. Make sure it includes `/api` at the end
3. Check Network tab in browser DevTools for failed requests

---

## Next Steps

1. ✅ Update `MONGO_URI` on Render backend with the correct connection string
2. ✅ Verify all other environment variables are set
3. ✅ Redeploy backend (automatic after env var change)
4. ✅ Redeploy frontend (manual - clear cache & deploy)
5. ✅ Test using the endpoints above
6. ✅ Check browser console for logs
