const { Router } = require('express');
const { body, oneOf } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = Router();

router.post(
  '/register',
  [
    body('name').isString().isLength({ min: 2 }).withMessage('Name is required'),
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
  ],
  authController.register
);

router.post(
  '/login',
  [
    oneOf([
      body('email').isEmail(),
      body('username').isString().isLength({ min: 3 }),
    ], 'Provide a valid email or a username'),
    body('password').isString().isLength({ min: 6 }).withMessage('Password min length 6'),
  ],
  authController.login
);

// Example protected route
router.get('/me', auth, (req, res) => {
  return res.json({ user: req.user });
});

module.exports = router;


