# Complete Startup Guide - Netlify + Render + MongoDB Atlas

This guide will help you get your entire application running with:
- **Frontend**: Deployed on Netlify
- **Backend**: Deployed on Render
- **Database**: MongoDB Atlas

---

## Step 1: Set Up MongoDB Atlas

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Create a new project (or use existing)

### 1.2 Create a Cluster
1. Click **"Build a Database"**
2. Choose **FREE (M0)** tier
3. Select a cloud provider and region (choose closest to your Render region)
4. Click **"Create"**

### 1.3 Configure Database Access
1. Go to **"Database Access"** (left sidebar)
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Create a username and strong password (save these!)
5. Set privileges to **"Atlas admin"** or **"Read and write to any database"**
6. Click **"Add User"**

### 1.4 Configure Network Access
1. Go to **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for Render/Netlify) or add specific IPs:
   - Render IPs: `0.0.0.0/0` (allows all)
   - Or add your specific Render service IPs
4. Click **"Confirm"**

### 1.5 Get Connection String
1. Go to **"Database"** → Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<username>` and `<password>` with your database user credentials
5. Add your database name at the end (e.g., `prescrip`):
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/prescrip?retryWrites=true&w=majority
   ```
6. **Save this connection string** - you'll need it for Render

---

## Step 2: Deploy Backend on Render

### 2.1 Create Render Account
1. Go to [Render](https://render.com)
2. Sign up or log in with GitHub

### 2.2 Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `TheGamer1ord/Prescrip-2`
3. Select the repository

### 2.3 Configure Service Settings
- **Name**: `prescrip-backend` (or your preferred name)
- **Region**: Choose closest to your users (e.g., `Oregon`)
- **Branch**: `main`
- **Root Directory**: `backend` ⚠️ **IMPORTANT**
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### 2.4 Set Environment Variables
Click **"Advanced"** → **"Add Environment Variable"** and add:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | |
| `PORT` | `10000` | Render will override this, but set it anyway |
| `MONGO_URI` | `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/prescrip?retryWrites=true&w=majority` | **Your Atlas connection string from Step 1.5** |
| `JWT_SECRET` | `your-super-secret-jwt-key-here` | Generate a random string (use a password generator) |
| `SMTP_USER` | `your-email@gmail.com` | For email functionality (optional) |
| `SMTP_PASS` | `your-app-password` | For email functionality (optional) |

### 2.5 Deploy
1. Click **"Create Web Service"**
2. Render will start building and deploying
3. Wait for deployment to complete (5-10 minutes)
4. Note your backend URL: `https://prescrip-backend.onrender.com` (or your custom name)

### 2.6 Verify Backend is Running
1. Check the **"Logs"** tab for any errors
2. Visit: `https://your-backend-url.onrender.com/api/health` (should return success)
3. If you see errors about MongoDB connection, check:
   - Network Access in Atlas allows `0.0.0.0/0`
   - Connection string is correct
   - Username/password are correct

---

## Step 3: Deploy Frontend on Netlify

### 3.1 Create Netlify Account
1. Go to [Netlify](https://www.netlify.com)
2. Sign up or log in with GitHub

### 3.2 Import Site from Git
1. Click **"Add new site"** → **"Import an existing project"**
2. Connect to **GitHub** and select: `TheGamer1ord/Prescrip-2`
3. Click **"Import"**

### 3.3 Configure Build Settings
- **Base directory**: `frontend`
- **Build command**: `npm install && npm run build`
- **Publish directory**: `dist` (relative to base directory)

### 3.4 Set Environment Variables
1. Click **"Show advanced"** → **"New variable"**
2. Add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://prescrip-backend.onrender.com/api` (use your actual Render backend URL)

### 3.5 Deploy
1. Click **"Deploy site"**
2. Netlify will build and deploy (2-5 minutes)
3. Your site will be live at: `https://random-name.netlify.app`

### 3.6 Custom Domain (Optional)
1. Go to **"Domain settings"**
2. Click **"Add custom domain"**
3. Follow DNS configuration instructions

---

## Step 4: Verify Everything is Connected

### 4.1 Test Backend
```bash
# Health check
curl https://your-backend.onrender.com/api/health

# Should return: {"status": "ok"} or similar
```

### 4.2 Test Frontend
1. Visit your Netlify URL
2. Open browser DevTools (F12) → Network tab
3. Try logging in or making an API call
4. Check that requests go to your Render backend URL

### 4.3 Check CORS (if API calls fail)
If you see CORS errors, verify your backend has CORS enabled:
- Check `backend/src/app.js` - should have `cors()` middleware
- Render backend should allow requests from your Netlify domain

---

## Step 5: Troubleshooting

### Backend Issues

**Problem**: Backend won't start
- Check Render logs for errors
- Verify `MONGO_URI` is set correctly
- Ensure MongoDB Atlas network access allows Render IPs

**Problem**: MongoDB connection fails
- Verify connection string format
- Check username/password are correct
- Ensure network access allows `0.0.0.0/0` or Render IPs
- Check cluster is running (not paused)

**Problem**: Build fails on Render
- Verify `rootDir` is set to `backend`
- Check `package.json` exists in `backend/` directory
- Review build logs for specific errors

### Frontend Issues

**Problem**: Frontend can't reach backend
- Verify `VITE_API_URL` is set in Netlify
- Check backend URL is correct (include `/api` at the end)
- Rebuild frontend after changing environment variables

**Problem**: CORS errors
- Backend must allow requests from Netlify domain
- Check `backend/src/app.js` has `cors({ origin: "*" })` or specific origins

**Problem**: 404 errors on routes
- Verify `netlify.toml` has redirect rule for SPA routing
- Check publish directory is `dist`

### Database Issues

**Problem**: Can't connect to MongoDB
- Verify connection string includes database name
- Check network access allows `0.0.0.0/0`
- Ensure database user has proper permissions
- Check cluster is not paused (free tier pauses after inactivity)

---

## Step 6: Keep Services Running

### Render (Free Tier)
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- Consider upgrading to paid tier for always-on service

### MongoDB Atlas (Free Tier)
- Cluster may pause after 1 hour of inactivity
- First connection after pause takes ~1 minute
- Data is preserved, just needs to wake up

### Netlify
- Always on (even free tier)
- No spin-down issues

---

## Quick Reference: URLs and Settings

### Backend (Render)
- **URL**: `https://prescrip-backend.onrender.com`
- **API Base**: `https://prescrip-backend.onrender.com/api`
- **Health Check**: `https://prescrip-backend.onrender.com/api/health`

### Frontend (Netlify)
- **URL**: `https://your-site.netlify.app`
- **Environment Variable**: `VITE_API_URL=https://prescrip-backend.onrender.com/api`

### Database (MongoDB Atlas)
- **Connection String**: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/prescrip?retryWrites=true&w=majority`
- **Dashboard**: https://cloud.mongodb.com

---

## Next Steps

1. ✅ All services deployed and connected
2. 🔄 Test user registration/login
3. 🔄 Import initial data (doctors, facilities) if needed
4. 🔄 Set up monitoring/alerts
5. 🔄 Configure custom domains
6. 🔄 Set up CI/CD for automatic deployments

---

## Support Resources

- **Render Docs**: https://render.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **Your Repository**: https://github.com/TheGamer1ord/Prescrip-2

