const User = require('../models/User')

// @desc : Get your user's data
// @route : GET /api/users/me
// @access : Private (Me)
exports.getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({success : true, data : user});
}