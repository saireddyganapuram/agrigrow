const { Router } = require('express');
const { body } = require('express-validator');
const chatbotController = require('../controllers/chatbotController');
const auth = require('../middleware/auth');

const router = Router();

router.post(
  '/chat',
  auth,
  [
    body('message').isString().isLength({ min: 1 }).withMessage('Message is required')
  ],
  chatbotController.getChatResponse
);

router.post(
  '/upload-pdf',
  (req, res, next) => {
    console.log('PDF upload route hit');
    next();
  },
  auth,
  (req, res, next) => {
    console.log('Auth passed for PDF upload');
    next();
  },
  chatbotController.uploadPdf,
  chatbotController.analyzePdf
);

module.exports = router;