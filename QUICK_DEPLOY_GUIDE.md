# Quick Deploy to Render - Step by Step

## Prerequisites

- ✅ GitHub account
- ✅ Code pushed to GitHub
- ✅ MongoDB Atlas already set up

---

## Step 1: Update Backend package.json

Already done! ✅ The build script has been added.

---

## Step 2: Push Code to GitHub

```bash
git add .
git commit -m "Prepare for Render deployment"
git push
```

---

## Step 3: Deploy Backend

1. **Go to:** https://dashboard.render.com
2. **Click:** "New +" → "Web Service"
3. **Connect GitHub** and select your repository
4. **Configure:**
   - **Name:** `prescrip-backend`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Environment:** `Node`

5. **Add Environment Variables:**
   - `NODE_ENV` = `production`
   - `MONGO_URI` = `mongodb+srv://username:password@cluster0.jezjje6.mongodb.net/prescrip?retryWrites=true&w=majority`
   - `JWT_SECRET` = (any strong secret)
   - `PORT` = `10000` (or leave blank, Render auto-assigns)

6. **Click:** "Create Web Service"
7. **Wait for deployment** (5-10 minutes)
8. **Copy your backend URL** (e.g., `https://prescrip-backend-xxxx.onrender.com`)

---

## Step 4: Deploy Frontend

1. **In Render Dashboard:** "New +" → "Static Site"
2. **Connect same repository**
3. **Configure:**
   - **Name:** `prescrip-frontend`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

4. **Add Environment Variable:**
   - `VITE_API_URL` = `https://your-backend-url.onrender.com/api`
   - (Replace with your actual backend URL from Step 3)

5. **Click:** "Create Static Site"
6. **Wait for deployment**

---

## Step 5: Update Atlas IP Whitelist

1. Go to **MongoDB Atlas** → **Network Access**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Or add specific Render IP ranges

---

## Step 6: Test

- **Backend:** Visit `https://your-backend.onrender.com/api/health/live`
- **Frontend:** Visit `https://your-frontend.onrender.com`

---

## Using render.yaml (Alternative - Easier!)

If you want to deploy both at once:

1. The `render.yaml` file is already created in your project root
2. In Render: "New +" → "Blueprint"
3. Connect your repo
4. Render will auto-detect `render.yaml` and deploy both services!

**Just remember to:**
- Update `MONGO_URI` in Render dashboard after deployment
- Update `VITE_API_URL` with your actual backend URL

---

## Troubleshooting

**Backend fails to build:**
- Check build logs in Render
- Make sure `npm run build` works locally

**Frontend can't connect:**
- Verify `VITE_API_URL` is correct
- Check backend CORS settings

**MongoDB connection fails:**
- Check IP whitelist in Atlas
- Verify `MONGO_URI` is correct

---

**That's it!** Your app should be live on Render! 🚀

