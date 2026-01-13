# How to Run the Migration

## Where to Run the Migration

Run the migration command from the **`backend`** directory of your project.

---

## Step-by-Step Instructions

### Option 1: Using Command Prompt (Windows)

1. **Open Command Prompt** (or PowerShell)

2. **Navigate to the backend directory:**
   ```bash
   cd F:\PRESCPITO-main\backend
   ```

3. **Run the migration:**
   ```bash
   npm run migrate-to-atlas
   ```

### Option 2: Using VS Code Terminal

1. **Open VS Code**
2. **Open your project folder** (`F:\PRESCPITO-main`)
3. **Open the integrated terminal:**
   - Press `` Ctrl+` `` (backtick key)
   - Or go to: **Terminal** → **New Terminal**
4. **Navigate to backend directory:**
   ```bash
   cd backend
   ```
5. **Run the migration:**
   ```bash
   npm run migrate-to-atlas
   ```

### Option 3: Using PowerShell

1. **Open PowerShell**
2. **Navigate to backend:**
   ```powershell
   cd F:\PRESCPITO-main\backend
   ```
3. **Run the migration:**
   ```powershell
   npm run migrate-to-atlas
   ```

---

## What You'll See

When you run the migration, you'll see output like this:

```
🚀 Starting MongoDB Migration: Local → Atlas

📍 Local URI: mongodb://localhost:27017/prescrip
☁️  Atlas URI: mongodb+srv://***:***@cluster0.jezjje6.mongodb.net/...

🔌 Connecting to local MongoDB...
   ✅ Connected to local MongoDB

🔌 Connecting to MongoDB Atlas...
   ✅ Connected to MongoDB Atlas

📦 Migrating collection: users...
   📊 Found 5 documents
   📥 Fetched 5 documents from local database
   ✅ Successfully inserted 5 documents into Atlas

📦 Migrating collection: doctors...
   ...

📊 MIGRATION SUMMARY
============================================================
   ✅ users: 5 documents migrated
   ✅ doctors: 10 documents migrated
   ✅ appointments: 3 documents migrated
============================================================
✅ Total documents migrated: 18

🎉 Migration completed!
```

---

## Important Notes

1. **Make sure you're in the `backend` directory** - not the root project directory
2. **Local MongoDB must be running** - check with `netstat -ano | findstr ":27017"`
3. **Your `.env` file must have `MONGO_URI` set** with your Atlas connection string
4. **Your IP must be whitelisted** in MongoDB Atlas Network Access

---

## Troubleshooting

### Error: "Cannot find module"
- **Solution:** Make sure you're in the `backend` directory
- Run `npm install` if you haven't already

### Error: "MONGO_URI not found"
- **Solution:** Check that `MONGO_URI` is set in `backend/.env`
- Make sure the file is named `.env` (not `.env.txt`)

### Error: "Connection failed"
- **Solution:** 
  - Verify your Atlas connection string
  - Check that your IP is whitelisted
  - Make sure local MongoDB is running

---

## Quick Command Reference

```bash
# Navigate to backend
cd F:\PRESCPITO-main\backend

# Run migration
npm run migrate-to-atlas

# Check if local MongoDB is running
netstat -ano | findstr ":27017"
```

---

## After Migration

Once migration completes successfully:

1. ✅ Your data is now in MongoDB Atlas
2. ✅ Your backend is already configured to use Atlas (via `MONGO_URI` in `.env`)
3. ✅ Restart your backend server to use Atlas:
   ```bash
   cd backend
   npm run dev
   ```
4. ✅ Test your application to verify everything works

---

## Need Help?

If you encounter any errors, check:
- `FIX_AUTH_ERROR.md` - For authentication issues
- `MIGRATION_INSTRUCTIONS.md` - For detailed migration steps
- `TROUBLESHOOT_AUTH.md` - For connection problems

