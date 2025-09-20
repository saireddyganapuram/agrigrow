const { Router } = require('express')
const { query } = require('express-validator')
const { listFertilizers } = require('../controllers/fertilizersController')

const router = Router()

router.get(
  '/',
  [query('crop').optional().isString()],
  listFertilizers
)

module.exports = router
