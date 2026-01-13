# Fix MONGO_URI in .env File

## Problem Found

Your `.env` file has:
```
MONGO_URI=MONGO_URI=mongodb+srv://...
```

This is wrong! It should be:
```
MONGO_URI=mongodb+srv://...
```

Also noticed: "presscrip" should be "prescrip" (typo in database name).

---

## How to Fix

### Step 1: Open `backend/.env`

### Step 2: Find the line with `MONGO_URI=`

### Step 3: Make sure it looks like this (NO duplicate "MONGO_URI="):

```env
MONGO_URI=mongodb+srv://username:password@cluster0.jezjje6.mongodb.net/prescrip?retryWrites=true&w=majority
```

**NOT:**
```env
MONGO_URI=MONGO_URI=mongodb+srv://...  ❌ WRONG!
```

### Step 4: Also check the database name is "prescrip" (not "presscrip")

### Step 5: Save the file

### Step 6: Run migration again:
```bash
cd backend
npm run migrate-to-atlas
```

---

## Correct .env Format

```env
# Server Configuration
PORT=2222
NODE_ENV=development

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Local MongoDB (source)
LOCAL_MONGO_URI=mongodb://localhost:27017/prescrip

# Atlas MongoDB (destination) - CORRECT FORMAT
MONGO_URI=mongodb+srv://username:password@cluster0.jezjje6.mongodb.net/prescrip?retryWrites=true&w=majority

# Email Configuration (Optional)
SMTP_USER=user@example.com
SMTP_PASS=password
```

---

## After Fixing

1. Save `.env` file
2. Run: `cd backend && npm run migrate-to-atlas`
3. You should see successful migration
4. Check Atlas to see your collections!

