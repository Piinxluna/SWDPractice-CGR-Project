const Campground = require('../models/Campground')

// @desc : Get all campgrounds (with filter, sort, select and pagination)
// @route : GET /api/campgrounds
// @access : Public
exports.getCampgrounds = async (req, res, next) => {
  try {
    //console.log(req.params.id);
    let query

    // Copy req.query
    const reqQuery = { ...req.query }

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit']

    // Loop over to remove fields and delete from reqQuery
    removeFields.forEach((param) => delete reqQuery[param])

    let queryStr = JSON.stringify(reqQuery)

    // Create operator $gt $gte
    queryStr = queryStr.replace(
      /\b(gt|get|lt|lte|in)\b/g,
      (match) => `$${match}`
    )
    query = Campground.find(JSON.parse(queryStr))

    // Select field
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ')
      query = query.select(fields)
    } else {
      query = query.select('-sites')
    }

    // Sort field
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ')
      query = query.sort(sortBy)
    } else {
      query = query.sort('name')
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 25
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = await Campground.countDocuments()

    query = query.skip(startIndex).limit(limit)

    // Executing
    const campgrounds = await query

    // Pagination result
    const pagination = {}

    // Check if can goto next or prev page
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      }
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      }
    }

    // Send response
    return res.status(200).json({
      success: true,
      count: campgrounds.length,
      pagination,
      data: campgrounds,
    })
  } catch (err) {
    console.log(err.stack)
    return res.status(400).json({ sucess: false })
  }
}
exports.createCampground = async (req,res,next) =>{
  const campground = await Campground.create(req.body);
  return res.status(201).json({
    success:true,
    data : campground
  });
};

exports.getCampground = async (req,res,next) =>{
  try{
    const campground = await Campground.findById(req.params.id);
    if(!campground) {
      return res.status(400).json({success:false});
    }
    return res.status(200).json({success:true,data:campground});
  } catch(err){
    return res.status(400).json({success:false});
  }
}

exports.updateCampground = async (req,res,next) => {
  try{
    console.log(req.params.id,req.body); 
    const campground = await Campground.findByIdAndUpdate(req.params.id , req.body,{
      new : true,
      runValidators : true
    });
    if(!campground) {
      return res.status(400).json({success:false});
    }

    res.status(201).json({success:true ,data : campground});
  }
  catch(err) {
    res.status(400).json({success:false});
  }
}

exports.deleteCampground = async (req,res,next) =>{
  try{
    const campground = await Campground.findById(req.params.id);

    if(!campground) {
      return res.status(400).json({success:false});
    }

    await campground.deleteOne();
     res.status(200).json({success:true, data:{}});
  }catch(err){
    res.status(400).json({success:false});
  }
}