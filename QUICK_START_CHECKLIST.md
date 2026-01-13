# Quick Start Checklist

Use this checklist to ensure everything is set up correctly.

## ✅ MongoDB Atlas Setup
- [ ] Created MongoDB Atlas account
- [ ] Created free cluster (M0)
- [ ] Created database user with password
- [ ] Added network access (allow `0.0.0.0/0` or Render IPs)
- [ ] Copied connection string with database name
- [ ] Tested connection string locally (optional)

## ✅ Render Backend Setup
- [ ] Created Render account
- [ ] Connected GitHub repository
- [ ] Created new Web Service
- [ ] Set **Root Directory**: `backend` ⚠️ CRITICAL
- [ ] Set Build Command: `npm install && npm run build`
- [ ] Set Start Command: `npm start`
- [ ] Added environment variables:
  - [ ] `NODE_ENV` = `production`
  - [ ] `PORT` = `10000`
  - [ ] `MONGO_URI` = `mongodb+srv://...` (your Atlas connection string)
  - [ ] `JWT_SECRET` = (random secure string)
  - [ ] `SMTP_USER` = (optional, for emails)
  - [ ] `SMTP_PASS` = (optional, for emails)
- [ ] Deployed successfully
- [ ] Backend URL: `https://________________.onrender.com`
- [ ] Tested health endpoint: `/api/health` works

## ✅ Netlify Frontend Setup
- [ ] Created Netlify account
- [ ] Connected GitHub repository
- [ ] Set **Base directory**: `frontend`
- [ ] Set **Build command**: `npm install && npm run build`
- [ ] Set **Publish directory**: `dist`
- [ ] Added environment variable:
  - [ ] `VITE_API_URL` = `https://your-backend.onrender.com/api`
- [ ] Deployed successfully
- [ ] Frontend URL: `https://________________.netlify.app`
- [ ] Tested frontend loads correctly

## ✅ Connection Verification
- [ ] Frontend can make API calls to backend
- [ ] No CORS errors in browser console
- [ ] User registration/login works
- [ ] Database connection is active
- [ ] All services are running

## 🔧 Common Issues to Check

### If Backend Won't Start:
- [ ] Root Directory is set to `backend` (not `frontend` or empty)
- [ ] `MONGO_URI` environment variable is set correctly
- [ ] MongoDB Atlas network access allows Render IPs
- [ ] Check Render logs for specific errors

### If Frontend Can't Reach Backend:
- [ ] `VITE_API_URL` is set in Netlify environment variables
- [ ] Backend URL includes `/api` at the end
- [ ] Backend is actually running (check Render dashboard)
- [ ] No CORS errors (backend has `cors()` enabled)

### If Database Connection Fails:
- [ ] Connection string includes database name
- [ ] Username and password are correct
- [ ] Network access allows `0.0.0.0/0` or specific IPs
- [ ] Cluster is not paused (free tier may pause)

## 📝 Important URLs to Save

**Backend URL**: `https://________________.onrender.com`  
**Backend API**: `https://________________.onrender.com/api`  
**Frontend URL**: `https://________________.netlify.app`  
**MongoDB Atlas Dashboard**: https://cloud.mongodb.com

## 🚀 After Everything Works

- [ ] Test all major features
- [ ] Set up custom domain (optional)
- [ ] Configure monitoring/alerts
- [ ] Set up automatic deployments
- [ ] Import initial data if needed

