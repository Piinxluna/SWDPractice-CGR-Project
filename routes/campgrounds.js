const express = require('express')

// Import middleware
const { protect, authorize } = require('../middleware/auth')

// Import controllers
const {
  createCampgroundSite,
  getCampgroundSite,
} = require('../controllers/campgroundSites')

// Create a router
const router = express.Router()

router
  .route('/:cgid/sites')
  .post(protect, authorize('admin'), createCampgroundSite)
router.route('/:cgid/sites/:sid').get(getCampgroundSite)

module.exports = router
