const express = require('express')
const {
  getMe,
  getUser,
  getUsers,
  updateMe,
  updateUser,
  updateUserRole,
  deleteMe,
  deleteUser,
} = require('../controllers/user')

const router = express.Router()
const { protect, authorize } = require('../middleware/auth')

router.route('/').get(protect, authorize('admin'), getUsers)
router
  .route('/me')
  .get(protect, getMe)
  .put(protect, updateMe)
  .delete(protect, deleteMe)
router
  .route('/:uid')
  .get(protect, authorize('admin'), getUser)
  .put(protect, authorize('admin'), updateUser)
  .delete(protect, authorize('admin'), deleteUser)
router
  .route('/update-role/:uid')
  .put(protect, authorize('admin'), updateUserRole)

module.exports = router
