const express = require('express')
const {
  getReserves,
  createReserve,
  deleteReserve,
} = require('../controllers/reserves')

const router = express.Router({ mergeParams: true })

const { protect, authorize } = require('../middleware/auth')

router.route('/').get(protect, getReserves).post(protect, createReserve)
router.route('/:rid').delete(protect, deleteReserve)

module.exports = router
