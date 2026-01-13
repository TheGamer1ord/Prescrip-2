# Fix Your .env File

## Problem Found

Your `MONGO_URI` in `backend/.env` is currently set to:
```
MONGO_URI=mongodb://localhost:27017/prescrip
```

This is your **local** MongoDB, not Atlas! That's why the migration is trying to connect to localhost for Atlas.

---

## Solution: Update Your .env File

Edit `backend/.env` and make sure you have **TWO separate connection strings**:

```env
# Local MongoDB (for reading data FROM)
LOCAL_MONGO_URI=mongodb://localhost:27017/prescrip

# Atlas MongoDB (for writing data TO) - THIS IS THE ONE YOU NEED TO FIX
MONGO_URI=mongodb+srv://username:password@cluster0.jezjje6.mongodb.net/prescrip?retryWrites=true&w=majority
```

---

## Steps to Fix

1. **Open** `backend/.env` file

2. **Find** the line with `MONGO_URI=`

3. **Replace** it with your Atlas connection string:
   ```
   MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.jezjje6.mongodb.net/prescrip?retryWrites=true&w=majority
   ```

4. **Replace:**
   - `YOUR_USERNAME` with your Atlas database username
   - `YOUR_PASSWORD` with your Atlas database password
   - If password has special characters, URL-encode them (use `node scripts/encodePassword.js "your@pass"`)

5. **Save** the file

6. **Run migration again:**
   ```bash
   cd backend
   npm run migrate-to-atlas
   ```

---

## Example .env File

```env
# Server Configuration
PORT=2222
NODE_ENV=development

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Local MongoDB (source - where your data is now)
LOCAL_MONGO_URI=mongodb://localhost:27017/prescrip

# Atlas MongoDB (destination - where data will go)
MONGO_URI=mongodb+srv://prescrip_admin:MySecurePass123@cluster0.jezjje6.mongodb.net/prescrip?retryWrites=true&w=majority

# Email Configuration (Optional)
SMTP_USER=user@example.com
SMTP_PASS=password
```

---

## Important Notes

- ✅ `LOCAL_MONGO_URI` = Your local MongoDB (where data comes FROM)
- ✅ `MONGO_URI` = Your Atlas MongoDB (where data goes TO)
- ✅ Both should be different!
- ✅ `MONGO_URI` should start with `mongodb+srv://`
- ✅ `MONGO_URI` should contain `cluster0.jezjje6.mongodb.net` (your cluster)

---

## After Updating

1. Save the `.env` file
2. Run: `cd backend && npm run migrate-to-atlas`
3. You should see the correct Atlas URI in the output

