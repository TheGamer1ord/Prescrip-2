# Doctor API Guide

This guide explains how to add and manage doctors with their locations in the system.

## API Endpoints

Base URL: `http://localhost:2222/api/doctors`

### 1. Add a New Doctor

**POST** `/api/doctors`

Adds a new doctor with their location and details.

#### Request Body Example:

```json
{
  "name": "Dr. Alim Uddin",
  "speciality": "neurologist",
  "degree": "MBBS, MD (Neurology), CCD (BIRDEM)",
  "experience": "Fellowship Training in ACS & EMG and Neuromuscular Disease Neurology",
  "about": "Experienced neurologist specializing in brain and nerve disorders",
  "fees": 500,
  "image": "https://example.com/images/doctor1.jpg",
  "location": {
    "coordinates": [91.1809, 23.4607]
  },
  "address": {
    "line1": "17th Cross, Richmond Circle",
    "line2": "Ring Road",
    "upazila": "Cumilla Sadar",
    "district": "Cumilla",
    "division": "Chittagong"
  },
  "contact": {
    "phone": ["01712345678", "01812345678"],
    "email": "dr.alim@example.com"
  },
  "availability": {
    "days": ["Monday", "Wednesday", "Friday"],
    "hours": {
      "start": "09:00",
      "end": "17:00"
    }
  },
  "verified": true
}
```

#### cURL Example:

```bash
curl -X POST http://localhost:2222/api/doctors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Alim Uddin",
    "speciality": "neurologist",
    "degree": "MBBS, MD (Neurology)",
    "fees": 500,
    "location": {
      "coordinates": [91.1809, 23.4607]
    },
    "address": {
      "line1": "17th Cross, Richmond Circle",
      "district": "Cumilla",
      "division": "Chittagong"
    }
  }'
```

#### JavaScript/Node.js Example:

```javascript
const axios = require('axios');

async function addDoctor() {
  try {
    const response = await axios.post('http://localhost:2222/api/doctors', {
      name: 'Dr. Alim Uddin',
      speciality: 'neurologist',
      degree: 'MBBS, MD (Neurology)',
      experience: '15 years of experience',
      fees: 500,
      location: {
        coordinates: [91.1809, 23.4607] // [longitude, latitude]
      },
      address: {
        line1: '17th Cross, Richmond Circle',
        line2: 'Ring Road',
        district: 'Cumilla',
        division: 'Chittagong'
      },
      contact: {
        phone: ['01712345678'],
        email: 'dr.alim@example.com'
      }
    });
    
    console.log('Doctor added:', response.data);
  } catch (error) {
    console.error('Error:', error.response.data);
  }
}

addDoctor();
```

#### Response (201 Created):

```json
{
  "message": "Doctor created successfully",
  "doctor": {
    "_id": "64a1b2c3d4e5f6a7b8c9d0e1",
    "name": "Dr. Alim Uddin",
    "speciality": "neurologist",
    "degree": "MBBS, MD (Neurology)",
    "fees": 500,
    "location": {
      "type": "Point",
      "coordinates": [91.1809, 23.4607]
    },
    "verified": false,
    "active": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "lastUpdated": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 2. Get All Doctors

**GET** `/api/doctors`

Retrieve all doctors with optional filters.

#### Query Parameters:

- `speciality` - Filter by speciality (e.g., "neurologist")
- `district` - Filter by district
- `verified` - Filter by verification status (true/false)
- `active` - Filter by active status (default: true)

#### Examples:

```bash
# Get all doctors
curl http://localhost:2222/api/doctors

# Get all neurologists
curl http://localhost:2222/api/doctors?speciality=neurologist

# Get verified doctors in Cumilla
curl "http://localhost:2222/api/doctors?district=Cumilla&verified=true"
```

---

### 3. Get Doctor by ID

**GET** `/api/doctors/:id`

Retrieve a specific doctor by their ID.

#### Example:

```bash
curl http://localhost:2222/api/doctors/64a1b2c3d4e5f6a7b8c9d0e1
```

---

### 4. Update Doctor

**PUT** `/api/doctors/:id`

Update an existing doctor's information.

#### Example:

```bash
curl -X PUT http://localhost:2222/api/doctors/64a1b2c3d4e5f6a7b8c9d0e1 \
  -H "Content-Type: application/json" \
  -d '{
    "fees": 600,
    "verified": true,
    "location": {
      "coordinates": [91.1850, 23.4650]
    }
  }'
