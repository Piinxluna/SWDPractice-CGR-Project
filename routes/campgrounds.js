const express = require('express')

// Import controllers
const {
  createCampgroundSite,
  getCampgroundSite,
} = require('../controllers/campgroundSites')

// Create a router
const router = express.Router()

router.route('/:cgid/sites').post(createCampgroundSite)
router.route('/:cgid/sites/:sid').get(getCampgroundSite)

module.exports = router
