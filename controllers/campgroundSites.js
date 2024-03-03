const Campground = require('../models/Campground')
const Site = require('../models/Site')

// @desc    Create a new site for campground
// @route   POST /api/campgrounds/:cgid/sites
// @access  Admin
exports.createCampgroundSite = async (req, res, next) => {
  try {
    // Check if new site's data is valid
    const { zone, number, size } = req.body
    if (!zone || !number || !size) {
      return res
        .status(400)
        .json({ sucess: false, message: "The new site's data is not valid" })
    }

    // Check if there is no duplicated site
    const existedSite = await Site.findOne({
      campground: req.params.cgid,
      zone: zone,
      number: number,
    })
    if (existedSite) {
      return res.status(400).json({
        sucess: false,
        message: "The new site's data is duplicated",
      })
    }

    const site = await Site.create({
      zone,
      number,
      size,
      campground: req.params.cgid,
    })

    // Check if there is a valid campground
    const campground = await Campground.findByIdAndUpdate(
      req.params.cgid,
      {
        $push: { sites: site._id },
        $inc: { amount: 1 },
      },
      { new: true, runValidators: true }
    ).select('-sites')
    if (!campground) {
      await Site.findByIdAndDelete(site.id)
      return res.status(400).json({
        sucess: false,
        message: 'Cannot find this campground',
      })
    }

    // Send response
    res.status(201).json({ sucess: true, campground, newSite: site })
  } catch (err) {
    console.log(err.stack)
    res.status(400).json({ sucess: false })
  }
}

// @desc    Get a campground site in specific campground
// @route   GET /api/campgrounds/:cgid/sites/:sid
// @access  Public
exports.getCampgroundSite = async (req, res, next) => {
  try {
    // Find a site
    const site = await Site.findById(req.params.sid)
    if (!site) {
      return res.status(400).json({
        sucess: false,
        message: 'Cannot find this site',
      })
    }

    // Find a campground
    const campground = await Campground.findOne({
      id: req.params.cgid,
      sites: req.params.sid,
    }).select('-sites')
    if (!campground) {
      return res.status(400).json({
        sucess: false,
        message:
          "Cannot find the site in this campground, maybe your campground's id or site's id is wrong",
      })
    }

    // Send response
    res.status(200).json({ sucess: true, campground, site })
  } catch (err) {
    console.log(err.stack)
    res.status(400).json({ success: false })
  }
}

// @desc    Delete a campground site in specific campground
// @route   DEL /api/campgrounds/:cgid/sites/:sid
// @access  Admin
exports.deleteCampgroundSite = async (req, res, next) => {
  try {
    // Check if there is a valid campground & sites
    const site = await Site.findOne({
      id: req.params.sid,
      campground: req.params.cgid,
    })
    if (!site) {
      return res
        .status(400)
        .json({ sucess: false, message: 'Cannot find this campground site' })
    }

    await site.deleteOne()

    // Send response
    res.status(200).json({ sucess: true, data: {} })
  } catch (err) {
    console.log(err.stack)
    res.status(400).json({ sucess: false })
  }
}
