import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: [5, 'Password must be at least 5 characters long'], // Set to 5 to allow "admin" password
    select: false // Don't include password in queries by default
  },
  phone: {
    type: String,
    default: ''
  },
  address: {
    line1: {
      type: String,
      default: ''
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
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', ''],
    default: ''
  },
  dob: {
    type: Date,
    default: null
  },
  image: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  verified: {
    type: Boolean,
    default: false
  },
  approved: {
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

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Hash password with cost of 12
    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
    this.lastUpdated = new Date();
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Indexes for performance
// Note: email index is automatically created by unique: true
userSchema.index({ active: 1 });
userSchema.index({ approved: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);

export default User;

