const mongoose = require('mongoose')
const bcrypt = require('bcryptjs') // Encrypter
const jwt = require('jsonwebtoken') // JWT

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Please add a name'],
  },
  tel: {
    type: String,
    minLength: 10,
    maxLength: 20,
    pattern: '^([0-9]{3}|[0-9]{2})-[0-9]{3}-[0-9]{4}$',
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false, // not show when query
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer',
  },
})

//Encrypt Password
UserSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

//Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id }, // get only id from user
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  )
}

module.exports = mongoose.model('User', UserSchema)
