import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  speciality: {
    type: String,
    required: true,
    trim: true
    // Common specialities: neurologist, gynecologist, pediatrician, dermatologist, etc.
  },
  degree: {
    type: String,
    required: true,
    trim: true
    // e.g., "MBBS, MD (Neurology), CCD (BIRDEM)"
  },
  experience: {
    type: String,
    default: ''
    // e.g., "Fellowship Training in ACS & EMG"
  },
  about: {
    type: String,
    default: ''
    // Additional information about the doctor
  },
  fees: {
    type: Number,
    required: true,
    min: 0
    // Consultation fees
  },
  image: {
    type: String,
    default: ''
    // URL or path to doctor's image
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function(coords) {
          return coords.length === 2 && 
                 typeof coords[0] === 'number' && 
                 typeof coords[1] === 'number' &&
                 coords[0] >= -180 && coords[0] <= 180 && // longitude
                 coords[1] >= -90 && coords[1] <= 90;    // latitude
        },
        message: 'Location must be [longitude, latitude] with valid coordinates'
      }
    }
  },
  address: {
    line1: {
      type: String,
      required: true
    },
    line2: {
      type: String,
      default: ''
    },
    upazila: {
      type: String,
      default: ''
    },
    district: {
      type: String,
      default: ''
    },
    division: {
      type: String,
      default: ''
    }
  },
  contact: {
    phone: {
      type: [String],
      default: []
    },
    email: {
      type: String,
      default: ''
    }
  },
  // Optional: Link to a health facility if doctor works at one
  facility: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HealthFacility',
    default: null
  },
  // Availability/working hours
  availability: {
    days: [String], // e.g., ['Monday', 'Wednesday', 'Friday']
    hours: {
      start: String, // e.g., "09:00"
      end: String    // e.g., "17:00"
    }
  },
  verified: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Create geospatial index for efficient location-based queries
doctorSchema.index({ location: '2dsphere' });

// Index for common queries
doctorSchema.index({ speciality: 1 });
doctorSchema.index({ district: 1 });
doctorSchema.index({ verified: 1, active: 1 });

// Update lastUpdated before saving
doctorSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;

