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
  //var bills;
  //var votes;
  //getBillsByMember(req.params['member_id']).then((billsList) => {
    //bills = billList;
    //return getVotesByMember(req.params['member_id'])
  //}).then((voteList) => {
    //votes = voteList;
    //return getCongressionalSessionsByMember
  //})
  queries.getAllInfo(req.params['member_id']).then((info) => {
    var infoObj = {
      name: `${info.first_name} ${info.middle_name} ${info.last_name}`,
      party: (info.party == 'R') ? 'Republican' : ((info.party == 'D') ? 'Democrat' : `Other  (${info.party})`),
      inOffice : info.Congresses.filter((x) => x.number == '115').length > 0 ? 'Yes' : 'No',
      role: info.Member.map((x) => { if (x.Members_of_congress.leadership_role) return `${x.Members_of_congress.leadership_role} (${x.number}th congress)`} ),
      state: info.state,
      url: info.last_url,
      image: info.image,
      pct: info.Congresses.map((x) => { return `${x.Voting.votes_with_party_pct}% (${x.number}th congress)`}),
      missed: info.Congresses.map((x) => { return `${x.Voting.missed_votes} (${x.number}th congress)`}),
      total: info.Congresses.map((x) => { return `${x.Voting.total_votes} (${x.number}th congress}`}),
      billCount: info.Bills.length,
      bills: info.Bills
    }
    res.render('index', {
      tab: 'representatives',
      member_id: req.params['member_id'],
      info: infoObj
    })
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