```

---

### 5. Delete Doctor (Soft Delete)

**DELETE** `/api/doctors/:id`

Soft deletes a doctor by setting `active: false`.

#### Example:

```bash
curl -X DELETE http://localhost:2222/api/doctors/64a1b2c3d4e5f6a7b8c9d0e1
```

---

### 6. Find Nearest Doctors

**POST** `/api/doctors/nearest`

Find doctors near a specific location using geospatial queries.

#### Request Body:

```json
{
  "location": [91.1809, 23.4607],
  "maxDistance": 10000,
  "limit": 10,
  "speciality": "neurologist"
}
```

#### Example:

```bash
curl -X POST http://localhost:2222/api/doctors/nearest \
  -H "Content-Type: application/json" \
  -d '{
    "location": [91.1809, 23.4607],
    "maxDistance": 5000,
    "limit": 5,
    "speciality": "neurologist"
  }'
```

#### JavaScript Example:

```javascript
async function findNearestDoctors(userLocation) {
  try {
    const response = await axios.post('http://localhost:2222/api/doctors/nearest', {
      location: userLocation, // [longitude, latitude]
      maxDistance: 10000, // 10km in meters
      limit: 10,
      speciality: 'neurologist' // optional
    });
    
    console.log(`Found ${response.data.count} doctors nearby`);
    response.data.doctors.forEach(doctor => {
      console.log(`${doctor.name} - ${doctor.speciality}`);
    });
  } catch (error) {
    console.error('Error:', error.response.data);
  }
}

// Usage
findNearestDoctors([91.1809, 23.4607]); // Cumilla coordinates
```

---

## Location Format

**Important:** Location coordinates must be in `[longitude, latitude]` format (not latitude, longitude).

- **Longitude** (X-axis): Range -180 to 180
- **Latitude** (Y-axis): Range -90 to 90

### Bangladesh Coordinates Examples:

- **Dhaka**: `[90.4125, 23.8103]`
- **Chittagong**: `[91.7832, 22.3569]`
- **Cumilla**: `[91.1809, 23.4607]`
- **Sylhet**: `[91.8833, 24.8949]`

### Getting Coordinates:

1. **Google Maps**: Right-click on location → Click coordinates
2. **GPS Device**: Use device coordinates
3. **Geocoding API**: Use services like Google Geocoding API

---

## Required Fields

When adding a new doctor, these fields are **required**:

- `name` - Doctor's name
- `speciality` - Medical speciality
- `degree` - Educational qualifications
- `fees` - Consultation fees (number)
- `location.coordinates` - `[longitude, latitude]` array
- `address.line1` - Primary address line

---

## Optional Fields

- `experience` - Years/description of experience
- `about` - Additional information
- `image` - URL or path to doctor's photo
- `address.line2` - Secondary address line
- `address.upazila` - Upazila name
- `address.district` - District name
- `address.division` - Division name
- `contact.phone` - Array of phone numbers
- `contact.email` - Email address
- `facility` - HealthFacility ObjectId (if linked to a facility)
- `availability` - Working hours and days
- `verified` - Verification status (default: false)

---

## Error Handling

### Validation Errors (400):

```json
{
  "message": "Missing required fields: name, speciality, degree, and fees are required"
}
```

### Invalid Location (400):

```json
{
  "message": "Location is required and must be { coordinates: [longitude, latitude] }"
}
```

### Not Found (404):

```json
{
  "message": "Doctor not found"
}
```

---

## Bulk Import Example

For importing multiple doctors at once:

```javascript
const doctors = [
  {
    name: 'Dr. Alim Uddin',
    speciality: 'neurologist',
    degree: 'MBBS, MD (Neurology)',
    fees: 500,
    location: { coordinates: [91.1809, 23.4607] },
    address: { line1: '17th Cross, Richmond Circle', district: 'Cumilla' }
  },
  {
    name: 'Dr. Nazmul Hasan',
    speciality: 'neurologist',
    degree: 'MBBS, MCPS (Medicine), MD (Neurology)',
    fees: 600,
    location: { coordinates: [91.1850, 23.4650] },
    address: { line1: '27th Cross, Richmond Circle', district: 'Cumilla' }
  }
];

async function bulkImport(doctors) {
  const results = [];
  for (const doctorData of doctors) {
    try {
      const response = await axios.post('http://localhost:2222/api/doctors', doctorData);
      results.push({ success: true, doctor: response.data.doctor });
    } catch (error) {
      results.push({ success: false, error: error.response.data });
    }
  }
  return results;
}

bulkImport(doctors).then(results => {
  console.log(`Imported ${results.filter(r => r.success).length} doctors`);
});
```

---

## Integration with Frontend

The frontend can now fetch and display doctors from the API:

```javascript
// Fetch all doctors
const doctors = await fetch('http://localhost:2222/api/doctors')
  .then(res => res.json());

// Find nearest doctors
const nearestDoctors = await fetch('http://localhost:2222/api/doctors/nearest', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    location: [userLongitude, userLatitude],
    maxDistance: 10000,
    limit: 10
  })
}).then(res => res.json());
```

