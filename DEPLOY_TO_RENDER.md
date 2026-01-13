# Deploy Project to Render

This guide will help you deploy both the backend and frontend to Render.

---

## Prerequisites

1. ✅ **GitHub account** (to host your code)
2. ✅ **Render account** - Sign up at [render.com](https://render.com)
3. ✅ **MongoDB Atlas** - Already set up ✅
4. ✅ **Code pushed to GitHub** (or GitLab/Bitbucket)

---

## Step 1: Prepare Your Code

### 1.1 Update Backend for Production

The backend uses `babel-node` in development. We need to add a production build.

**Update `backend/package.json`:**

Add a build script:
```json
{
  "scripts": {
    "start": "node dist/server.js",
    "build": "babel src --out-dir dist --copy-files",
    "dev": "nodemon --watch ./src --exec babel-node ./src/server.js",
    ...
  }
}
```

### 1.2 Update Frontend API URL

Make sure your frontend can use environment variables for the API URL.

**Update `frontend/vite.config.js`** (if needed):
```javascript
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  // Use environment variable for API URL in production
  define: {
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'http://localhost:2222/api'),
  },
})
```

### 1.3 Update Port Configuration

Render assigns a port via `PORT` environment variable. Update backend to use it:

**Your `backend/src/config/index.js` already does this:**
```javascript
port: process.env.PORT || 2222
```

✅ This is already correct!

---

## Step 2: Push Code to GitHub

1. **Initialize Git** (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create GitHub Repository:**
   - Go to [GitHub](https://github.com)
   - Click "New repository"
   - Name it (e.g., `prescrip-project`)
   - Don't initialize with README (you already have code)
   - Click "Create repository"

3. **Push to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

---

## Step 3: Deploy Backend to Render

### 3.1 Create Backend Web Service

1. **Go to Render Dashboard:** https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. **Connect your repository:**
   - Connect GitHub/GitLab/Bitbucket
   - Select your repository
   - Click **"Connect"**

### 3.2 Configure Backend Service

**Basic Settings:**
- **Name:** `prescrip-backend` (or any name)
- **Region:** Choose closest to you (e.g., `Oregon (US West)`)
- **Branch:** `main` (or your branch)
- **Root Directory:** `backend` (important!)
- **Runtime:** `Node`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

### 3.3 Set Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these variables:

```env
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://username:password@cluster0.jezjje6.mongodb.net/prescrip?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
SMTP_USER=user@example.com
SMTP_PASS=password
```

**Important:**
- Replace `username` and `password` with your Atlas credentials
- Use a strong `JWT_SECRET` in production
- Render will assign the PORT automatically (you can leave it or use 10000)

### 3.4 Deploy Backend

1. Click **"Create Web Service"**
2. Render will start building and deploying
3. Wait for deployment to complete
4. **Copy your backend URL** (e.g., `https://prescrip-backend.onrender.com`)

---

## Step 4: Deploy Frontend to Render

### 4.1 Create Frontend Static Site

1. In Render Dashboard, click **"New +"** → **"Static Site"**
2. **Connect your repository** (same as before)
3. Click **"Connect"**

### 4.2 Configure Frontend

**Basic Settings:**
- **Name:** `prescrip-frontend`
- **Branch:** `main`
- **Root Directory:** `frontend`
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`

### 4.3 Set Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add:
```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

**Replace `your-backend-url` with your actual backend URL from Step 3.4**

### 4.4 Deploy Frontend

1. Click **"Create Static Site"**
2. Wait for deployment
3. Your frontend will be live at: `https://prescrip-frontend.onrender.com`

---

## Step 5: Update MongoDB Atlas IP Whitelist

Render's IP addresses change. Add Render's IP range:

1. Go to **MongoDB Atlas** → **Network Access**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for simplicity) OR
4. Add Render's IP range (check Render docs for current IPs)

---

## Step 6: Verify Deployment

### Backend Health Check:
Visit: `https://your-backend-url.onrender.com/api/health/live`

Should return:
```json
{"status":"ok","uptime":...}
```

### Frontend:
Visit: `https://your-frontend-url.onrender.com`

Should load your application!

---

## Optional: Use render.yaml for Automated Setup

Create `render.yaml` in your project root:

```yaml
services:
  - type: web
    name: prescrip-backend
    env: node
    region: oregon
    rootDir: backend
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGO_URI
        sync: false  # Set this manually in Render dashboard
      - key: JWT_SECRET
        generateValue: true
      - key: PORT
        value: 10000

  - type: web
    name: prescrip-frontend
    env: static
    rootDir: frontend
    buildCommand: npm install && npm run build
    staticPublishPath: dist
    envVars:
      - key: VITE_API_URL
        value: https://prescrip-backend.onrender.com/api
```

Then in Render:
1. Click **"New +"** → **"Blueprint"**
2. Connect your repo
3. Render will auto-detect and deploy both services!

---

## Troubleshooting

### Backend Won't Start

**Error: "Cannot find module"**
- **Solution:** Make sure `build` script compiles properly
- Check `backend/package.json` has: `"build": "babel src --out-dir dist --copy-files"`

**Error: "MongoDB connection failed"**
- **Solution:** 
  - Check `MONGO_URI` in environment variables
  - Verify IP whitelist in Atlas
  - Make sure password is URL-encoded

**Error: "Port already in use"**
- **Solution:** Use `process.env.PORT` (already configured ✅)

### Frontend Can't Connect to Backend

**Error: "Network Error" or CORS**
- **Solution:**
  1. Check `VITE_API_URL` is set correctly
  2. Make sure backend URL includes `/api`
  3. Verify CORS settings in backend allow your frontend domain

**Error: "404 on API calls"**
- **Solution:** Backend URL might be wrong - check `VITE_API_URL`

### Build Fails

**Error: "Build timeout"**
- **Solution:** 
  - Render free tier has limits
  - Upgrade to paid plan OR
  - Optimize build (remove unused dependencies)

**Error: "Module not found"**
- **Solution:** 
  - Check all dependencies are in `package.json`
  - Remove `node_modules` from `.gitignore` if needed (but don't commit it)

---

## Important Notes

### Render Free Tier Limitations:
- ⚠️ Services **sleep after 15 minutes** of inactivity (free tier)
- ⚠️ First request after sleep takes ~30 seconds to wake up
- ⚠️ Build timeouts after 10 minutes (free tier)

### Recommendations:
1. **Upgrade to paid plan** for production (starts at $7/month)
2. **Use custom domain** for better SEO
3. **Enable auto-deploy** on git push
4. **Set up health checks** to prevent sleeping

---

## Post-Deployment Checklist

- [ ] Backend is running and accessible
- [ ] Frontend is running and accessible
- [ ] API calls from frontend work
- [ ] MongoDB Atlas connection works
- [ ] Environment variables are set
- [ ] IP whitelist updated in Atlas
- [ ] Test login/registration
- [ ] Test creating appointments
- [ ] Monitor logs for errors

---

## Quick Deploy Checklist

### Backend:
- [ ] Code pushed to GitHub
- [ ] Render web service created
- [ ] Root directory: `backend`
- [ ] Build command: `npm install && npm run build`
- [ ] Start command: `npm start`
- [ ] Environment variables set (MONGO_URI, JWT_SECRET, etc.)

### Frontend:
- [ ] Render static site created
- [ ] Root directory: `frontend`
- [ ] Build command: `npm install && npm run build`
- [ ] Publish directory: `dist`
- [ ] VITE_API_URL set to backend URL

### MongoDB:
- [ ] Atlas IP whitelist updated (allow Render IPs or 0.0.0.0/0)
- [ ] Connection string verified

---

## Support Resources

- **Render Docs:** https://render.com/docs
- **Render Status:** https://status.render.com
- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com

---

**Good luck with your deployment!** 🚀

