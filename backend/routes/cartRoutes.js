const { Router } = require('express')
const { body } = require('express-validator')
const { addItem, listItems, removeItem } = require('../controllers/cartController')
const auth = require('../middleware/auth')

const router = Router()

router.get('/', auth, listItems)
router.post(
  '/',
  auth,
  [
    body('crop').isString().trim().notEmpty(),
    body('company').isString().trim().notEmpty(),
    body('pricePerUnit').isFloat({ gt: 0 }),
    body('quantity').isInt({ gt: 0 }),
    body('imageUrl').optional().isString(),
  ],
  addItem
)
router.delete('/:id', auth, removeItem)

module.exports = router


