const express = require('express')
const { getReserves } = require('../controllers/reserves')

const router = express.Router()

const { protect } = require('../middleware/auth')

router.get('/', getReserves)

module.exports = router
