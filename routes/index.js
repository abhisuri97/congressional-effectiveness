var express = require('express')
var router = express.Router()
var async = require('async')
var queries = require('../queries')
const bcrypt = require('bcrypt')
var userdb = require('../backend/models/users')

router.get('/', function(req, res, next) {
  res.redirect('/representatives')
})

router.get('/representatives', function(req, res, next) {
  queries.getAllReps().then((resp) => {
    res.render('index', {
      tab: 'representatives',
      username: req.session.username,
      reps: resp
    })
  })
})

const getGrade = (a) => {
  if (a >= 2.7) { return 'A+' }
  if (a >= 2.4) { return 'A' }
  if (a >= 2.1) { return 'A-' }
  if (a >= 1.8) return 'B+'
  if (a  >= 1.5) return 'B'
  if (a  >= 1.2) return 'B-'
  if (a >= 0.9) return 'C+'
  if (a >= 0.6) return 'C'
  if (a >= 0.5) return 'C'
  if (a >= 0.4) return 'D'
  else return 'F'
}

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
  var maxCommittee;
  var maxCC;
  var alignRank;
  queries.getMaxCommitteeRank().then((max) => maxCommittee=max).then(() => {
    return queries.getMaxCommitteeChairRank()
  }).then((r) => {
    maxCC = r;
  }).then(() => {
    return queries.getAllInfo(req.params['member_id'])
  }).then((info) => {
    committeeRank  = info.Member.filter((x) => { return x.number == 115 })[0].Members_of_congress.committee_rank
    committeeChairRank =info.Member.filter((x) => { return x.number == 115 })[0].Members_of_congress.committee_chair_rank
    committeeChairRank = (committeeChairRank ? committeeChairRank : maxCC)
    committeeRank = (committeeRank ? committeeRank : maxCommittee)
    alignRank =info.Member.map((x) => (x.Members_of_congress.align_rank)? `${x.Members_of_congress.align_rank}/537` : '537/537')
    alignRankC = alignRank.reduce(function(p,c,i,a){return p + (eval(c)/a.length)},0)
    console.log(alignRankC)
    missRank =info.Member.map((x) =>  (x.Members_of_congress.miss_rank) ? `${x.Members_of_congress.miss_rank}/537` : '537/537')
    missRankC = missRank.reduce(function(p,c,i,a){return p + (eval(c)/a.length)},0)
    billRank = info.Member.map((x) => (x.Members_of_congress.bill_rank) ? `${x.Members_of_congress.bill_rank}/537` : '537/537')
    billRankC = billRank.reduce(function(p,c,i,a){return p + (eval(c)/a.length)},0)
    billPassRank = info.Member.map((x) => (x.Members_of_congress.bill_pass_rank) ? `${x.Members_of_congress.bill_pass_rank}/537` : '537/537')
    billPassRankC = billPassRank.reduce(function(p,c,i,a){return p + (eval(c)/a.length)},0)
    var  overall = eval(committeeRank + '/' + maxCommittee) + eval(committeeChairRank + '/' + maxCC) + eval(alignRankC) + eval(missRankC) + eval(billRankC) + eval(billPassRankC)
    console.log(overall/6)
    console.log((1-(overall/6)) * 4)
    overallA = getGrade((1-(overall/6)) * 4)
    var infoObj = {
      name: `${info.first_name} ${info.middle_name} ${info.last_name}`,
      party: (info.party == 'R') ? 'Republican' : ((info.party == 'D') ? 'Democrat' : `Other  (${info.party})`),
      inOffice : info.Congresses.filter((x) => x.number == '115').length > 0 ? 'Yes' : 'No',
      role: info.Member.map((x) => { if (x.Members_of_congress.leadership_role) return `${x.Members_of_congress.leadership_role} (${x.number}th congress)`} ),
      state: info.state,
      url: info.last_url,
      image: info.image,
      pct: info.Congresses.map((x, idx) => { return `${x.Voting.votes_with_party_pct}% (${x.number}th congress. Rank is ${alignRank[idx]})`}),
      missed: info.Congresses.map((x, idx) => { return `${x.Voting.missed_votes} (${x.number}th congress. Rank is ${missRank[idx]})  `}),
      total: info.Congresses.map((x, idx) => { return `${x.Voting.total_votes} (${x.number}th congress)`}),
      billCount: info.Bills.length,
      bills: info.Bills,
      committees: info.CommitteeMember,
      committeeRank:  (committeeRank ? committeeRank : maxCommittee) + '/' + maxCommittee,
      committeeChairRank: (committeeChairRank ? committeeChairRank : maxCC) + '/' + maxCC,
      alignRank: alignRank,
      missRank: missRank,
      billRank: `(Bill ranking is ${billRank})`,
      overallA:  overallA
    }
    if (req.session.username) {
      userdb.getFollowing(req.session.username, function (err, memberIds) {
        res.render('index', {
          tab: 'representatives',
          username: req.session.username,
          member_id: req.params['member_id'],
          following: memberIds.includes(req.params['member_id']),
          info: infoObj
        })
      })
    } else {
      res.render('index', {
        tab: 'representatives',
        username: req.session.username,
        member_id: req.params['member_id'],
        following: false,
        info: infoObj
      })
    }
  })
})

