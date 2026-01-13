# Netlify Deployment Guide

This guide will help you deploy the frontend to Netlify.

## Prerequisites
- A Netlify account (sign up at https://www.netlify.com)
- Your GitHub repository connected to Netlify
- Your backend API URL (e.g., `https://prescrip-backend.onrender.com/api`)

## Method 1: Deploy via Netlify Dashboard (Recommended)

### Step 1: Connect Repository
1. Log in to [Netlify Dashboard](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect to **GitHub** and select your repository: `TheGamer1ord/Prescrip-2`

### Step 2: Configure Build Settings
In the build settings, configure:
- **Base directory:** `frontend`
- **Build command:** `npm install && npm run build`
- **Publish directory:** `frontend/dist`

### Step 3: Set Environment Variables
1. Go to **Site settings** → **Environment variables**
2. Add the following variable:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://prescrip-backend.onrender.com/api` (or your backend URL)

### Step 4: Deploy
1. Click **"Deploy site"**
2. Netlify will build and deploy your frontend
3. Once deployed, you'll get a URL like `https://your-site-name.netlify.app`

## Method 2: Deploy via Netlify CLI

### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

### Step 2: Login to Netlify
```bash
netlify login
```

### Step 3: Initialize and Deploy
```bash
cd frontend
netlify init
```

Follow the prompts:
- Create & configure a new site
- Choose your team
- Set build command: `npm install && npm run build`
- Set publish directory: `dist`

### Step 4: Set Environment Variable
```bash
netlify env:set VITE_API_URL "https://prescrip-backend.onrender.com/api"
```

### Step 5: Deploy
```bash
netlify deploy --prod
```

## Method 3: Using netlify.toml (Already Configured)

The `netlify.toml` file in the root directory is already configured. If you use this method:

1. Connect your repository to Netlify
2. Netlify will automatically detect `netlify.toml`
3. Set the environment variable `VITE_API_URL` in Netlify dashboard
4. Deploy

## Important Notes

### Environment Variables
Make sure to set `VITE_API_URL` in Netlify dashboard to point to your backend API:
- Development: `http://localhost:2222/api`
- Production: `https://prescrip-backend.onrender.com/api`

### SPA Routing
The `netlify.toml` includes a redirect rule for React Router. All routes will redirect to `index.html` to handle client-side routing.

### Build Process
- Netlify will run `npm install` in the `frontend` directory
- Then run `npm run build` which creates the `dist` folder
- The `dist` folder is served as static files

## Troubleshooting

### Build Fails
- Check that Node.js version is 18+ (configured in `netlify.toml`)
- Verify all dependencies are in `package.json`
- Check build logs in Netlify dashboard

### API Calls Fail
- Verify `VITE_API_URL` environment variable is set correctly
- Check CORS settings on your backend
- Ensure backend is deployed and accessible

### 404 Errors on Routes
- Verify the redirect rule in `netlify.toml` is working
- Check that `publish` directory is set to `frontend/dist`

## Custom Domain (Optional)
1. Go to **Domain settings** in Netlify
2. Click **"Add custom domain"**
3. Follow the DNS configuration instructions

