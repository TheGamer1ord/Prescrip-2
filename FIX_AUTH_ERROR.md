# Fix "bad auth : authentication failed" Error

## Your Cluster: cluster0.jezjje6.mongodb.net

This error means your username or password is incorrect. Here's how to fix it:

---

## 🔧 Quick Fix Steps

### Step 1: Verify Your Database User in Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Click **"Database Access"** (left sidebar)
3. Find your database user
4. Check the **username** - it's case-sensitive!
5. If you forgot the password, click **"Edit"** → **"Edit Password"** to reset it

### Step 2: Check Your Password for Special Characters

If your password has special characters like `@`, `#`, `%`, `&`, etc., they MUST be URL-encoded.

**Common special characters that need encoding:**
- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `=` → `%3D`
- `/` → `%2F`
- `?` → `%3F`
- `:` → `%3A`

### Step 3: Encode Your Password

**Option A: Use the provided script:**
```bash
cd backend
node scripts/encodePassword.js "your@password#123"
```

**Option B: Use online encoder:**
- Go to https://www.urlencoder.org/
- Paste your password
- Copy the encoded version

**Option C: Use Node.js directly:**
```bash
node -e "console.log(encodeURIComponent('your@password#123'))"
```

### Step 4: Update Your .env File

Edit `backend/.env`:

```env
# Example with encoded password
MONGO_URI=mongodb+srv://username:encoded_password@cluster0.jezjje6.mongodb.net/prescrip?retryWrites=true&w=majority
```

**Replace:**
- `username` with your Atlas database username
- `encoded_password` with the URL-encoded password
- Make sure `/prescrip` is in the connection string

---

## 🆕 Alternative: Create a New User (Easiest)

If encoding is confusing, create a new user with a simple password:

1. Go to Atlas → **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Username: `prescrip_admin` (or any name)
5. Password: Create a password **WITHOUT special characters** (e.g., `MySecurePass123`)
6. Privileges: **"Atlas admin"** or **"Read and write to any database"**
7. Click **"Add User"**
8. Wait 1-2 minutes

Then use the simple password in your connection string (no encoding needed):
```env
MONGO_URI=mongodb+srv://prescrip_admin:MySecurePass123@cluster0.jezjje6.mongodb.net/prescrip?retryWrites=true&w=majority
```

---

## ✅ Verify Your Connection String Format

Your connection string should look EXACTLY like this:

```
mongodb+srv://USERNAME:PASSWORD@cluster0.jezjje6.mongodb.net/prescrip?retryWrites=true&w=majority
```

**Check for:**
- ✅ Starts with `mongodb+srv://`
- ✅ Username and password separated by `:`
- ✅ `@` before the cluster URL
- ✅ Database name `/prescrip` after cluster URL
- ✅ Query parameters `?retryWrites=true&w=majority`
- ✅ NO spaces anywhere
- ✅ NO quotes around the connection string in .env

---

## 🧪 Test Your Connection

### Test 1: Using the Migration Script
```bash
cd backend
npm run migrate-to-atlas
```

### Test 2: Using VS Code MongoDB Extension
1. Install "MongoDB for VS Code" extension
2. Press `Ctrl+Shift+P`
3. Type "MongoDB: Connect"
4. Paste your connection string
5. If it connects, your credentials are correct!

### Test 3: Using MongoDB Compass
1. Download [MongoDB Compass](https://www.mongodb.com/try/download/compass)
2. Paste your connection string
3. Click "Connect"

---

## 🔍 Common Mistakes

### ❌ Wrong Format:
```env
MONGO_URI="mongodb+srv://user:pass@cluster0.jezjje6.mongodb.net/prescrip"
# Has quotes - remove them!
```

### ✅ Correct Format:
```env
MONGO_URI=mongodb+srv://user:pass@cluster0.jezjje6.mongodb.net/prescrip?retryWrites=true&w=majority
# No quotes, has query parameters
```

### ❌ Missing Database Name:
```env
MONGO_URI=mongodb+srv://user:pass@cluster0.jezjje6.mongodb.net?retryWrites=true&w=majority
# Missing /prescrip
```

### ✅ With Database Name:
```env
MONGO_URI=mongodb+srv://user:pass@cluster0.jezjje6.mongodb.net/prescrip?retryWrites=true&w=majority
# Has /prescrip
```

---

## 🚨 Still Not Working?

1. **Double-check username** - it's case-sensitive (e.g., `Admin` ≠ `admin`)
2. **Double-check password** - no typos, no extra spaces
3. **Verify IP whitelist** - Go to Atlas → Network Access → Add your IP
4. **Wait 2-3 minutes** after creating/changing user
5. **Try creating a new user** with simple credentials (no special chars)

---

## 📝 Example .env File

```env
# Local MongoDB
LOCAL_MONGO_URI=mongodb://localhost:27017/prescrip

# Atlas MongoDB - Replace with your actual credentials
# If password has special characters, use the encodePassword.js script first
MONGO_URI=mongodb+srv://your_username:your_password@cluster0.jezjje6.mongodb.net/prescrip?retryWrites=true&w=majority
```

---

## 💡 Pro Tip

Create a user with a password that has NO special characters to avoid encoding issues:
- ✅ Good: `MySecurePassword123`
- ❌ Bad: `MyP@ssw0rd#123`

This way you don't need to URL-encode anything!

