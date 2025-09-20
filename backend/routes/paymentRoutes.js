const { Router } = require('express')
const { body } = require('express-validator')
const { completePayment, getPurchaseHistory, getSalesHistory, clearPurchaseHistory } = require('../controllers/paymentController')
const auth = require('../middleware/auth')

const router = Router()

router.post(
  '/complete',
  auth,
  [
    body('paymentMethod').isIn(['card', 'upi', 'netbanking']),
    body('transactionId').isString().trim().notEmpty(),
  ],
  completePayment
)

router.get('/purchase-history', auth, getPurchaseHistory)
router.get('/sales-history', auth, getSalesHistory)
router.delete('/clear-purchase-history', auth, clearPurchaseHistory)

module.exports = router
