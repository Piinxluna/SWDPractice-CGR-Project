const mongoose = require('mongoose')

const SiteSchema = new mongoose.Schema({
  zone: String,
  number: {
    type: Number,
    required: [true, 'Please add a unique site number'],
  },
  size: {
    type: {
      swidth: {
        type: Number,
        min: 0,
        required: [true, 'Please add a site width'],
      },
      slength: {
        type: Number,
        min: 0,
        required: [true, 'Please add a site length'],
      },
    },
  },
})

module.exports = mongoose.model('Site', SiteSchema)
