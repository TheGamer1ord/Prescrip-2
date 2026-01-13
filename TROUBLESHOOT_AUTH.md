# Fixing MongoDB Atlas Authentication Error

## Error: "bad auth : authentication failed"

This error means your username or password is incorrect, or needs special encoding.

---

## Solution 1: Check Your Username and Password

### Step 1: Verify Database User in Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Click **"Database Access"** (left sidebar)
3. Find your database user
4. Click the **"Edit"** button (pencil icon)
5. Verify the username is correct
6. If you forgot the password, click **"Edit Password"** to reset it

### Step 2: Test Your Credentials

Your connection string should look like:
```
mongodb+srv://USERNAME:PASSWORD@cluster0.jezjje6.mongodb.net/prescrip?retryWrites=true&w=majority
```

**Important:**
- Replace `USERNAME` with your actual database username
- Replace `PASSWORD` with your actual password
- Make sure there are NO spaces

---

## Solution 2: URL-Encode Special Characters in Password

If your password contains special characters, they MUST be URL-encoded:

### Special Characters That Need Encoding:
- `@` → `%40`
- `:` → `%3A`
- `/` → `%2F`
- `?` → `%3F`
- `#` → `%23`
- `[` → `%5B`
- `]` → `%5D`
- ` ` (space) → `%20`
- `&` → `%26`
- `=` → `%3D`
- `+` → `%2B`
- `%` → `%25`

### Example:
If your password is: `MyP@ssw0rd!`
The encoded version is: `MyP%40ssw0rd%21`

**Quick way to encode:** Use an online URL encoder like:
- https://www.urlencoder.org/
- Or use the script below

---

## Solution 3: Create a New Database User (Recommended)

If you're having trouble, create a fresh user:

1. Go to Atlas → **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter a simple username (e.g., `admin` or `prescrip_user`)
5. **Generate a password** (or create one without special characters)
6. **SAVE THE PASSWORD** - you won't see it again!
7. Set privileges to **"Atlas admin"** or **"Read and write to any database"**
8. Click **"Add User"**
9. Wait 1-2 minutes for user to be created

Then use the new credentials in your connection string.

---

## Solution 4: Verify Connection String Format

Your connection string should be exactly in this format:

```
mongodb+srv://USERNAME:PASSWORD@cluster0.jezjje6.mongodb.net/prescrip?retryWrites=true&w=majority
```

**Common mistakes:**
- ❌ Missing `mongodb+srv://` prefix
- ❌ Missing `@` before cluster URL
- ❌ Wrong database name (should be `prescrip`)
- ❌ Extra spaces or characters
- ❌ Using `localhost` instead of cluster URL

---

## Solution 5: Test Connection String

### Test in VS Code:
1. Install MongoDB extension
2. Try connecting with the connection string
3. If it works there, copy it to your `.env`

### Test in MongoDB Compass:
1. Download [MongoDB Compass](https://www.mongodb.com/try/download/compass)
2. Paste your connection string
3. Click "Connect"
4. If it works, your credentials are correct

### Test with Node.js:
Create a test file `test-connection.js`:
```javascript
import mongoose from 'mongoose';

const uri = 'mongodb+srv://USERNAME:PASSWORD@cluster0.jezjje6.mongodb.net/prescrip?retryWrites=true&w=majority';

try {
  await mongoose.connect(uri);
  console.log('✅ Connected successfully!');
  await mongoose.disconnect();
} catch (error) {
  console.error('❌ Connection failed:', error.message);
}
```

---

## Solution 6: Check IP Whitelist

Even with correct credentials, you'll get auth errors if your IP isn't whitelisted:

1. Go to Atlas → **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Add Current IP Address"**
4. Or click **"Allow Access from Anywhere"** (0.0.0.0/0) for testing
5. Wait 1-2 minutes

---

## Quick Fix: Reset Password

If nothing works, reset your password:

1. Atlas → **"Database Access"**
2. Find your user → Click **"Edit"** (pencil icon)
3. Click **"Edit Password"**
4. Enter a NEW password (preferably without special characters)
5. Click **"Update User"**
6. Update your `.env` file with the new password

---

## Example .env File

```env
# Local MongoDB
LOCAL_MONGO_URI=mongodb://localhost:27017/prescrip

# Atlas MongoDB - Replace USERNAME and PASSWORD
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.jezjje6.mongodb.net/prescrip?retryWrites=true&w=majority

# If password has special characters, URL-encode them:
# Example: Password "P@ss#123" becomes "P%40ss%23123"
# MONGO_URI=mongodb+srv://admin:P%40ss%23123@cluster0.jezjje6.mongodb.net/prescrip?retryWrites=true&w=majority
```

---

## Still Having Issues?

1. **Double-check username** - it's case-sensitive
2. **Double-check password** - no typos, no extra spaces
3. **URL-encode special characters** in password
4. **Verify IP is whitelisted**
5. **Wait 2-3 minutes** after creating/changing user
6. **Try creating a new user** with simple credentials

---

## Security Note

- Never commit your `.env` file to Git
- Use strong passwords
- Rotate passwords regularly
- In production, use environment variables, not `.env` files

