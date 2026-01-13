# Quick Migration Guide: Local MongoDB → Atlas

## Prerequisites

1. ✅ Your local MongoDB is running
2. ✅ You have a MongoDB Atlas account and cluster set up
3. ✅ Your Atlas connection string ready

---

## Step 1: Get Your Atlas Connection String

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Click on your **cluster** (cluster0)
3. Click **"Connect"** → **"Connect your application"**
4. Copy the connection string:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/prescrip?retryWrites=true&w=majority
   ```

**Important:** 
- Replace `username` and `password` with your actual Atlas credentials
- Make sure `/prescrip` is in the connection string (the database name)

---

## Step 2: Update Your .env File

Edit `backend/.env` and add/update:

```env
# Local MongoDB (for migration)
LOCAL_MONGO_URI=mongodb://localhost:27017/prescrip

# Atlas MongoDB (your cloud database)
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/prescrip?retryWrites=true&w=majority
```

**⚠️ Security Note:** Make sure `.env` is in `.gitignore` and never commit it!

---

## Step 3: Whitelist Your IP in Atlas

Before running the migration:

1. Go to MongoDB Atlas → **Network Access**
2. Click **"Add IP Address"**
3. Click **"Add Current IP Address"** (or "Allow Access from Anywhere" for testing)
4. Wait 1-2 minutes for changes to take effect

---

## Step 4: Run the Migration Script

Open terminal in the `backend` directory and run:

```bash
cd backend
npm run migrate-to-atlas
```

The script will:
- ✅ Connect to your local MongoDB
- ✅ Connect to MongoDB Atlas
- ✅ Migrate all collections (users, doctors, appointments, etc.)
- ✅ Show you a summary of what was migrated

---

## Step 5: Verify Migration

### Option A: Check in VS Code
1. Connect to Atlas using MongoDB extension (see `VSCODE_MONGODB_CONNECTION.md`)
2. Browse your `prescrip` database
3. Verify all collections and data are present

### Option B: Check in Atlas Dashboard
1. Go to MongoDB Atlas → **Browse Collections**
2. Select your `prescrip` database
3. Check each collection has data

### Option C: Test Your Application
1. Make sure your `.env` has the Atlas connection string
2. Start your backend: `npm run dev`
3. Test login, registration, and data operations
4. Verify everything works with Atlas

---

## Troubleshooting

### Error: "MONGO_URI not found"
- **Solution:** Make sure `MONGO_URI` is set in `backend/.env`

### Error: "Authentication failed"
- **Solution:** 
  - Double-check username and password in connection string
  - URL-encode special characters in password
  - Verify database user exists in Atlas

### Error: "IP not whitelisted"
- **Solution:** 
  - Go to Atlas → Network Access
  - Add your current IP address
  - Wait 1-2 minutes

### Error: "Connection timeout"
- **Solution:**
  - Check internet connection
  - Verify firewall isn't blocking
  - Try the connection string without query parameters

### Error: "Collection not found"
- **Solution:** This is normal if a collection doesn't exist locally. The script will skip it.

---

## What Gets Migrated?

The script migrates these collections:
- ✅ `users` - User accounts
- ✅ `doctors` - Doctor profiles
- ✅ `doctorusers` - Doctor user accounts
- ✅ `appointments` - Appointment records
- ✅ `healthfacilities` - Health facility data

**Note:** If a collection doesn't exist locally, it will be skipped.

---

## After Migration

Once migration is complete:

1. **Update your backend to use Atlas:**
   - Your `.env` should already have `MONGO_URI` pointing to Atlas
   - Restart your backend server

2. **Test everything:**
   - Login/Registration
   - Creating appointments
   - Viewing doctors
   - All features should work with Atlas

3. **Optional - Keep local MongoDB:**
   - You can keep local MongoDB as backup
   - Or stop it if you're fully migrated to Atlas

---

## Need Help?

- Check the full migration guide: `MONGODB_MIGRATION_GUIDE.md`
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/

