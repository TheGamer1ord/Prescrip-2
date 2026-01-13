# Starting Project with MongoDB Atlas

## Quick Checklist

Before starting, make sure:

1. ✅ **MONGO_URI in `.env` is set to Atlas:**
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster0.jezjje6.mongodb.net/prescrip?retryWrites=true&w=majority
   ```

2. ✅ **Your IP is whitelisted in Atlas:**
   - Go to Atlas → Network Access
   - Make sure your IP is added

3. ✅ **Atlas credentials are correct:**
   - Username and password are correct
   - Password is URL-encoded if it has special characters

---

## Starting the Project

### Step 1: Update .env (if not done)

Edit `backend/.env`:
```env
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.jezjje6.mongodb.net/prescrip?retryWrites=true&w=majority
```

### Step 2: Start Backend

```bash
cd backend
npm run dev
```

### Step 3: Start Frontend (in a new terminal)

```bash
cd frontend
npm run dev
```

---

## Verify Atlas Connection

Once backend starts, you should see:
- ✅ "Connected to Mongodb" in the logs
- ✅ Server running on port 2222
- ✅ No connection errors

If you see errors:
- Check your connection string
- Verify IP is whitelisted
- Check username/password

---

## After Starting

- Backend: http://localhost:2222
- Frontend: http://localhost:5173
- Health Check: http://localhost:2222/api/health/live

All data will now be stored in MongoDB Atlas (cloud) instead of local MongoDB!

