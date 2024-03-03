const express = require('express')

// Import controllers
const { getLogs, getLog, deleteLog } = require('../controllers/logs')

const router = express.Router()

const { protect, authorize } = require('../middleware/auth')

router.route('/').get(protect, authorize('admin'), getLogs)
router.route('/:lid')
  .get(protect, authorize('admin'), getLog)
  .delete(protect, authorize('admin'), deleteLog)

module.exports = router