import express from 'express';
import jwt from 'jsonwebtoken';
import DoctorUser from '../models/DoctorUser.js';
import { logger } from '../utils/logger.js';
import config from '../config/index.js';

const router = express.Router();

/**
 * Generate JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiry
  });
};

/**
 * @swagger
 * /doctor-auth/register:
 *   post:
 *     summary: Register a new doctor user
 *     tags: [Doctor Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - profession
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               profession:
 *                 type: string
 *               password:
 *                 type: string
 *                 minLength: 6
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, profession, password } = req.body;

    // Validate required fields
    if (!name || !email || !profession || !password) {
      return res.status(400).json({
        message: 'Name, email, profession, and password are required'
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if doctor user already exists
    const existingDoctor = await DoctorUser.findOne({ email: email.toLowerCase() });
    if (existingDoctor) {
      return res.status(400).json({
        message: 'Doctor with this email already exists'
      });
    }

    // Create new doctor user (not approved by default)
    const doctorUserData = {
      name,
      email: email.toLowerCase(),
      profession,
      password,
      approved: false // Requires admin approval
    };

    const doctorUser = new DoctorUser(doctorUserData);
    await doctorUser.save();

    // Remove password from response
    const doctorUserResponse = doctorUser.toObject();
    delete doctorUserResponse.password;

    logger.info(`New doctor user registered (pending approval): ${doctorUser.email} (ID: ${doctorUser._id})`);

    res.status(201).json({
      message: 'Doctor account created successfully. Please wait for admin approval.',
      doctor: doctorUserResponse
    });
  } catch (error) {
    logger.error('Doctor registration error:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        error: error.message
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Doctor with this email already exists'
      });
    }

    res.status(500).json({
      message: 'Failed to register doctor',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /doctor-auth/login:
 *   post:
 *     summary: Login doctor user
 *     tags: [Doctor Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    // Find doctor user by email and include password field
    const doctorUser = await DoctorUser.findOne({ email: email.toLowerCase() }).select('+password');

    if (!doctorUser) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Check if doctor user is active
    if (!doctorUser.active) {
      return res.status(401).json({
        message: 'Account has been deactivated'
      });
    }

    // Check if doctor user is approved
    if (!doctorUser.approved) {
      return res.status(401).json({
        message: 'Your account is pending admin approval. Please wait for approval to login.'
      });
    }

    // Compare password
    const isPasswordValid = await doctorUser.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(doctorUser._id);

    // Remove password from response
    const doctorUserResponse = doctorUser.toObject();
    delete doctorUserResponse.password;

    logger.info(`Doctor user logged in: ${doctorUser.email} (ID: ${doctorUser._id})`);

    res.status(200).json({
      message: 'Login successful',
      token,
      doctor: doctorUserResponse
    });
  } catch (error) {
    logger.error('Doctor login error:', error);
    res.status(500).json({
      message: 'Failed to login',
      error: error.message
    });
  }
});

/**
 * Middleware to verify doctor token
 */
export const verifyDoctor = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwtSecret);
    } catch (error) {
      return res.status(401).json({
        message: 'Invalid or expired token'
      });
    }

    // Find doctor user
    const doctorUser = await DoctorUser.findById(decoded.userId);

    if (!doctorUser || !doctorUser.active || !doctorUser.approved) {
      return res.status(401).json({
        message: 'Doctor user not found or inactive'
      });
    }

    req.doctorUser = doctorUser;
    next();
  } catch (error) {
    logger.error('Doctor verification error:', error);
    res.status(500).json({
      message: 'Failed to verify doctor access',
      error: error.message
    });
  }
};

export default router;

