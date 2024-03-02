const express = require('express')

// Import controllers
const { getLogs } = require('../controllers/logs')

const router = express.Router()

const { protect, authorize } = require('../middleware/auth')

router.route('/').get(protect, authorize('admin'), getLogs)
// router
//   .route('/:lid')
//   .get(protect, authorize('admin'), getReserves)
//   .delete(protect, authorize('admin'), deleteReserve)

module.exports = router
