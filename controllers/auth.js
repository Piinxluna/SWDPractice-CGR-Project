const User = require('../models/User')
const Log = require('../models/Log')
const jwt = require('jsonwebtoken')

//Get token from model create cookie and send res
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken()

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  }

  if (process.env.NODE_ENV === 'production') {
    options.secure = true
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ sucess: true, token })
}

// @desc    Create a new user (create and return token, save token in cookie)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
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

    const log = await Log.create({ user: user.id, action: 'login' })
    if (!log) {
      return res
        .status(400)
        .json({ sucess: false, message: 'Cannot create log for this login' })
    }

    sendTokenResponse(user, 200, res)
  } catch (err) {
    res.status(400).json({ sucess: false })
    console.log(err.stack)
  }
}

// @desc    Login with user's email and password (create and return token, save token in cookie)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  const { email, password } = req.body

  //Check if email and password is valid
  if (!email || !password) {
    return res
      .status(400)
      .json({ sucess: false, msg: 'Please provide email and password' })
  }

  const user = await User.findOne({ email }).select('+password')

  //Check if find the user or not
  if (!user) {
    return res.status(400).json({ sucess: false, msg: 'Invalid Credentials' })
  }

  //Check if password match
  const isMatch = await user.matchPassword(password)

  if (!isMatch) {
    return res.status(400).json({ sucess: false, msg: 'Invalid Credentials' })
  }

  const log = await Log.create({ user: user.id, action: 'login' })
  if (!log) {
    return res
      .status(400)
      .json({ sucess: false, message: 'Cannot create log for this login' })
  }

  sendTokenResponse(user, 200, res)
}

// @desc : Logout from user account and delete token
// @route : GET /api/auth/logout
// @access : Registered user
exports.logout = async (req, res, next) => {
  // Check if user is login
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token || token == 'null') {
    return res.status(200).json({
      sucess: true,
      data: {},
    })
  }

  // Create log
  const decode = jwt.verify(
    req.headers.authorization.split(' ')[1],
    process.env.JWT_SECRET
  )
  const log = await Log.create({ user: decode.id, action: 'logout' })
  if (!log) {
    return res
      .status(400)
      .json({ sucess: false, message: 'Cannot create log for this login' })
  }

  // Delete token
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  })

  res.status(200).json({
    success: true,
    data: {},
  })
}
