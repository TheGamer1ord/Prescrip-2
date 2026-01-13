import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
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
 * Middleware to verify admin token
 */
const verifyAdmin = async (req, res, next) => {
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

    // Find user and verify admin role
    const user = await User.findById(decoded.userId);

    if (!user || user.role !== 'admin' || !user.active) {
      return res.status(403).json({
        message: 'Access denied. Admin privileges required.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('Admin verification error:', error);
    res.status(500).json({
      message: 'Failed to verify admin access',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
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
 *     responses:
 *       200:
 *         description: Admin login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    logger.info(`Admin login attempt: email=${email}, password=${password ? 'provided' : 'missing'}`);

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    
    logger.info(`Normalized email: ${normalizedEmail}`);

    // Special admin credentials check for admin@gmail.com
    if (normalizedEmail === 'admin@gmail.com' && password === 'admin') {
      // Check if admin user exists
      let admin = await User.findOne({ email: 'admin@gmail.com' });
      
      if (!admin) {
        try {
          // Create admin user if it doesn't exist
          admin = new User({
            name: 'Admin',
            email: 'admin@gmail.com',
            password: 'admin', // Will be hashed by pre-save hook (5 chars now allowed)
            role: 'admin',
            approved: true,
            active: true
          });
          await admin.save();
          logger.info('Admin user created successfully');
        } catch (error) {
          logger.error('Error creating admin user:', error);
          // If validation error, try to find existing admin
          if (error.name === 'ValidationError') {
            admin = await User.findOne({ email: 'admin@gmail.com' });
            if (!admin) {
              return res.status(400).json({
                message: 'Failed to create admin user',
                error: error.message
              });
            }
          } else {
            return res.status(500).json({
              message: 'Failed to create admin user',
              error: error.message
            });
          }
        }
      } else {
        // Update role and status if not admin
        if (admin.role !== 'admin') {
          admin.role = 'admin';
          admin.approved = true;
          admin.active = true;
          await admin.save();
          logger.info('User converted to admin');
        }
        
        // Check if password is correct
        const adminWithPassword = await User.findOne({ email: 'admin@gmail.com' }).select('+password');
        if (adminWithPassword) {
          const isPasswordValid = await adminWithPassword.comparePassword('admin');
          
          if (!isPasswordValid) {
            // Reset password if it doesn't match (bypass validation)
            adminWithPassword.password = 'admin';
            adminWithPassword.markModified('password');
            await adminWithPassword.save({ validateBeforeSave: false });
            logger.info('Admin password reset to default');
          }
        }
      }

      // Reload admin to get fresh data
      admin = await User.findOne({ email: 'admin@gmail.com' });

      // Generate token
      const token = generateToken(admin._id);

      // Remove password from response
      const adminResponse = admin.toObject();
      delete adminResponse.password;

      logger.info(`Admin logged in: ${admin.email} (ID: ${admin._id})`);

      return res.status(200).json({
        message: 'Admin login successful',
        token,
        user: adminResponse
      });
    }

    // Regular admin login (check if user is admin)
    let admin = await User.findOne({ 
      email: normalizedEmail, 
      role: 'admin' 
    }).select('+password');

    if (!admin) {
      return res.status(401).json({
        message: 'Invalid admin credentials'
      });
    }

    // Check if admin is active
    if (!admin.active) {
      return res.status(401).json({
        message: 'Admin account has been deactivated'
      });
    }

    // Compare password
    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid admin credentials'
      });
    }

    // Generate token
    const token = generateToken(admin._id);

    // Remove password from response
    const adminResponse = admin.toObject();
    delete adminResponse.password;

    logger.info(`Admin logged in: ${admin.email} (ID: ${admin._id})`);

    res.status(200).json({
      message: 'Admin login successful',
      token,
      user: adminResponse
    });
  } catch (error) {
    logger.error('Admin login error:', error);
    res.status(500).json({
      message: 'Failed to login',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 */
router.get('/dashboard', verifyAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const pendingUsers = await User.countDocuments({ role: 'user', approved: false });
    const approvedUsers = await User.countDocuments({ role: 'user', approved: true });
    const totalDoctors = await Doctor.countDocuments();
    const activeDoctors = await Doctor.countDocuments({ active: true });

    res.status(200).json({
      stats: {
        totalUsers,
        pendingUsers,
        approvedUsers,
        totalDoctors,
        activeDoctors
      }
    });
  } catch (error) {
    logger.error('Dashboard error:', error);
    res.status(500).json({
      message: 'Failed to fetch dashboard data',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 */
router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('+password')
      .sort({ createdAt: -1 });

    // Format user data (include password hash info)
    const usersData = users.map(user => {
      const userObj = user.toObject();
      return {
        ...userObj,
        password: userObj.password ? '••••••••' : 'N/A' // Show masked password indicator
      };
    });

    res.status(200).json({
      count: usersData.length,
      users: usersData
    });
  } catch (error) {
    logger.error('Get users error:', error);
    res.status(500).json({
      message: 'Failed to fetch users',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /admin/doctors:
 *   get:
 *     summary: Get all doctors
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all doctors
 */
router.get('/doctors', verifyAdmin, async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: doctors.length,
      doctors
    });
  } catch (error) {
    logger.error('Get doctors error:', error);
    res.status(500).json({
      message: 'Failed to fetch doctors',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /admin/users/:id/approve:
 *   put:
 *     summary: Approve a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User approved successfully
 */
router.put('/users/:id/approve', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { $set: { approved: true } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    if (user.role === 'admin') {
      return res.status(400).json({
        message: 'Cannot approve admin users'
      });
    }

    logger.info(`User approved by admin: ${user.email} (ID: ${id})`);

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      message: 'User approved successfully',
      user: userResponse
    });
  } catch (error) {
    logger.error('Approve user error:', error);
    res.status(500).json({
      message: 'Failed to approve user',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /admin/users/:id/reject:
 *   put:
 *     summary: Reject/Deactivate a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User rejected successfully
 */
router.put('/users/:id/reject', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { $set: { approved: false, active: false } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    if (user.role === 'admin') {
      return res.status(400).json({
        message: 'Cannot reject admin users'
      });
    }

    logger.info(`User rejected by admin: ${user.email} (ID: ${id})`);

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      message: 'User rejected successfully',
      user: userResponse
    });
  } catch (error) {
    logger.error('Reject user error:', error);
    res.status(500).json({
      message: 'Failed to reject user',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /admin/users/bulk-approve:
 *   post:
 *     summary: Approve multiple users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Users approved successfully
 */
router.post('/users/bulk-approve', verifyAdmin, async (req, res) => {
  try {
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        message: 'User IDs array is required'
      });
    }

    const result = await User.updateMany(
      { _id: { $in: userIds }, role: 'user' },
      { $set: { approved: true } }
    );

    logger.info(`Bulk approval: ${result.modifiedCount} users approved`);

    res.status(200).json({
      message: `${result.modifiedCount} users approved successfully`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    logger.error('Bulk approve error:', error);
    res.status(500).json({
      message: 'Failed to approve users',
      error: error.message
    });
  }
});

export default router;

