import express from 'express';
import Doctor from '../models/Doctor.js';
import { logger } from '../utils/logger.js';
import { cacheMiddleware } from '../middleware/cache.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Doctors
 *   description: Doctor management endpoints
 */

/**
 * @swagger
 * /doctors:
 *   post:
 *     summary: Add a new doctor
 *     tags: [Doctors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - speciality
 *               - degree
 *               - fees
 *               - location
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *               speciality:
 *                 type: string
 *               degree:
 *                 type: string
 *               experience:
 *                 type: string
 *               about:
 *                 type: string
 *               fees:
 *                 type: number
 *               image:
 *                 type: string
 *               location:
 *                 type: object
 *                 properties:
 *                   coordinates:
 *                     type: array
 *                     items:
 *                       type: number
 *                     description: [longitude, latitude]
 *               address:
 *                 type: object
 *                 properties:
 *                   line1:
 *                     type: string
 *                   line2:
 *                     type: string
 *                   upazila:
 *                     type: string
 *                   district:
 *                     type: string
 *                   division:
 *                     type: string
 *               contact:
 *                 type: object
 *                 properties:
 *                   phone:
 *                     type: array
 *                     items:
 *                       type: string
 *                   email:
 *                     type: string
 *               facility:
 *                 type: string
 *                 description: HealthFacility ID (optional)
 *               availability:
 *                 type: object
 *     responses:
 *       201:
 *         description: Doctor created successfully
 *       400:
 *         description: Invalid input data
 */
router.post('/', async (req, res) => {
  try {
    const {
      name,
      speciality,
      degree,
      experience = '',
      about = '',
      fees,
      image = '',
      location,
      address,
      contact = {},
      facility = null,
      availability = {},
      verified = false
    } = req.body;

    // Validate required fields
    if (!name || !speciality || !degree || fees === undefined) {
      return res.status(400).json({ 
        message: 'Missing required fields: name, speciality, degree, and fees are required' 
      });
    }

    // Validate location
    if (!location || !location.coordinates || !Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
      return res.status(400).json({ 
        message: 'Location is required and must be { coordinates: [longitude, latitude] }' 
      });
    }

    // Validate address
    if (!address || !address.line1) {
      return res.status(400).json({ 
        message: 'Address with line1 is required' 
      });
    }

    // Format location for GeoJSON
    const doctorData = {
      name,
      speciality,
      degree,
      experience,
      about,
      fees,
      image,
      location: {
        type: 'Point',
        coordinates: location.coordinates // [longitude, latitude]
      },
      address: {
        line1: address.line1,
        line2: address.line2 || '',
        upazila: address.upazila || '',
        district: address.district || '',
        division: address.division || ''
      },
      contact: {
        phone: Array.isArray(contact.phone) ? contact.phone : (contact.phone ? [contact.phone] : []),
        email: contact.email || ''
      },
      facility: facility || null,
      availability: availability || {},
      verified
    };

    const doctor = new Doctor(doctorData);
    await doctor.save();

    logger.info(`New doctor created: ${doctor.name} (ID: ${doctor._id})`);

    res.status(201).json({
      message: 'Doctor created successfully',
      doctor
    });
  } catch (error) {
    logger.error('Error creating doctor:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        error: error.message 
      });
    }
    
    res.status(500).json({ 
      message: 'Failed to create doctor', 
      error: error.message 
    });
  }
});

/**
 * @swagger
 * /doctors:
 *   get:
 *     summary: Get all doctors
 *     tags: [Doctors]
 *     parameters:
 *       - in: query
 *         name: speciality
 *         schema:
 *           type: string
 *         description: Filter by speciality
 *       - in: query
 *         name: district
 *         schema:
 *           type: string
 *       - in: query
 *         name: verified
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         default: true
 *     responses:
 *       200:
 *         description: List of doctors
 */
