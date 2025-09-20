const { Router } = require('express')
const { body } = require('express-validator')
const { getTransactions, createTransaction, getTransactionSummary } = require('../controllers/transactionController')
const auth = require('../middleware/auth')

const router = Router()

router.get('/', auth, getTransactions)

router.post(
  '/',
  auth,
  [
    body('type').isIn(['purchase', 'sale', 'payment']),
    body('description').isString().trim().notEmpty(),
    body('amount').isFloat({ gt: 0 }),
    body('paymentMethod').isIn(['card', 'upi', 'netbanking', 'cash']),
    body('relatedItems').optional().isArray(),
    body('notes').optional().isString().trim(),
  ],
  createTransaction
)

router.get('/summary', auth, getTransactionSummary)

module.exports = router
