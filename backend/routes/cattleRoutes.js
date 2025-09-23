const { Router } = require('express')
const { body } = require('express-validator')
const cattleController = require('../controllers/cattleController')
const auth = require('../middleware/auth')

const router = Router()

// Add cattle
router.post(
  '/',
  auth,
  [
    body('animalType').isString().isLength({ min: 2 }).withMessage('Animal type is required'),
    body('count').isInt({ min: 1 }).withMessage('Count must be at least 1'),
    body('breed').optional().isString().trim(),
    body('age').optional().isString().trim(),
    body('healthStatus').optional().isIn(['Healthy', 'Sick', 'Under Treatment', 'Vaccinated']),
    body('purpose').optional().isIn(['Milk', 'Meat', 'Breeding', 'Work', 'Eggs', 'Wool', 'Multiple']),
    body('notes').optional().isString().trim(),
    body('lastVaccinated').optional().isISO8601()
  ],
  cattleController.addCattle
)

// Get farmer's cattle
router.get('/', auth, cattleController.getCattleByFarmer)

// Update cattle
router.put('/:id', auth, cattleController.updateCattle)

// Delete cattle
router.delete('/:id', auth, cattleController.deleteCattle)

module.exports = router