const jwt = require('jsonwebtoken')
const User = require('../models/User')

//Protect route
exports.protect = async (req, res, next) => {
  let token
  const resMsg = res.status(401).json({sucess : false, message : 'Not authorize to access to access this route'})

  //Check if header is valid and have Bearer
  if(req.headers.authorization && req.headers.authorization.startWith('Bearer')){
    token = req.headers.authorization.split(' ')[1]
  }

  //Check if token is exits
  if(!token){
    return resMsg
  }

  try{
    //Verify token
    const decode = jwt.verify(token, process.env.JWT_SECRET)
    // console.log(decode);
    req.user = await User.findById(decode.id)
    next()
  }
  catch(err) {
    console.log(err.stack)
    return resMsg
  }
}

//Authorize role
exports.authorize = (...roles) => {
  return (req, res, next) => {

    //Check if this role have permission to access this route
    if(!roles.includes(req.user.role)){
      return res.status(403).json({sucess : false, massage : `User role ${req.user.role} is not allow to access this route`})
    }

    next();
  }
}