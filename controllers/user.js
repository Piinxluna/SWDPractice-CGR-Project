const User = require('../models/User')

// @desc : Get your user's data
// @route : GET /api/users/me
// @access : Private (Me)
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    res.status(200).json({ success: true, data: user })
  } catch (err) {
    console.log(err.stack)
    return res.status(400).json({ sucess: false })
  }
}

// @desc : Get a user
// @route : GET /api/users/:uid
// @access : Admin
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.uid)

    if (!user) {
      return res
        .status(400)
        .json({ sucess: false, message: 'Not found user with this id' })
    }

    return res.status(200).json({ success: true, data: user })
  } catch (err) {
    console.log(err.stack)
    return res.status(400).json({ sucess: false })
  }
}

// @desc : Get all user (with filter, sort, select and pagination)
// @route : GET /api/users
// @access : Admin
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find()

    if (!users) {
      return res
        .status(400)
        .json({ sucess: false, message: 'Not found user with this id' })
    }

    return res.status(200).json({ success: true, data: users })
  } catch (err) {
    console.log(err.stack)
    return res.status(400).json({ sucess: false })
  }
}

// @desc : Update user's data (can't change user's role)
// @route : PUT /api/users/me
// @access : Private (Me)
exports.updateMe = async (req, res, next) => {
  const { name, tel, email, password } = req.body
  const newData = { name, tel, email, password }
  if (!newData) {
    return res.status(400).json({
      success: false,
      message:
        'Please provide name, telephone number, email or password to update',
    })
  }

  try {
    const user = await User.findByIdAndUpdate(req.user.id, newData, {
      new: true,
      runValidators: true,
    })

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: 'Cannot find user' })
    }

    res.status(200).json({ success: true, data: user })
  } catch (err) {
    console.log(err.stack)
    res.status(400).json({ success: false })
  }
}

// @desc : Update a user (can't change user's role)
// @route : PUT /api/users/:uid
// @access : Admin
exports.updateUser = async (req, res, next) => {
  const { name, tel, email, password } = req.body
  const newData = { name, tel, email, password }
  if (!newData) {
    return res.status(400).json({
      success: false,
      message:
        'Please provide name, telephone number, email or password to update',
    })
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.uid, newData, {
      new: true,
      runValidators: true,
    })

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: 'Cannot find user' })
    }

    res.status(200).json({ success: true, data: user })
  } catch (err) {
    console.log(err.stack)
    res.status(400).json({ success: false })
  }
}

// @desc : Update a user role (change between 'customer' and 'admin')
// @route : PUT /api/users/update-role/:uid
// @access : Admin
exports.updateUserRole = async (req, res, next) => {
  const { role } = req.body
  const validRoles = ['admin', 'customer']
  if (!role || !validRoles.includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid role to update',
    })
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.params.uid,
      { role },
      {
        new: true,
        runValidators: true,
      }
    )

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: 'Cannot find user' })
    }

    res.status(200).json({ success: true, data: user })
  } catch (err) {
    console.log(err.stack)
    res.status(400).json({ success: false })
  }
}

// @desc : Delete user's account
// @route : DEL /api/users/me
// @access : Private (Me)
exports.deleteMe = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id)

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: 'Cannot find user' })
    }

    res.status(200).json({ success: true, data: {} })
  } catch (err) {
    console.log(err.stack)
    res.status(400).json({ success: false })
  }
}

// @desc : Delete a user
// @route : DEL /api/users/:uid
// @access : Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.uid)

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: 'Cannot find user' })
    }

    res.status(200).json({ success: true, data: {} })
  } catch (err) {
    console.log(err.stack)
    res.status(400).json({ success: false })
  }
}
