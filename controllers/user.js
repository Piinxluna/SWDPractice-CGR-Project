const User = require('../models/User')

// @desc : Get your user's data
// @route : GET /api/users/me
// @access : Private (Me)
exports.getMe = async (req, res, next) => {
  try{
    const user = await User.findById(req.user.id)
    res.status(200).json({success : true, data : user})
  }
  catch(err){
    console.log(err.stack)
    return res.status(400).json({sucess : false})
  }
}

// @desc : Get a user
// @route : GET /api/users/:uid
// @access : Admin
exports.getUser = async (req, res, next) => {
  try{
    const user = await User.findById(req.params.uid)

    if(!user){
      return res.status(400).json({sucess : false, message : 'Not found user with this id'})
    }

    return res.status(200).json({success : true, data : user})
  }
  catch(err){
    console.log(err.stack)
    return res.status(400).json({sucess : false})
  }
}

// @desc : Get all user (with filter, sort, select and pagination)
// @route : GET /api/users
// @access : Admin
exports.getUsers = async (req, res, next) => {
  try{
    const users = await User.find()

    if(!users){
      return res.status(400).json({sucess : false, message : 'Not found user with this id'})
    }

    return res.status(200).json({success : true, data : users})
  }
  catch(err){
    console.log(err.stack)
    return res.status(400).json({sucess : false})
  }
}