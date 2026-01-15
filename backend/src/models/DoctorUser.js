import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const doctorUserSchema = new mongoose.Schema({
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
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false
  },
  profession: {
    type: String,
    required: true,
    trim: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    default: null
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
doctorUserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
    this.lastUpdated = new Date();
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to compare password
doctorUserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Indexes
// Note: email index is automatically created by unique: true
doctorUserSchema.index({ doctorId: 1 });
doctorUserSchema.index({ approved: 1, active: 1 });

const DoctorUser = mongoose.model('DoctorUser', doctorUserSchema);

export default DoctorUser;

