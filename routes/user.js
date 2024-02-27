const express = require('express')
const { 
  getMe, 
  getUser, 
  getUsers, 
  updateMe, 
  updateuser, 
  updateUserRole, 
  deleteMe, 
  deleteUser 
} = require('../controllers/user')

const router = express.Router()
const { protect, authorize } = require('../middleware/auth')

router.route('/').get(protect, authorize('admin'), getUsers)
router.route('/me').get(protect, getMe)
router.route('/:uid').get(protect, authorize('admin'), getUser)
router.route('/update-role/:uid').put(protect, authorize('admin'), updateUserRole)