router.get('/', cacheMiddleware(3600), async (req, res) => {
  try {
    const { speciality, district, verified, active = 'true' } = req.query;
    const filter = {};

    if (speciality) filter.speciality = speciality;
    if (district) filter['address.district'] = district;
    if (verified !== undefined) filter.verified = verified === 'true';
    if (active !== undefined) filter.active = active === 'true';

    const doctors = await Doctor.find(filter).populate('facility', 'name type address');

    res.status(200).json({
      count: doctors.length,
      doctors
    });
  } catch (error) {
    logger.error('Error fetching doctors:', error);
    res.status(500).json({ 
      message: 'Failed to fetch doctors', 
      error: error.message 
    });
  }
});

/**
 * @swagger
 * /doctors/{id}:
 *   get:
 *     summary: Get a specific doctor by ID
 *     tags: [Doctors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Doctor details
 *       404:
 *         description: Doctor not found
 */
router.get('/:id', cacheMiddleware(3600), async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findById(id).populate('facility');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json(doctor);
  } catch (error) {
    logger.error('Error fetching doctor:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid doctor ID' });
    }
    
    res.status(500).json({ 
      message: 'Failed to fetch doctor', 
      error: error.message 
    });
  }
});

/**
 * @swagger
 * /doctors/{id}:
 *   put:
 *     summary: Update a doctor
 *     tags: [Doctors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Doctor updated successfully
 *       404:
 *         description: Doctor not found
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // If location coordinates are being updated, format them properly
    if (updateData.location && updateData.location.coordinates) {
      updateData.location = {
        type: 'Point',
        coordinates: updateData.location.coordinates
      };
    }

    const doctor = await Doctor.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    logger.info(`Doctor updated: ${doctor.name} (ID: ${id})`);

    res.status(200).json({
      message: 'Doctor updated successfully',
      doctor
    });
  } catch (error) {
    logger.error('Error updating doctor:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        error: error.message 
      });
    }
    
    res.status(500).json({ 
      message: 'Failed to update doctor', 
      error: error.message 
    });
  }
});

/**
 * @swagger
 * /doctors/{id}:
 *   delete:
 *     summary: Delete a doctor (soft delete by setting active=false)
 *     tags: [Doctors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Doctor deleted successfully
 *       404:
 *         description: Doctor not found
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Soft delete by setting active to false
    const doctor = await Doctor.findByIdAndUpdate(
      id,
      { $set: { active: false } },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    logger.info(`Doctor deleted (deactivated): ${doctor.name} (ID: ${id})`);

    res.status(200).json({
      message: 'Doctor deleted successfully',
      doctor
    });
  } catch (error) {
    logger.error('Error deleting doctor:', error);
    res.status(500).json({ 
      message: 'Failed to delete doctor', 
      error: error.message 
    });
  }
});

/**
 * @swagger
 * /doctors/nearest:
 *   post:
 *     summary: Find nearest doctors to a location
 *     tags: [Doctors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - location
 *             properties:
 *               location:
 *                 type: array
 *                 items:
 *                   type: number
 *                 description: [longitude, latitude]
 *               maxDistance:
 *                 type: number
 *                 default: 10000
 *                 description: Maximum distance in meters
 *               limit:
 *                 type: number
 *                 default: 10
 *               speciality:
 *                 type: string
 *                 description: Filter by speciality (optional)
 *     responses:
 *       200:
 *         description: List of nearest doctors
 */
router.post('/nearest', async (req, res) => {
  try {
    const { 
      location, 
      maxDistance = 10000, 
      limit = 10,
      speciality 
    } = req.body;

    if (!location || !Array.isArray(location) || location.length !== 2) {
      return res.status(400).json({ 
        message: 'Valid location [longitude, latitude] is required' 
      });
    }

    const query = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: location
          },
          $maxDistance: maxDistance
        }
      },
      active: true
    };

    if (speciality) {
      query.speciality = speciality;
    }

    const doctors = await Doctor.find(query)
      .limit(limit)
      .populate('facility', 'name type address');

    res.status(200).json({
      count: doctors.length,
      location,
      maxDistance,
      doctors
    });
  } catch (error) {
    logger.error('Error finding nearest doctors:', error);
    res.status(500).json({ 
      message: 'Failed to find nearest doctors', 
      error: error.message 
    });
  }
});

export default router;

