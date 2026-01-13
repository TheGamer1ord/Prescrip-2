# MongoDB Migration Guide: Local to MongoDB Atlas (Cloud)

This guide will help you transfer your local MongoDB database to MongoDB Cloud (MongoDB Atlas).

## Prerequisites

1. **MongoDB installed locally** (for mongodump/mongorestore)
2. **MongoDB Atlas account** (free tier available)
3. **Your local database name**: `prescrip` (based on your .env file)

---

## Step 1: Set Up MongoDB Atlas

### 1.1 Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click **"Try Free"** or **"Sign Up"**
3. Create your account (you can use Google/GitHub to sign up)

### 1.2 Create a Cluster
1. After logging in, click **"Build a Database"**
2. Choose **"M0 FREE"** (Free Shared Cluster) - perfect for development
3. Select a **Cloud Provider** (AWS, Google Cloud, or Azure)
4. Choose a **Region** closest to you
5. Click **"Create"** (takes 3-5 minutes)

### 1.3 Configure Database Access
1. Go to **"Database Access"** (left sidebar)
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter a username and generate a secure password (SAVE THIS!)
5. Set privileges to **"Atlas admin"** or **"Read and write to any database"**
6. Click **"Add User"**

### 1.4 Configure Network Access
1. Go to **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development) or add your specific IP
4. Click **"Confirm"**

### 1.5 Get Your Connection String
1. Go to **"Database"** (left sidebar)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

---

## Step 2: Export Your Local MongoDB Data

### Option A: Export Entire Database (Recommended)

Open Command Prompt or PowerShell and run:

```bash
# Navigate to MongoDB bin directory (if MongoDB is installed locally)
# Or use mongodump if it's in your PATH

# Export the entire 'prescrip' database
mongodump --uri="mongodb://localhost:27017/prescrip" --out=./mongodb_backup

# This creates a folder 'mongodb_backup' with all your data
```

**If mongodump is not in PATH:**
- Windows: Usually at `C:\Program Files\MongoDB\Server\<version>\bin\mongodump.exe`
- Or add MongoDB bin to your system PATH

### Option B: Export Specific Collections

If you only want specific collections:

```bash
# Export a specific collection
mongoexport --uri="mongodb://localhost:27017/prescrip" --collection=users --out=users.json
mongoexport --uri="mongodb://localhost:27017/prescrip" --collection=doctors --out=doctors.json
mongoexport --uri="mongodb://localhost:27017/prescrip" --collection=appointments --out=appointments.json
# ... repeat for each collection
```

---

## Step 3: Import Data to MongoDB Atlas

### Option A: Import Entire Database (Recommended)

```bash
# Replace <username>, <password>, and <cluster-url> with your Atlas credentials
mongorestore --uri="mongodb+srv://<username>:<password>@<cluster-url>/prescrip" ./mongodb_backup/prescrip

# Example:
# mongorestore --uri="mongodb+srv://myuser:mypass@cluster0.xxxxx.mongodb.net/prescrip" ./mongodb_backup/prescrip
```

### Option B: Import Specific Collections

```bash
# Import each collection
mongoimport --uri="mongodb+srv://<username>:<password>@<cluster-url>/prescrip" --collection=users --file=users.json
mongoimport --uri="mongodb+srv://<username>:<password>@<cluster-url>/prescrip" --collection=doctors --file=doctors.json
# ... repeat for each collection
```

---

## Step 4: Update Your Project Configuration

### 4.1 Update Backend .env File

Edit `backend/.env` and update the `MONGO_URI`:

```env
# Old (Local MongoDB)
# MONGO_URI=mongodb://localhost:27017/prescrip

# New (MongoDB Atlas)
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/prescrip?retryWrites=true&w=majority
```

**Important:** Replace:
- `<username>` with your Atlas database username
- `<password>` with your Atlas database password
- `<cluster-url>` with your cluster URL (e.g., `cluster0.xxxxx.mongodb.net`)

### 4.2 Restart Your Backend Server

```bash
cd backend
npm run dev
```

---

## Step 5: Verify Migration

### 5.1 Check Data in Atlas
1. Go to MongoDB Atlas dashboard
2. Click **"Browse Collections"**
3. Verify all your collections and data are present

### 5.2 Test Your Application
1. Start your backend: `cd backend && npm run dev`
2. Start your frontend: `cd frontend && npm run dev`
3. Test login, registration, and data operations
4. Check that data persists correctly

---

## Alternative: Using MongoDB Compass (GUI Method)

If you prefer a graphical interface:

### 1. Download MongoDB Compass
- Download from: https://www.mongodb.com/try/download/compass

### 2. Export from Local
1. Connect to local MongoDB: `mongodb://localhost:27017`
2. Select your `prescrip` database
3. Export collections as JSON or CSV

### 3. Import to Atlas
1. Connect to Atlas using your connection string
2. Import the exported files into the `prescrip` database

---

## Troubleshooting

### Issue: "Authentication failed"
- **Solution:** Double-check your username and password in the connection string
- Make sure you URL-encode special characters in the password

### Issue: "IP not whitelisted"
- **Solution:** Go to Network Access in Atlas and add your IP address
- Or temporarily allow access from anywhere (0.0.0.0/0) for testing

### Issue: "Connection timeout"
- **Solution:** Check your firewall settings
- Verify the cluster is running in Atlas dashboard

### Issue: "Database not found"
- **Solution:** MongoDB Atlas creates databases automatically when you first write data
- Make sure you're using the correct database name in the connection string

### Issue: "mongodump not found"
- **Solution:** Install MongoDB Database Tools: https://www.mongodb.com/try/download/database-tools
- Or use MongoDB Compass GUI method instead

---

## Quick Reference Commands

```bash
# Export entire database
mongodump --uri="mongodb://localhost:27017/prescrip" --out=./mongodb_backup

# Import to Atlas
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/prescrip" ./mongodb_backup/prescrip

# Export single collection
mongoexport --uri="mongodb://localhost:27017/prescrip" --collection=users --out=users.json

# Import single collection
mongoimport --uri="mongodb+srv://user:pass@cluster.mongodb.net/prescrip" --collection=users --file=users.json
```

---

## Security Best Practices

1. **Never commit your .env file** to version control
2. **Use environment variables** for production
3. **Rotate passwords** regularly
4. **Restrict IP access** in production (don't use 0.0.0.0/0)
5. **Use MongoDB Atlas encryption** for sensitive data

---

## Need Help?

- MongoDB Atlas Documentation: https://docs.atlas.mongodb.com/
- MongoDB Community Forums: https://developer.mongodb.com/community/forums/

