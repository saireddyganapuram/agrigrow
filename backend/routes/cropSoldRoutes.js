const { Router } = require('express');
const { body } = require('express-validator');
const cropSoldController = require('../controllers/cropSoldController');
const auth = require('../middleware/auth');

const router = Router();

// Record crop sale
router.post(
  '/record',
  auth,
  [
    body('cropListingId').isMongoId().withMessage('Valid crop listing ID required'),
    body('quantity').isNumeric().withMessage('Valid quantity required'),
    body('transactionId').isString().withMessage('Transaction ID required'),
    body('paymentMethod').isIn(['card', 'upi', 'netbanking']).withMessage('Valid payment method required')
  ],
  cropSoldController.recordCropSale
);

router.get('/farmer-sales', auth, cropSoldController.getFarmerSales);

// Get customer purchase history
router.get('/history', auth, cropSoldController.getCustomerPurchaseHistory);

module.exports = router;