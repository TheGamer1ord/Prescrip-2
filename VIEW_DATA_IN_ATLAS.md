# How to View Migrated Data in MongoDB Atlas

There are several ways to view your data in MongoDB Atlas. Here are the easiest methods:

---

## Method 1: MongoDB Atlas Web Interface (Easiest)

### Step 1: Log in to Atlas
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Log in with your account

### Step 2: Browse Collections
1. Click on your **cluster** (cluster0)
2. Click the **"Browse Collections"** button
   - Or go to: **"Collections"** tab in the left sidebar

### Step 3: View Your Data
1. You'll see a list of databases
2. Click on **"prescrip"** database (your database name)
3. You'll see all your collections:
   - `users`
   - `doctors`
   - `doctorusers`
   - `appointments`
   - `healthfacilities`
4. Click on any collection to view the documents
5. You can:
   - View all documents in the collection
   - Filter documents
   - Edit documents
   - Add new documents
   - Delete documents

### Step 4: View Document Details
- Click on any document to see its full details
- You can edit fields directly in the interface
- Click **"Update"** to save changes

---

## Method 2: VS Code MongoDB Extension

### Step 1: Install Extension
1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X`)
3. Search for **"MongoDB for VS Code"**
4. Click **Install**

### Step 2: Connect to Atlas
1. Press `Ctrl+Shift+P`
2. Type **"MongoDB: Connect"**
3. Paste your Atlas connection string:
   ```
   mongodb+srv://username:password@cluster0.jezjje6.mongodb.net/prescrip?retryWrites=true&w=majority
   ```
4. Enter a connection name (e.g., "Atlas - cluster0")
5. Press Enter

### Step 3: Browse Data
1. Look for the **MongoDB** icon in the left sidebar
2. Expand your connection
3. Expand **"Databases"** → **"prescrip"**
4. Expand **"Collections"**
5. Click on any collection to view documents
6. Right-click for options:
   - View Collection Documents
   - Insert Document
   - Delete Collection

---

## Method 3: MongoDB Compass (Desktop App)

### Step 1: Download Compass
1. Go to [MongoDB Compass Download](https://www.mongodb.com/try/download/compass)
2. Download and install MongoDB Compass

### Step 2: Connect
1. Open MongoDB Compass
2. Paste your Atlas connection string:
   ```
   mongodb+srv://username:password@cluster0.jezjje6.mongodb.net/prescrip?retryWrites=true&w=majority
   ```
3. Click **"Connect"**

### Step 3: Browse Data
1. Select **"prescrip"** database
2. Click on any collection
3. View, filter, and edit documents
4. Use the query bar to search/filter

---

## Method 4: Using MongoDB Playground in VS Code

### Step 1: Create Playground
1. In VS Code, press `Ctrl+Shift+P`
2. Type **"MongoDB: Create MongoDB Playground"**
3. A new file opens with MongoDB query syntax

### Step 2: Write Queries
```javascript
// View all users
use('prescrip');
db.users.find().pretty();

// View all doctors
db.doctors.find().pretty();

// Count documents in a collection
db.appointments.countDocuments();

// Find specific document
db.users.findOne({ email: "user@example.com" });

// View with limit
db.doctors.find().limit(10).pretty();
```

### Step 3: Run Queries
1. Right-click in the playground file
2. Select **"Run MongoDB Command"**
3. Results appear in the output panel

---

## Quick Queries to View Your Data

### View All Collections
```javascript
use('prescrip');
show collections;
```

### Count Documents in Each Collection
```javascript
use('prescrip');
db.users.countDocuments();
db.doctors.countDocuments();
db.appointments.countDocuments();
db.doctorusers.countDocuments();
db.healthfacilities.countDocuments();
```

### View All Documents (Limited)
```javascript
use('prescrip');
db.users.find().limit(20).pretty();
db.doctors.find().limit(20).pretty();
```

### Search for Specific Data
```javascript
use('prescrip');
// Find user by email
db.users.find({ email: "user@example.com" }).pretty();

// Find doctors by specialty
db.doctors.find({ speciality: "gynecologist" }).pretty();
```

---

## What You Should See

After migration, you should see these collections in your `prescrip` database:

1. **users** - All user accounts
2. **doctors** - Doctor profiles
3. **doctorusers** - Doctor user accounts
4. **appointments** - Appointment records
5. **healthfacilities** - Health facility data

Each collection should contain the documents that were in your local MongoDB.

---

## Troubleshooting

### No Collections Visible
- **Check:** Did the migration complete successfully?
- **Check:** Are you looking in the correct database (`prescrip`)?
- **Check:** Did you migrate the data? Run `npm run migrate-to-atlas` if not

### Empty Collections
- **Check:** Did your local MongoDB have data?
- **Check:** Migration might have skipped empty collections (this is normal)

### Can't Connect
- **Check:** Your IP is whitelisted in Atlas Network Access
- **Check:** Your connection string is correct
- **Check:** Username and password are correct

---

## Pro Tips

1. **Use Filters:** In Atlas web interface, use the filter bar to search for specific documents
2. **Export Data:** You can export collections as JSON or CSV from Atlas
3. **Monitor Usage:** Check Atlas dashboard for database size and usage statistics
4. **Set Up Alerts:** Configure alerts in Atlas for database performance

---

## Recommended Method

**For beginners:** Use **Method 1 (Atlas Web Interface)** - it's the easiest and requires no additional software.

**For developers:** Use **Method 2 (VS Code Extension)** - integrates with your development workflow.

