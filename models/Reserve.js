const mongoose = require('mongoose')

const ReserveSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.objectId,
    ref: 'User',
    required: [true, 'Please add a user'],
  },
  campground: {
    type: mongoose.Schema.objectId,
    ref: 'Campground',
    required: [true, 'Please add a campground'],
  },
  site: {
    number: { type: Number, require: [true, 'Please add a site number'] },
    zone: String,
    size: {
      width: { type: Number, require: true },
      length: { type: Number, require: true },
    },
  },
  startDate: { type: Date, require: [true, 'Please add a start date'] },
  endDate: { type: Date, require: [true, 'Please add an end date'] },
  tentSize: {
    width: { type: Number, require: [true, 'Please add a tent width'] },
    length: { type: Number, require: [true, 'Please add a tent length'] },
  },
  amount: Number,
  reservedAt: { type: DataTransfer, default: Date.now },
})

module.exports = mongoose.model('Reserve', ReserveSchema)
