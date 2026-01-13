import express from 'express';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import { logger } from '../utils/logger.js';
import { verifyDoctor } from './doctorAuth.routes.js';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';

const router = express.Router();

/**
 * Middleware to verify user token
 */
const verifyUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];
    
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwtSecret);
    } catch (error) {
      return res.status(401).json({
        message: 'Invalid or expired token'
      });
    }

    const user = await User.findById(decoded.userId);

    if (!user || !user.active || !user.approved) {
      return res.status(401).json({
        message: 'User not found or inactive'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('User verification error:', error);
    res.status(500).json({
      message: 'Failed to verify user access',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Create a new appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', verifyUser, async (req, res) => {
  try {
    const { doctorId, date, time, day } = req.body;

    // Validate required fields
    if (!doctorId || !date || !time || !day) {
      return res.status(400).json({
        message: 'Doctor ID, date, time, and day are required'
      });
    }

    // Verify doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        message: 'Doctor not found'
      });
    }

    // Create appointment
    const appointment = new Appointment({
      user: req.user._id,
      doctor: doctorId,
      date: new Date(date),
      time,
      day,
      status: 'pending'
    });

    await appointment.save();

    // Populate user and doctor details
    await appointment.populate('user', 'name email');
    await appointment.populate('doctor', 'name speciality');

    logger.info(`Appointment created: User ${req.user._id} -> Doctor ${doctorId}`);

    res.status(201).json({
      message: 'Appointment created successfully',
      appointment
    });
  } catch (error) {
    logger.error('Create appointment error:', error);
    res.status(500).json({
      message: 'Failed to create appointment',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /appointments/doctor:
 *   get:
 *     summary: Get appointments for logged-in doctor
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 */
router.get('/doctor', verifyDoctor, async (req, res) => {
  try {
    const doctorUser = req.doctorUser;

    // Find the doctor record linked to this doctor user
    let doctor;
    if (doctorUser.doctorId) {
      doctor = await Doctor.findById(doctorUser.doctorId);
    } else {
      // If no doctorId linked, try to find by email match
      doctor = await Doctor.findOne({ 'contact.email': doctorUser.email });
    }

    if (!doctor) {
      return res.status(404).json({
        message: 'Doctor profile not found. Please contact admin to link your account.'
      });
    }

    // Get all appointments for this doctor
    const appointments = await Appointment.find({ doctor: doctor._id })
      .populate('user', 'name email phone')
      .populate('doctor', 'name speciality')
      .sort({ date: 1, time: 1 });

    res.status(200).json({
      count: appointments.length,
      appointments
    });
  } catch (error) {
    logger.error('Get doctor appointments error:', error);
    res.status(500).json({
      message: 'Failed to fetch appointments',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /appointments/user:
 *   get:
 *     summary: Get appointments for logged-in user
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 */
router.get('/user', verifyUser, async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id })
      .populate('doctor', 'name speciality degree image')
      .sort({ date: 1, time: 1 });

    res.status(200).json({
      count: appointments.length,
      appointments
    });
  } catch (error) {
    logger.error('Get user appointments error:', error);
    res.status(500).json({
      message: 'Failed to fetch appointments',
      error: error.message
    });
  }
});

export default router;

