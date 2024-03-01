const mongoose = require('mongoose')

const ReserveSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Please add a user'],
  },
  campground: {
    type: mongoose.Schema.ObjectId,
    ref: 'Campground',
    required: [true, 'Please add a campground'],
  },
  site: {
    type: mongoose.Schema.ObjectId,
    ref: 'Site',
    required: [true, 'Please add a campground site'],
  },
  prefferedName: {
    type: String,
    require: [true, 'Please add your preferred name'],
  },
  startDate: { type: Date, require: [true, 'Please add a start date'] },
  endDate: { type: Date, require: [true, 'Please add an end date'] },
  tentSize: {
    width: { type: Number, min: 0, require: [true, 'Please add a tent width'] },
    length: {
      type: Number,
      min: 0,
      require: [true, 'Please add a tent length'],
    },
  },
  amount: {
    type: Number,
    min: 0,
  },
  reservedAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Reserve', ReserveSchema)
