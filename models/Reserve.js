const mongoose = require("mongoose");

const ReserveSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.objectId, ref: "User", required: true },
  campground: {
    type: mongoose.Schema.objectId,
    ref: "Campground",
    required: true,
  },
  site: {
    number: { type: Number, require: true },
    zone: { type: String },
    size: {
      width: { type: Number, require: true },
      length: { type: Number, require: true },
    },
  },
  start_date: { type: Date, require: true },
  end_date: { type: Date, require: true },
  tent_size: {
    width: { type: Number, require: true },
    length: { type: Number, require: true },
  },
  amount: { type: Number, require: true },
  reservedAt: { type: DataTransfer, default: Date.now },
});