router.post('/representatives/:member_id/follow', function (req, res, next) {
  if (!req.session.username) {
    return res.redirect('back');
  }
  userdb.followRepresentative(req.session.username, req.params['member_id'], function(err) {
    if (err) console.log('Error following representative:' + err)
    res.redirect('back');
  })
})

router.post('/representatives/:member_id/unfollow', function (req, res, next) {
  if (!req.session.username) {
    return res.redirect('back');
  }
  userdb.unfollowRepresentative(req.session.username, req.params['member_id'], function(err) {
    if (err) console.log('Error unfollowing representative:' + err)
    res.redirect('back');
  })
})

router.get('/bills', function(req, res, next) {
  queries.getAllBills().then((bills) => {
    res.render('index', {
      tab: 'bills',
      username: req.session.username,
      bills: bills
    })
  })
})

router.get('/committees', function(req, res, next) {
  res.render('index', {
    tab: 'committees',
    username: req.session.username
  })
})

router.get('/login', function(req, res, next) {
  res.render('login')
})

router.get('/signup', function(req, res, next) {
  res.render('signup')
})

router.post('/login', function (req, res, next) {
  username = req.body.username
  password = req.body.password

  if (!username || !password) {
    return res.render('login', {
      message: 'Please enter a username and password.'
    })
  }

  userdb.authenticateUser(username, password, function(err, isMatch, msg) {
    if (err) {
      console.log('Error authenticating user: ' + err)
      return res.render('login', {
        message: 'Could not authenticate user. Please try again.'
      })
    }
    if (isMatch) {
      req.session.username = username
      res.redirect('/')
    } else {
      res.render('login', {
        message: "The password you've entered is incorrect. Please try again."
      })
    }
  })
})

router.post('/signup', function(req, res, next) {
  username = req.body.username
  password = req.body.password
  password2 = req.body.password2

  if (!username || !password || !password2) {
    return res.render('signup', {
      message: 'Please enter a username and password.'
    })
  }
  if (password != password2) {
    return res.render('signup', {
      message: 'Passwords do not match. Please try again.'
    })
  }
  if (password.length < 6) {
    return res.render('signup', {
      message: 'Your password must be at least 6 characters long.'
    })
  }

  userdb.createAccount(username, password, function(err, success, msg) {
    if (err) {
      console.log('Error authenticating user: ' + err)
      return res.render('signup', {
        message: "Could not authenticate user. Please try again."
      })
    }
    if (success) {
      req.session.username = username
      res.redirect('/')
    } else {
      res.render('signup', {
        message: msg
      })
    }
  })
})

router.post('/logout', function (req, res, next) {
  req.session.destroy()
  res.redirect('/')
})

router.get('/profile', function (req, res, next) {
  if (!req.session.username) {
    return res.redirect('/')
  }
  userdb.getFollowing(username, function (err, memberIds) {
    console.log(memberIds)
    queries.getReps(memberIds).then((resp) => {
      res.render('index', {
        tab: 'profile',
        username: req.session.username,
        following: resp
      })
    })
  })
})

module.exports = router
