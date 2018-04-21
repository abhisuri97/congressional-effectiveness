var express = require('express')
var router = express.Router()
var async = require('async')
var queries = require('../queries');

router.get('/', function(req, res, next) {
  res.redirect('/representatives')
})

router.get('/representatives', function(req, res, next) {
  queries.getAllReps().then((resp) => {
    res.render('index', {
      tab: 'representatives',
      reps: resp
    })
  })
})

router.get('/representatives/:member_id', function(req, res, next) {
  res.render('index', {
    tab: 'representatives',
    member_id: req.params['member_id']
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