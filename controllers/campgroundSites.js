const Campground = require('../models/Campground')

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
    const newSite = { zone, number, size }

    // Check if there is a valid campground, no duplicated site and Create new site
    const campground = await Campground.findOneAndUpdate(
      {
        _id: req.params.cgid,
        sites: { $not: { $elemMatch: { zone: zone, number: number } } },
      },
      { $push: { sites: newSite }, $inc: { amount: 1 } },
      { new: true, runValidators: true }
    ).select('-sites')
    if (!campground) {
      return res.status(400).json({
        sucess: false,
        message:
          "Cannot find this campground or The new site's data is duplicated",
      })
    }

    // Send response
    res.status(201).json({ sucess: true, campground, newSite })
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
    // Find a campground
    let campground = await Campground.findOne({
      _id: req.params.cgid,
      sites: { $elemMatch: { _id: req.params.sid } },
    })
    if (!campground) {
      return res
        .status(400)
        .json({ success: false, message: 'Cannot find this campground site' })
    }

    // Find a site in a campground & Delete unmatch sites
    let site = campground.sites.find((element) => {
      return element.id === req.params.sid
    })

    // Delete other sites & Send response
    campground = campground.toJSON()
    delete campground.sites
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
    const site = await Campground.findOne({
      _id: req.params.cgid,
      sites: { $elemMatch: { _id: req.params.sid } },
    })
    if (!site) {
      return res
        .status(400)
        .json({ sucess: false, message: 'Cannot find this campground site' })
    }

    const campground = await Campground.findOneAndUpdate(
      { _id: req.params.cgid },
      { $pull: { sites: { _id: req.params.sid } } },
      { safe: true, multi: false, new: true }
    )
    if (!campground) {
      return res
        .status(400)
        .json({ sucess: false, message: 'Cannot delete this campground site' })
    }

    // Send response
    res.status(200).json({ sucess: true, data: campground })
  } catch (err) {
    console.log(err.stack)
    res.status(400).json({ sucess: false })
  }
}
