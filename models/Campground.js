const mongoose = require('mongoose')

const CampgroundSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Please add a name'],
  },
  tel: {
    type: String,
    minLength: 11,
    maxLength: 12,
    pattern: '^([0-9]{3}|[0-9]{2})-[0-9]{3}-[0-9]{4}$',
    require: [true, 'Please add a telephone number'],
  },
  address: {
    houseNumber: {
      type: String,
      require: [true, 'Please add a house number'],
    },
    lane: String,
    road: {
      type: String,
      require: [true, 'Please add a road'],
    },
    subDistrict: {
      type: String,
      require: [true, 'Please add a sub district'],
    },
    district: {
      type: String,
      require: [true, 'Please add a district'],
    },
    postalCode: {
      type: String,
      pattern: '^[0-9]{5}$',
      require: [true, 'Please add a postal code'],
    },
    link: String,
  },
  website: String,
  picture: [String],
  facilities: [String],
  tentForRent: {
    type: Boolean,
    require: [true, 'Please add if you have tents for rent'],
  },
  amount: {
    type: Number,
    min: 0,
    require: [true, 'Please add total amount'],
  },
  sites: [
    {
      zone: String,
      number: {
        type: Number,
        unique: true,
        required: [true, 'Please add a unique site number'],
      },
      size: {
        type: {
          width: {
            type: Number,
            min: 0,
            required: [true, 'Please add a site width'],
          },
          length: {
            type: Number,
            min: 0,
            required: [true, 'Please add a site length'],
          },
        },
      },
    },
  ],
})

module.exports = mongoose.model('Campground', CampgroundSchema)
