# Project Setup Guide

## Prerequisites

1. **Node.js** (v16 or higher)
2. **MongoDB** (running locally or MongoDB Atlas connection string)

## Environment Setup

### Backend Environment Variables

Create a `.env` file in the `backend` directory with the following:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/prescrip

# Server Configuration
PORT=2222
NODE_ENV=development

# JWT Secret (Change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration (Optional)
SMTP_USER=user@example.com
SMTP_PASS=password
```

**For MongoDB Atlas (Cloud):**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/prescrip?retryWrites=true&w=majority
```

## Running the Project

### Option 1: Run Both Servers Separately (Recommended)

**Terminal 1 - Backend:**
```bash
cd backend
npm install  # If dependencies not installed
npm run dev
```

Backend will run on: `http://localhost:2222`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install  # If dependencies not installed
npm run dev
```

Frontend will run on: `http://localhost:5173` (or similar Vite port)

### Option 2: Using Docker Compose

```bash
docker compose -f compose.dev.yml up --build
```

## Verifying Setup

### Check Backend:
- Health Check: http://localhost:2222/api/health
- API Docs: http://localhost:2222/api/docs
- Ready Check: http://localhost:2222/api/health/ready

### Check Frontend:
- Open: http://localhost:5173 (or the port shown in terminal)

## MongoDB Setup

### Local MongoDB:
1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # Mac/Linux
   sudo systemctl start mongod
   ```

### MongoDB Atlas (Cloud):
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `MONGO_URI` in `.env` file

## Troubleshooting

### Backend won't start:
- Check if MongoDB is running
- Verify `.env` file exists in `backend` directory
- Check if port 2222 is available
- Look for errors in console

### Frontend can't connect to backend:
- Ensure backend is running on port 2222
- Check `frontend/src/lib/api.js` for correct API URL
- Verify CORS settings in backend

### MongoDB connection error:
- Verify MongoDB is running locally
- Check connection string in `.env`
- For MongoDB Atlas, ensure IP is whitelisted

## API Endpoints

### Authentication:
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)

### Doctors:
- `GET /api/doctors` - Get all doctors
- `POST /api/doctors` - Add new doctor
- `GET /api/doctors/:id` - Get doctor by ID
- `POST /api/doctors/nearest` - Find nearest doctors

### Health Facilities:
- `GET /api/healthmap/facilities` - Get all facilities
- `POST /api/healthmap/nearest` - Find nearest facilities

## Default Routes

- **Home**: `/` (public)
- **Login**: `/login` (public)
- **Protected Routes**: `/doctor`, `/about`, `/contact`, `/map`, `/my-profile`, `/my-appointments`

## Notes

- Backend runs on port **2222** by default
- Frontend runs on port **5173** (Vite default)
- JWT tokens expire in **48 hours**
- MongoDB database name: **prescrip**

