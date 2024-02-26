const express = require('express')

// Import controllers
const { createCampgroundSite } = require('../controllers/campgroundSites')

// Create a router
const router = express.Router()

router.route('/:cgid/sites').post(createCampgroundSite)

module.exports = router
