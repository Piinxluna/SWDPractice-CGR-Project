const User = require('../model/User')

//Get token from model create cookie and send res
const sendTokenResponse = (user, statusCode, res) => {
  // Create token 
  const token = user.getSignedJwtToken();

  const options = {
    expires : new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly : true
  };

  if(process.env.NODE_ENV === 'production'){
    options.secure = true;
  }

  res.status(statusCode).cookie('token', token, options).json({sucess : true, token});
}

// @desc    Create a new user (create and return token, save token in cookie)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const {name, tel, email, password, role} = req.body

    //Create user
    const user = await User.create({
      name,
      tel,
      email,
      password,
      role
    })

    sendTokenResponse(user, 200, res)
  }
  catch(err){
    res.status(400).json({sucess : false})
    console.log(err.stack)
  }
}

// @desc    Login with user's email and password (create and return token, save token in cookie)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  const {email, password} = req.body
  const resEmailPassword = res.status(400).json({sucess: false, msg : 'Please provide email and password'})
  const resCredentials = res.status(400).json({sucess: false, msg : 'Invalid Credentials'})

  //Check if email and password is valid
  if(!email || !password){
    return resEmailPassword
  }

  const user = await User.findOne({email}).select('+password');

  //Check if find the user or not 
  if(!user){
    return resCredentials
  }

  //Check if password match
  const isMatch = await user.matchPassword(password);

  if(!isMatch){
    return resCredentials
  }

  sendTokenResponse(user, 200, res)
}

// @desc : Get your user's data
// @route : GET /api/users/me
// @access : Private (Me)
exports.getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({success : true, data : user});
}