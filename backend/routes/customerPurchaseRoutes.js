const { Router } = require('express');
const { body } = require('express-validator');
const customerPurchaseController = require('../controllers/customerPurchaseController');
const auth = require('../middleware/auth');

const router = Router();

router.post(
  '/record',
  auth,
  [
    body('cropName').isString().withMessage('Crop name required'),
    body('farmerName').isString().withMessage('Farmer name required'),
    body('quantity').isNumeric().withMessage('Valid quantity required'),
    body('totalAmount').isNumeric().withMessage('Valid total amount required'),
    body('transactionId').isString().withMessage('Transaction ID required'),
    body('paymentMethod').isIn(['card', 'upi', 'netbanking']).withMessage('Valid payment method required')
  ],
  customerPurchaseController.recordPurchase
);

router.get('/history', auth, customerPurchaseController.getPurchaseHistory);

module.exports = router;