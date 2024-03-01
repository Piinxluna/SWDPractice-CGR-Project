const express = require('express')
const { getReserves } = require('../controllers/reserves')

const router = express.Router({ mergeParams: true })

const { protect } = require('../middleware/auth')

router.get('/', protect, getReserves)

module.exports = router
