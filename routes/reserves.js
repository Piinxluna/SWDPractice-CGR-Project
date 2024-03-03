const express = require('express')
const {
  getReserves,
  createReserve,
  deleteReserve,
  getReserve,
  updateReserve,
  getBookedReserves,
} = require('../controllers/reserves')

const router = express.Router({ mergeParams: true })

const { protect, authorize } = require('../middleware/auth')

router.route('/')
.get(protect, getReserves)
.post(protect, createReserve)
router.route('/booked-reserves')
.get(getBookedReserves)
router.route('/:rid')
.delete(protect, deleteReserve)
.get(protect , authorize('admin','customer') ,getReserve)
.put(protect , authorize('admin','user'), updateReserve)
module.exports = router
