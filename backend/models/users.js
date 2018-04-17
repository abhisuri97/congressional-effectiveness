const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  token: {
    type: String
  }
  password: {
    type: String,
    required: true,
    trim: true
  },
  following: [{
    type: Schema.ObjectId
  }]
})

const User = mongoose.model('User', userSchema)
module.exports = User
