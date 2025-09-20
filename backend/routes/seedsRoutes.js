const { Router } = require('express')
const { query } = require('express-validator')
const { listSeeds } = require('../controllers/seedsController')

const router = Router()

router.get(
  '/',
  [query('crop').optional().isString()],
  listSeeds
)

module.exports = router


