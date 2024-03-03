const express = require('express')

// Import middleware
const { protect, authorize } = require('../middleware/auth')

// Import controllers
const { getCampgrounds
  ,getCampground,
  createCampground , 
  updateCampground , 
  deleteCampground } = require('../controllers/campground')
const {
  createCampgroundSite,
  getCampgroundSite,
  deleteCampgroundSite,
} = require('../controllers/campgroundSites')

// Import others router
const reservesRouter = require('./reserves')

// Create a router
const router = express.Router()

//Include other resource router
const reserveRouter = require('./reserves')

router.use(':cgid/sites/:sid/reserves', reserveRouter)

router.route('/')
  .get(getCampgrounds)
  .post(protect , authorize('admin') ,createCampground)
router.route('/:id')
  .get(getCampground)
  .put(protect , authorize('admin') ,updateCampground)
  .delete(protect , authorize('admin') , deleteCampground)
router
  .route('/:cgid/sites')
  .post(protect, authorize('admin'), createCampgroundSite)
router.use('/:cgid/reserves', reservesRouter)
router
  .route('/:cgid/sites/:sid')
  .get(getCampgroundSite)
  .delete(protect, authorize('admin'), deleteCampgroundSite)
router.use('/:cgid/sites/:sid/reserves', reservesRouter)

module.exports = router
