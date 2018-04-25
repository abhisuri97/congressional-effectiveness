const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 5
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
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  following: [
    {
      type: Schema.ObjectId
    }
  ]
})
const User = mongoose.model('User', userSchema)

// callback(err, isMatch, msg)
// isMatch is a boolean denoting if passwords matched
// msg is an error msg to pass back to the client
var authenticateUser = function (username, candidatePassword, callback) {
  User.findOne({
    username: username
  }, function (err, user) {
    if (err) return callback(err)
    if (!user) return callback(null, false, 'Username does not exist')
    bcrypt.compare(candidatePassword, user.password, function (err, isMatch) {
      if (err) {
        return callback(err)
      }
      callback(null, isMatch)
    })
  })

}

// callback(err, success, msg)
// success is a boolean denoting if account was successfully created
// msg is an error msg to pass back to the client
var createAccount = function (username, password, callback) {
  User.findOne({
    username: username
  }, function (err, existingUser) {
    if (err) return callback(err)
    if (existingUser) {
      // username already exists
      return callback(null, false, 'Username already exists.')
    } else {
      var user = new User({username: username, password: password})
      // encrypt password
      bcrypt.hash(password, saltRounds, function (err, hash) {
        if (err) {
          return callback(err)
        }
        user.password = hash
        user.save(function (err) {
          if (err) {
            return callback(err)
          }
          callback(null, true, null)
        })
      })
    }
  })
}

var userdb = {
  createAccount: createAccount,
  authenticateUser: authenticateUser
}

module.exports = userdb
