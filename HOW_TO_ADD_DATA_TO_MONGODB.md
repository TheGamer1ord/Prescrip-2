# How to Add Data to MongoDB

This guide shows you different ways to add data to your MongoDB database.

## Methods Overview

1. **Through API Endpoints** (Recommended for production)
2. **Using Scripts** (For bulk imports or setup)
3. **Direct Code** (In your application code)
4. **MongoDB Compass/Shell** (Direct database access)

---

## Method 1: Through API Endpoints (Recommended)

Your backend has API endpoints to add data. Use these from your frontend or with tools like Postman.

### 1.1 Add a User

**Endpoint:** `POST /api/auth/register`

**Example using cURL:**
```bash
curl -X POST https://your-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "01712345678",
    "address": {
      "line1": "123 Main Street",
      "district": "Dhaka",
      "division": "Dhaka"
    },
    "gender": "Male"
  }'
```

**Example using JavaScript (Frontend):**
```javascript
const response = await fetch('https://your-backend.onrender.com/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    phone: '01712345678',
    address: {
      line1: '123 Main Street',
      district: 'Dhaka',
      division: 'Dhaka'
    },
    gender: 'Male'
  })
});

const data = await response.json();
console.log(data);
```

### 1.2 Add a Doctor

**Endpoint:** `POST /api/doctors`

**Example:**
```bash
curl -X POST https://your-backend.onrender.com/api/doctors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Sarah Ahmed",
    "speciality": "cardiologist",
    "degree": "MBBS, MD (Cardiology)",
    "experience": "10 years of experience",
    "about": "Expert in heart diseases",
    "fees": 500,
    "image": "https://example.com/doctor-image.jpg",
    "location": {
      "coordinates": [90.4125, 23.8103]
    },
    "address": {
      "line1": "Hospital Road",
      "line2": "Dhanmondi",
      "district": "Dhaka",
      "division": "Dhaka"
    },
    "contact": {
      "phone": ["01712345678"],
      "email": "sarah@example.com"
    },
    "availability": {
      "days": ["Monday", "Wednesday", "Friday"],
      "hours": {
        "start": "09:00",
        "end": "17:00"
      }
    },
    "verified": true
  }'
```

**Note:** Location coordinates are `[longitude, latitude]` (not lat, lng!)

### 1.3 Add an Appointment

**Endpoint:** `POST /api/appointments`

**Example:**
```bash
curl -X POST https://your-backend.onrender.com/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "doctor": "DOCTOR_ID_HERE",
    "date": "2024-01-20",
    "time": "10:00",
    "day": "Saturday"
  }'
```

### 1.4 Register a Doctor User

**Endpoint:** `POST /api/doctor-auth/register`

**Example:**
```bash
curl -X POST https://your-backend.onrender.com/api/doctor-auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Sarah Ahmed",
    "email": "sarah@example.com",
    "profession": "cardiologist",
    "password": "password123"
  }'
```

---

## Method 2: Using Scripts

You have scripts in `backend/scripts/` folder for bulk data operations.

### 2.1 Create a Doctor Account Script

**File:** `backend/scripts/createDoctorAccount.js`

**Run it:**
```bash
cd backend
npm run create-doctor-account
```

This creates a doctor and doctor user account.

### 2.2 Create Your Own Script

Create a new file: `backend/scripts/addSampleData.js`

```javascript
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Doctor from '../src/models/Doctor.js';
import User from '../src/models/User.js';
import config from '../src/config/index.js';

dotenv.config();

const addSampleData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoURI);
    console.log('✅ Connected to MongoDB');

    // Add a new doctor
    const doctor = new Doctor({
      name: 'Dr. Test Doctor',
      speciality: 'neurologist',
      degree: 'MBBS, MD',
      experience: '5 years',
      about: 'Test doctor for development',
      fees: 300,
      location: {
        type: 'Point',
        coordinates: [90.4125, 23.8103] // [lng, lat] - Dhaka
      },
      address: {
        line1: '123 Test Street',
        district: 'Dhaka',
        division: 'Dhaka'
      },
      contact: {
        phone: ['01712345678'],
        email: 'testdoctor@example.com'
      },
      verified: true,
      active: true
    });

    await doctor.save();
    console.log('✅ Doctor created:', doctor.name);

    // Add a new user
    const user = new User({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
      phone: '01712345678',
      address: {
        line1: '456 User Street',
        district: 'Dhaka'
      },
      role: 'user'
    });

    await user.save();
    console.log('✅ User created:', user.name);

    // Close connection
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

addSampleData();
```

**Add to package.json scripts:**
```json
"scripts": {
  "add-sample-data": "babel-node scripts/addSampleData.js"
}
```

**Run it:**
```bash
npm run add-sample-data
```

---

## Method 3: Direct Code (In Your Application)

You can add data directly in your route handlers or services.

### 3.1 Example: Adding Data in a Route

```javascript
import Doctor from '../models/Doctor.js';
import mongoose from 'mongoose';

// In your route handler
router.post('/add-doctor', async (req, res) => {
  try {
    const doctorData = {
      name: req.body.name,
      speciality: req.body.speciality,
      degree: req.body.degree,
      fees: req.body.fees,
      location: {
        type: 'Point',
        coordinates: [req.body.longitude, req.body.latitude]
      },
      address: {
        line1: req.body.address
      },
      verified: false
    };

    const doctor = new Doctor(doctorData);
    await doctor.save();

    res.status(201).json({
      message: 'Doctor added successfully',
      doctor: doctor
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error adding doctor',
      error: error.message
    });
  }
});
```

