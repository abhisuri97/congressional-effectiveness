var express = require('express')
var router = express.Router()
var async = require('async')

/* HOME */
router.get('/', function(req, res, next) {
  res.render('index')
})

module.exports = router
