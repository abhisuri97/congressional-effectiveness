const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
var queries = require('../../queries')
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
      type: String
    }
  ]
})
const User = mongoose.model('User', userSchema)

// callback(err, isMatch, msg)
// isMatch is a boolean denoting if passwords matched
// msg is an error msg to pass back to the client
const authenticateUser = function (username, candidatePassword, callback) {
  User.findOne({
    username: username
  }, function (err, user) {
    if (err) return callback(err)
    if (!user) return callback(null, false, 'Username does not exist.')
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
const createAccount = function (username, password, callback) {
  User.findOne({
    username: username
  }, function (err, existingUser) {
    if (err) return callback(err)
    if (existingUser) {
      // username already exists
      return callback(null, false, 'Username already exists. Please pick another one.')
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

// callback(err)
const followRepresentative = function (username, repId, callback) {
  User.findOne({
    username: username
  }, function (err, user) {
    if (err) {
      return callback(err)
    }
    if (!user) {
      return callback('Error following representative: username ' + username + ' does not exist.')
    }
    if (!user.following.includes(repId)) {
      user.following.push(repId)
      user.save(function (err) {
        if (err) {
          return callback(err)
        }
      })
    }
    return callback(null)
  })
}

const unfollowRepresentative = function (username, repId, callback) {
  User.findOne({
    username: username
  }, function (err, user) {
    if (err) {
      return callback(err)
    }
    if (!user) {
      return callback('Error unfollowing representative: username ' + username + ' does not exist.')
    }
    var index = user.following.indexOf(repId)
    if (index > -1) {
      user.following.splice(index, 1)
      user.save(function (err) {
        if (err) {
          return callback(err)
        }
      })
    }
    return callback(null)
  })
}

const getFollowing = function (username, callback) {
  User.findOne({
    username: username
  }, function (err, user) {
    if (err) {
      return callback(err)
    }
    if (!user) {
      return callback('Error in getFollowing: ' + username + ' does not exist.')
    }
    callback(null, user.following)
  })
}

module.exports = {
  createAccount,
  authenticateUser,
  followRepresentative,
  unfollowRepresentative,
  getFollowing
}
