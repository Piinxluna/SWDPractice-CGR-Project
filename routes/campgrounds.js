const express = require('express')

// Import middleware
const { protect, authorize } = require('../middleware/auth')

// Import controllers
const { getCampgrounds } = require('../controllers/campground')
const {
  createCampgroundSite,
  getCampgroundSite,
  deleteCampgroundSite,
} = require('../controllers/campgroundSites')

// Create a router
const router = express.Router()

router.route('/').get(getCampgrounds)
router
  .route('/:cgid/sites')
  .post(protect, authorize('admin'), createCampgroundSite)
router
  .route('/:cgid/sites/:sid')
  .get(getCampgroundSite)
  .delete(protect, authorize('admin'), deleteCampgroundSite)

module.exports = router
