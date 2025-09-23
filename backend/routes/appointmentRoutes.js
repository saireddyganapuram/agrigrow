const { Router } = require('express');
const { body } = require('express-validator');
const appointmentController = require('../controllers/appointmentController');
const auth = require('../middleware/auth');

const router = Router();

// Get user's appointments (user only)
router.get(
  '/user/appointments',
  auth,
  appointmentController.getUserAppointments
);

module.exports = router;
