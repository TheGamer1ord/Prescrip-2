# Fix Render Root Directory Error

## Error
```
Error: Cannot find module '/opt/render/project/src/backend/server.js'
==> Running 'node server.js'
```

## Problem
Two issues are causing this error:
1. **Start Command is wrong**: It's set to `node server.js` instead of `npm start`
2. **Root Directory is wrong**: It's either empty or set incorrectly, causing Render to look in the wrong path

## Solution

### Step 1: Check Render Dashboard Settings
1. Go to your Render dashboard
2. Open your backend service (`prescrip-backend`)
3. Click on **"Settings"** tab
4. Scroll down to **"Build & Deploy"** section

### Step 2: Fix Root Directory
Find the **"Root Directory"** field and set it to:
```
backend
```
**NOT** `src/backend` or `frontend/backend` or empty - just `backend`

### Step 3: Fix Start Command ⚠️ CRITICAL
Find the **"Start Command"** field and change it from:
- ❌ `node server.js` (WRONG)
- ✅ `npm start` (CORRECT)

This is the most common issue! The start command must be `npm start` which will run `node dist/server.js` from your package.json.

### Step 4: Verify Other Settings
Make sure these are set correctly:
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start` (NOT `node server.js`)

### Step 5: Save and Redeploy
1. Click **"Save Changes"**
2. Go to **"Manual Deploy"** → **"Deploy latest commit"**
3. Or push a new commit to trigger auto-deploy

## Why This Happens

When Root Directory is set to `backend`:
- Render runs commands from `/opt/render/project/backend/`
- Build creates: `/opt/render/project/backend/dist/server.js`
- Start command runs: `node dist/server.js` (from backend directory)
- This works! ✅

When Root Directory is wrong or empty:
- Render runs from `/opt/render/project/` (root)
- It tries to find files in wrong locations
- This fails! ❌

## Verification

After fixing, check the build logs. You should see:
```
==> Building...
==> Running build command 'npm install && npm run build'...
==> Build successful

==> Starting...
==> Running start command 'npm start'...
==> Server running on port 10000
```

If you still see errors, check:
1. Root Directory is exactly `backend` (no trailing slash, no `src/`)
2. Build command completed successfully (check for `dist/` folder creation)
3. `package.json` exists in `backend/` directory

