const Campground = require('../models/Campground')
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

// @desc : Create a reserve
// @route : POST /api/campgrounds/:cgid/sites/:sid/reserves
// @access : Registered user
exports.createReserve = async (req, res, next) => {
  try{
    req.body.campground = req.params.cgid
    req.body.site = req.params.sid

    const campgroundSite = await Campground.findOne({
      _id: req.params.cgid,
      sites: { $elemMatch: { _id: req.params.sid } }
    })
    
    if(!campgroundSite){
      return res.status(400).json({success : false, massage : 'Cannot find this site'});
    }

    //Add user id to req.body
    req.body.user = req.user.id

    const userExitedReserve = await Reserve.find({user : req.user.id});
    const exitedReserve = await Reserve.find({campground : req.params.cgid, site : req.params.sid, startDate : req.body.startDate});

    // Check if this slot is avalible
    if(exitedReserve){
      return res(400).json({success : false, message : 'There are someone book this site at this time'});
    }

    // Check if reserve more than 3
    if(userExitedReserve.length >= 3 && req.user.role !== 'admin'){
      return res.status(400).json({success : false, message : `User ID ${req.user.id} has 3 reserve`});
    } 

    const reserve = await Reserve.create(req.body);

    res.status(200).json({success : true, data : reserve});
  }
  catch(err){

  }
}