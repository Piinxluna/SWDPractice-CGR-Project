const Reserve = require('../models/Reserve')

// @desc    Get all reserve (with filter, sort, select and pagination)
// @route   GET /api/reserves
// @access  Admin & Private (me)
exports.getReserves = async (req, res, next) => {
  try {
    const { name, tel, email, password, role } = req.body

    //Create user
    const user = await User.create({
      name,
      tel,
      email,
      password,
      role,
    })

    sendTokenResponse(user, 200, res)
  } catch (err) {
    res.status(400).json({ sucess: false })
    console.log(err.stack)
  }
}
