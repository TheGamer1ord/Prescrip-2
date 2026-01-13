# Connect MongoDB Atlas to VS Code

This guide will help you connect to your MongoDB Atlas cluster (cluster0) directly from VS Code.

---

## Step 1: Install MongoDB Extension for VS Code

1. Open VS Code
2. Click the **Extensions** icon (or press `Ctrl+Shift+X`)
3. Search for **"MongoDB for VS Code"** by MongoDB
4. Click **Install**
5. Wait for installation to complete

**Alternative Extension:** You can also use **"MongoDB"** by Robo3t or **"MongoDB Explorer"**

---

## Step 2: Get Your MongoDB Atlas Connection String

1. Go to [MongoDB Atlas Dashboard](https://cloud.mongodb.com/)
2. Click on your **cluster** (cluster0)
3. Click **"Connect"** button
4. Choose **"Connect your application"**
5. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

**Important:** Replace `<username>` and `<password>` with your actual credentials!

---

## Step 3: Connect via MongoDB Extension

### Method 1: Using MongoDB for VS Code Extension

1. In VS Code, press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type **"MongoDB: Connect"** and select it
3. Choose **"Add Connection"**
4. Paste your connection string:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Enter a **connection name** (e.g., "MongoDB Atlas - cluster0")
6. Press Enter
7. The connection will be saved and you can browse your databases

### Method 2: Using Connection String with Database Name

If you want to connect directly to your `prescrip` database:

1. Modify the connection string to include the database name:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/prescrip?retryWrites=true&w=majority
   ```
2. Follow the same steps as Method 1

---

## Step 4: Browse Your Database

Once connected:

1. Look for the **MongoDB** icon in the left sidebar
2. Expand your connection
3. You'll see:
   - **Databases** → `prescrip` → **Collections** → Your collections
4. Click on collections to view documents
5. Right-click for options like:
   - View documents
   - Insert document
   - Delete collection
   - Run MongoDB commands

---

## Step 5: Alternative - Using MongoDB Playground

The MongoDB extension also provides a **MongoDB Playground** where you can run queries:

1. Press `Ctrl+Shift+P`
2. Type **"MongoDB: Create MongoDB Playground"**
3. Write your queries:
   ```javascript
   // Example query
   use('prescrip');
   db.users.find().pretty();
   ```
4. Right-click and select **"Run MongoDB Command"**

---

## Troubleshooting

### Issue: "Authentication failed"
- **Solution:** 
  - Double-check username and password
  - Make sure password is URL-encoded (replace special characters)
  - Verify database user exists in Atlas

### Issue: "IP not whitelisted"
- **Solution:**
  1. Go to MongoDB Atlas → **Network Access**
  2. Click **"Add IP Address"**
  3. Click **"Add Current IP Address"** or **"Allow Access from Anywhere"** (0.0.0.0/0)
  4. Wait 1-2 minutes for changes to propagate

### Issue: "Connection timeout"
- **Solution:**
  - Check your internet connection
  - Verify firewall isn't blocking MongoDB ports
  - Try using the connection string without `?retryWrites=true&w=majority`

### Issue: Extension not showing MongoDB icon
- **Solution:**
  - Reload VS Code: `Ctrl+Shift+P` → "Developer: Reload Window"
  - Make sure extension is enabled
  - Check VS Code output panel for errors

---

## Quick Connection String Format

```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<database>?retryWrites=true&w=majority
```

**For your project:**
```
mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/prescrip?retryWrites=true&w=majority
```

---

## Security Tips

1. **Never commit connection strings** with passwords to Git
2. **Use environment variables** for connection strings
3. **Create read-only users** for development if needed
4. **Rotate passwords** regularly
5. **Use IP whitelisting** instead of allowing all IPs in production

---

## Useful VS Code MongoDB Commands

- `Ctrl+Shift+P` → **"MongoDB: Connect"** - Add new connection
- `Ctrl+Shift+P` → **"MongoDB: Create MongoDB Playground"** - Create query file
- `Ctrl+Shift+P` → **"MongoDB: Disconnect"** - Disconnect from cluster
- Right-click on collection → **"View Collection Documents"** - Browse data

---

## Alternative: Using MongoDB Compass (Desktop App)

If you prefer a standalone application:

1. Download [MongoDB Compass](https://www.mongodb.com/try/download/compass)
2. Paste your connection string
3. Connect and browse your database

This is useful if you want a dedicated MongoDB GUI outside of VS Code.

