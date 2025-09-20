const { Router } = require('express')
const { body } = require('express-validator')
const { createListing, getListings, getAllListings, deleteListing } = require('../controllers/cropListingController')
const auth = require('../middleware/auth')

const router = Router()

router.post(
  '/',
  auth,
  [
    body('cropName').isString().trim().notEmpty(),
    body('price').isFloat({ gt: 0 }),
    body('quantity').isFloat({ gt: 0 }),
    body('unit').optional().isString().trim(),
    body('description').optional().isString().trim(),
  ],
  createListing
)

router.get('/my', auth, getListings)
router.get('/all', getAllListings)
router.delete('/:id', auth, deleteListing)

module.exports = router
