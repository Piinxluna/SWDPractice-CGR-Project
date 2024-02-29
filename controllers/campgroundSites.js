const Campground = require('../models/Campground')

// @desc    Create a new site for campground
// @route   POST /api/campgrounds/:cgid/sites
// @access  Admin
exports.createCampgroundSite = async (req, res, next) => {
  try {
    // Check if there is a valid campground
    const campground = await Campground.findById(req.params.cgid)
    if (!campground) {
      return res
        .status(400)
        .json({ sucess: false, message: 'Cannot find this campground' })
    }

    // Check if new site's data is valid
    const { zone, number, size } = req.body
    if (!zone || !number || !size) {
      return res
        .status(400)
        .json({ sucess: false, message: "The new site's data is not valid" })
    }
    const newSite = { zone, number, size }

    // Check if new site's data is duplicated
    campground.sites.forEach((element) => {
      if (element.zone === zone && element.number === number) {
        return res
          .status(400)
          .json({ sucess: false, message: "The new site's data is duplicated" })
      }
    })

    // Add new site to a campground
    const updatedCampground = await Campground.findByIdAndUpdate(
      req.params.cgid,
      { $push: { sites: newSite } },
      { runValidators: true }
    ).select('-sites')
    if (!updatedCampground) {
      return res
        .status(400)
        .json({ sucess: false, message: 'Cannot add the new site' })
    }

    // Send response
    res
      .status(201)
      .json({ sucess: true, campground: updatedCampground, newSite })
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
    let campground = await Campground.findById(req.params.cgid)
    if (!campground) {
      return res
        .status(400)
        .json({ success: false, message: 'Cannot find this campground' })
    }

    // Find a site in a campground & Delete unmatch sites
    campground.sites = campground.sites.filter(
      (element) => element.id === req.params.sid
    )
    if (campground.sites.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: 'Cannot find this site' })
    }

    // Send response
    res.status(200).json({ sucess: true, data: campground })
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
