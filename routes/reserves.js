const express = require('express')
const router = express.Router({ mergeParams: true })

// Import middleware
const { protect, authorize } = require('../middleware/auth')

// Import controller
const {
  getReserves,
  createReserve,
  deleteReserve,
  getReserve,
  updateReserve,
} = require('../controllers/reserves')

// Reserve router
router.route('/')
  .get(protect, getReserves)
  .post(protect, createReserve)
router.route('/:rid')
  .get(protect, getReserve)
  .put(protect, updateReserve)
  .delete(protect, deleteReserve)

module.exports = router
