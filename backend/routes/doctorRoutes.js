const { Router } = require('express');
const { body, oneOf } = require('express-validator');
const doctorController = require('../controllers/doctorController');
const auth = require('../middleware/auth');

const router = Router();

// Doctor Registration
router.post(
  '/register',
  [
    body('fullname').isString().isLength({ min: 2 }).withMessage('Full name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('phone').isString().isLength({ min: 7 }).withMessage('Phone is required'),
    body('address').isString().isLength({ min: 5 }).withMessage('Address is required'),
    body('username').isString().isLength({ min: 3 }).withMessage('Username is required'),
    body('password').isLength({ min: 6 }).withMessage('Password min length 6'),
    body('qualification').isString().isLength({ min: 2 }).withMessage('Doctor qualification is required'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
  ],
  doctorController.register
);

// Doctor Login
router.post(
  '/login',
  [
    oneOf([
      body('email').isEmail(),
      body('username').isString().isLength({ min: 3 }),
    ], 'Provide a valid email or a username'),
    body('password').isString().isLength({ min: 6 }).withMessage('Password min length 6'),
  ],
  doctorController.login
);

// Get current doctor profile
router.get('/me', auth, doctorController.getMe);

// Update doctor profile
router.put(
  '/profile',
  auth,
  [
    body('fullname').optional().isString().isLength({ min: 2 }),
    body('email').optional().isEmail(),
    body('phone').optional().isString().isLength({ min: 7 }),
    body('address').optional().isString().isLength({ min: 5 }),
    body('username').optional().isString().isLength({ min: 3 }),
    body('qualification').optional().isString().isLength({ min: 2 }),
    body('specialization').optional().isString(),
    body('experience').optional().isNumeric().isInt({ min: 0 }),
    body('licenseNumber').optional().isString(),
  ],
  doctorController.updateProfile
);

// Get all doctors (admin/doctor view)
router.get('/', auth, doctorController.getAllDoctors);

// Get doctor by ID
router.get('/:id', auth, doctorController.getDoctorById);

// Delete/deactivate doctor
router.delete('/:id', auth, doctorController.deleteDoctor);

module.exports = router;
