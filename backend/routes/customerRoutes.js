const { Router } = require('express');
const { body, oneOf } = require('express-validator');
const customerController = require('../controllers/customerController');
const auth = require('../middleware/auth');

const router = Router();

// Customer Registration
router.post(
  '/register',
  [
    body('fullname').isString().isLength({ min: 2 }).withMessage('Full name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('phone').isString().isLength({ min: 7 }).withMessage('Phone is required'),
    body('address').isString().isLength({ min: 5 }).withMessage('Address is required'),
    body('username').isString().isLength({ min: 3 }).withMessage('Username is required'),
    body('password').isLength({ min: 6 }).withMessage('Password min length 6'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
    body('gender').optional().isIn(['Male', 'Female', 'Other']),
    body('dateOfBirth').optional().isISO8601().withMessage('Valid date of birth required'),
    body('emergencyContact.name').optional().isString().isLength({ min: 2 }),
    body('emergencyContact.phone').optional().isString().isLength({ min: 7 }),
    body('emergencyContact.relation').optional().isString().isLength({ min: 2 }),
  ],
  customerController.register
);

// Customer Login
router.post(
  '/login',
  [
    oneOf([
      body('email').isEmail(),
      body('username').isString().isLength({ min: 3 }),
    ], 'Provide a valid email or a username'),
    body('password').isString().isLength({ min: 6 }).withMessage('Password min length 6'),
  ],
  customerController.login
);

// Get current customer profile
router.get('/me', auth, customerController.getMe);

// Update customer profile
router.put(
  '/profile',
  auth,
  [
    body('fullname').optional().isString().isLength({ min: 2 }),
    body('email').optional().isEmail(),
    body('phone').optional().isString().isLength({ min: 7 }),
    body('address').optional().isString().isLength({ min: 5 }),
    body('username').optional().isString().isLength({ min: 3 }),
    body('gender').optional().isIn(['Male', 'Female', 'Other']),
    body('dateOfBirth').optional().isISO8601(),
    body('emergencyContact').optional().isObject(),
    body('emergencyContact.name').optional().isString().isLength({ min: 2 }),
    body('emergencyContact.phone').optional().isString().isLength({ min: 7 }),
    body('emergencyContact.relation').optional().isString().isLength({ min: 2 }),
  ],
  customerController.updateProfile
);

// Get all customers (admin/doctor view)
router.get('/', auth, customerController.getAllCustomers);

// Get customer by ID
router.get('/:id', auth, customerController.getCustomerById);

// Delete/deactivate customer
router.delete('/:id', auth, customerController.deleteCustomer);

// Medical History Routes
router.post(
  '/medical-history',
  auth,
  [
    body('condition').isString().isLength({ min: 2 }).withMessage('Medical condition is required'),
    body('diagnosedDate').isISO8601().withMessage('Valid diagnosis date required'),
    body('status').optional().isIn(['Active', 'Resolved', 'Chronic']),
  ],
  customerController.addMedicalHistory
);

router.put(
  '/medical-history',
  auth,
  [
    body('historyId').isMongoId().withMessage('Valid medical history ID required'),
    body('condition').isString().isLength({ min: 2 }).withMessage('Medical condition is required'),
    body('diagnosedDate').isISO8601().withMessage('Valid diagnosis date required'),
    body('status').optional().isIn(['Active', 'Resolved', 'Chronic']),
  ],
  customerController.updateMedicalHistory
);

router.delete(
  '/medical-history',
  auth,
  [
    body('historyId').isMongoId().withMessage('Valid medical history ID required'),
  ],
  customerController.deleteMedicalHistory
);

module.exports = router;
