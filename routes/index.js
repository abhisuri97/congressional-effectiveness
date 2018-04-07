var express = require('express')
var router = express.Router()
var async = require('async')

router.get('/', function(req, res, next) {
  res.redirect('/representatives')
})

router.get('/representatives', function(req, res, next) {
  res.render('index', {
    tab: 'representatives'
  })
})

router.get('/bills', function(req, res, next) {
  res.render('index', {
    tab: 'bills'
  })
})

router.get('/committees', function(req, res, next) {
  res.render('index', {
    tab: 'committees'
  })
})

router.get('/login', function(req, res, next) {
  res.render('login')
})

router.get('/signup', function(req, res, next) {
  res.render('signup')
})

module.exports = router
