const Reserve = require('../models/Reserve')

// @desc    Get all reserve (with filter, sort, select and pagination)
// @route   GET /api/reserves
// @access  Admin & Private (me)
exports.getReserves = async (req, res, next) => {
  try {
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

    queryStr = JSON.parse(queryStr)

    if (req.params.sid && req.params.cgid) {
      queryStr.campground = req.params.cgid
      queryStr.site = req.params.sid
    } else if (req.params.cgid) {
      queryStr.campground = req.params.cgid
    } else if (req.params.uid) {
      queryStr.user = req.params.uid
    }

    if (req.user.role !== 'admin') {
      queryStr.user = req.user.id
    }

    console.log(queryStr)
    query = Reserve.find(queryStr)
      .populate({
        path: 'campground',
        select: 'name tel address',
      })
      .populate({
        path: 'user',
        select: 'tel',
      })
      .populate({
        path: 'site',
        select: 'zone number size',
      })

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
      query = query.sort('-createdAt')
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 25
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = await Reserve.countDocuments()

    query = query.skip(startIndex).limit(limit)

    // Executing
    const reserves = await query

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
      count: reserves.length,
      pagination,
      data: reserves,
    })
  } catch (err) {
    console.log(err.stack)
    return res.status(400).json({ sucess: false })
  }
}