### 3.2 Example: Adding Multiple Documents

```javascript
import Doctor from '../models/Doctor.js';

// Add multiple doctors at once
const addMultipleDoctors = async () => {
  const doctors = [
    {
      name: 'Dr. Doctor 1',
      speciality: 'neurologist',
      degree: 'MBBS',
      fees: 300,
      location: { type: 'Point', coordinates: [90.4, 23.8] },
      address: { line1: 'Address 1' }
    },
    {
      name: 'Dr. Doctor 2',
      speciality: 'cardiologist',
      degree: 'MBBS, MD',
      fees: 500,
      location: { type: 'Point', coordinates: [90.5, 23.9] },
      address: { line1: 'Address 2' }
    }
  ];

  try {
    const savedDoctors = await Doctor.insertMany(doctors);
    console.log('✅ Added', savedDoctors.length, 'doctors');
    return savedDoctors;
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
};
```

---

## Method 4: Using MongoDB Compass or Shell

### 4.1 Using MongoDB Compass (GUI Tool)

1. **Download MongoDB Compass:**
   - https://www.mongodb.com/products/compass

2. **Connect to Your Atlas Cluster:**
   - Get connection string from MongoDB Atlas
   - Paste it in Compass

3. **Navigate to Your Database:**
   - Select your database
   - Select your collection (e.g., `doctors`, `users`)

4. **Add Document:**
   - Click "INSERT DOCUMENT"
   - Enter JSON data
   - Click "INSERT"

**Example Document for `doctors` collection:**
```json
{
  "name": "Dr. Test Doctor",
  "speciality": "neurologist",
  "degree": "MBBS, MD",
  "fees": 300,
  "location": {
    "type": "Point",
    "coordinates": [90.4125, 23.8103]
  },
  "address": {
    "line1": "123 Test Street",
    "district": "Dhaka"
  },
  "contact": {
    "phone": ["01712345678"],
    "email": "test@example.com"
  },
  "verified": true,
  "active": true,
  "createdAt": "2024-01-13T00:00:00.000Z"
}
```

### 4.2 Using MongoDB Shell (mongosh)

```bash
# Connect to your Atlas cluster
mongosh "mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/prescrip"

# Switch to your database
use prescrip

# Insert a document
db.doctors.insertOne({
  name: "Dr. Test Doctor",
  speciality: "neurologist",
  degree: "MBBS, MD",
  fees: 300,
  location: {
    type: "Point",
    coordinates: [90.4125, 23.8103]
  },
  address: {
    line1: "123 Test Street",
    district: "Dhaka"
  },
  contact: {
    phone: ["01712345678"],
    email: "test@example.com"
  },
  verified: true,
  active: true
})

# Insert multiple documents
db.doctors.insertMany([
  {
    name: "Dr. Doctor 1",
    speciality: "cardiologist",
    degree: "MBBS",
    fees: 400,
    location: { type: "Point", coordinates: [90.4, 23.8] },
    address: { line1: "Address 1" }
  },
  {
    name: "Dr. Doctor 2",
    speciality: "pediatrician",
    degree: "MBBS, MD",
    fees: 350,
    location: { type: "Point", coordinates: [90.5, 23.9] },
    address: { line1: "Address 2" }
  }
])
```

---

## Important Notes

### 1. Location Coordinates Format
- Always use `[longitude, latitude]` (not `[latitude, longitude]`)
- Example: `[90.4125, 23.8103]` for Dhaka
- Longitude: -180 to 180
- Latitude: -90 to 90

### 2. Required Fields
Check your models for required fields:
- **User:** `name`, `email`, `password`
- **Doctor:** `name`, `speciality`, `degree`, `fees`, `location.coordinates`, `address.line1`
- **Appointment:** `user`, `doctor`, `date`, `time`, `day`

### 3. Password Hashing
- User passwords are automatically hashed (see `User.js` model)
- Don't store plain text passwords
- Use the API endpoints or let the model handle hashing

### 4. ObjectId References
When linking documents (e.g., appointment to doctor):
```javascript
// Use the actual ObjectId
doctor: "507f1f77bcf86cd799439011"  // Valid ObjectId

// Or use mongoose.Types.ObjectId
doctor: mongoose.Types.ObjectId("507f1f77bcf86cd799439011")
```

### 5. Dates
```javascript
// Use ISO date strings or Date objects
date: "2024-01-20"
// or
date: new Date("2024-01-20")
```

---

## Quick Reference: Available Models

1. **User** - Regular users/patients
2. **Doctor** - Doctor profiles
3. **DoctorUser** - Doctor login accounts
4. **Appointment** - Appointments between users and doctors
5. **HealthFacility** - Health facilities/hospitals

---

## Testing Your Data

After adding data, verify it:

```bash
# Check if doctor was added
curl https://your-backend.onrender.com/api/doctors

# Check specific doctor
curl https://your-backend.onrender.com/api/doctors/DOCTOR_ID
```

Or use MongoDB Compass to browse your collections.

---

## Troubleshooting

### Error: "Validation failed"
- Check required fields are provided
- Check data types match schema
- Check enum values (e.g., `role` must be 'user' or 'admin')

### Error: "Duplicate key error"
- Email or unique field already exists
- Use different email or update existing document

### Error: "Cannot read property"
- Check that referenced ObjectIds exist
- Verify relationships between documents

---

## Summary

- **API Endpoints** → Best for production, frontend integration
- **Scripts** → Best for bulk imports, setup, migrations
- **Direct Code** → Best for application logic, services
- **MongoDB Compass/Shell** → Best for quick testing, debugging

Choose the method that fits your needs!

