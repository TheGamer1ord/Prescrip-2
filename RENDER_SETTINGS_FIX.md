# Render Settings - Exact Configuration

## Current Error
```
Error: Cannot find module '/opt/render/project/src/backend/start'
```

This means:
- ❌ Root Directory is set to `src` (WRONG)
- ❌ Start Command might be `start` (WRONG)

## ✅ CORRECT Settings for Render Dashboard

Go to: **Render Dashboard → Your Service → Settings → Build & Deploy**

### Setting 1: Root Directory
**Field Name:** Root Directory  
**Value:** `backend`  
**NOT:** `src`, `src/backend`, `frontend/backend`, or empty

### Setting 2: Build Command
**Field Name:** Build Command  
**Value:** `npm install && npm run build`

### Setting 3: Start Command ⚠️ MOST IMPORTANT
**Field Name:** Start Command  
**Value:** `npm start`  
**NOT:** `start`, `node server.js`, `node start`, or anything else

## Step-by-Step Fix

1. **Open Render Dashboard**
   - Go to https://dashboard.render.com
   - Click on your backend service

2. **Go to Settings**
   - Click the **"Settings"** tab at the top

3. **Scroll to "Build & Deploy" Section**
   - Find the build settings

4. **Fix Root Directory**
   - Find **"Root Directory"** field
   - Delete whatever is there (might be `src` or empty)
   - Type exactly: `backend`
   - No quotes, no slashes, just: `backend`

5. **Fix Start Command**
   - Find **"Start Command"** field
   - Delete whatever is there (might be `start` or `node server.js`)
   - Type exactly: `npm start`
   - No quotes, just: `npm start`

6. **Verify Build Command**
   - Should be: `npm install && npm run build`
   - If not, set it to this

7. **Save Changes**
   - Click **"Save Changes"** button at the bottom

8. **Redeploy**
   - Go to **"Manual Deploy"** tab
   - Click **"Deploy latest commit"**
   - Or push a new commit to trigger auto-deploy

## Verification Checklist

After fixing, your settings should look like this:

```
Root Directory:     backend
Build Command:      npm install && npm run build
Start Command:      npm start
```

## Why This Works

With correct settings:
- Root Directory = `backend`
  - Render runs commands from: `/opt/render/project/backend/`
  
- Build Command = `npm install && npm run build`
  - Installs dependencies
  - Runs Babel to compile: `src/` → `dist/`
  - Creates: `/opt/render/project/backend/dist/server.js`

- Start Command = `npm start`
  - Runs the script from `package.json`: `"start": "node dist/server.js"`
  - Executes: `node dist/server.js` from `/opt/render/project/backend/`
  - Finds file at: `/opt/render/project/backend/dist/server.js` ✅

## Common Mistakes

❌ **Root Directory = `src`**
   - Render looks in: `/opt/render/project/src/`
   - Can't find `backend/` folder
   - Error: Cannot find module

❌ **Start Command = `start`**
   - Tries to run `start` as a file
   - Error: Cannot find module '/opt/render/project/.../start'

❌ **Start Command = `node server.js`**
   - Tries to find `server.js` in wrong location
   - Should use `npm start` to run the compiled `dist/server.js`

## Still Not Working?

If you've set everything correctly but still get errors:

1. **Check Build Logs**
   - Did the build complete successfully?
   - Look for: "Build successful" or "Build completed"
   - Check if `dist/` folder was created

2. **Check Start Logs**
   - Look for the exact error message
   - Verify it's trying to run `npm start`

3. **Verify package.json**
   - Make sure `backend/package.json` exists
   - Check it has: `"start": "node dist/server.js"`

4. **Delete and Recreate Service**
   - If settings won't save correctly
   - Delete the service
   - Create new one from `render.yaml` file
   - Or manually with correct settings from the start

