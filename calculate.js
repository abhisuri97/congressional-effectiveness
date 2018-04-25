const models = require('./models.js');
const Sequelize = require('sequelize')
const Op = Sequelize.Op;
const Representative = models.Representative;
const Congress = models.Congress;
const Members_of_congress = models.Members_of_congress;
const Committee = models.Committee;
const Member_of_committee = models.Member_of_committee;
const Bill = models.Bill;
const queries = require('./queries')
const Voting = models.Voting;
const s = models.sequelize;
let maxCommittee;
let maxCC;
let alignRank;

Bill.findAll({
  attributes: ['sponsor_id', 'congress', [s.fn('count', s.col('sponsor_id')), 'cnt']],
  group: ['sponsor_id', 'congress'],
  order: [[s.literal('cnt'), 'DESC']]
}).then((g) => {
  var rr = {'113':  [], '114': [], '115': []}
  g.forEach((t) => {
    rr[t.congress].push(t)
  })
  var cw = Object.keys(rr).map((sess) => {
    return rr[sess].map((t, idt) => {
      return Representative.findOne({
        where: { member_id: t.sponsor_id },
        include: [{
          model: Congress,
          as: 'Member'
        }]
      }).then((rep) => {
        //console.log(JSON.stringify(rep, null, 2))
        return rep.Member.map((csess, cid) => {
          if (csess.number == t.congress) {
            var id = rep.Member[cid].Members_of_congress.id;
            return Members_of_congress.findOne({ where: { id: id }}).then((moc) => {
              moc.bill_rank = idt + 1;
              return moc.save();
            })
          } else {
            return;
          }
        })
      })
    })
  })
  return Promise.all(cw);
}).then((res) => {
  return;
}).then(() => {
  return Bill.findAll({
    where: { enacted: { [Op.ne]: '' }},
    attributes: ['sponsor_id', 'congress', [s.fn('count', s.col('sponsor_id')), 'cnt']],
    group: ['sponsor_id', 'congress'],
    order: [[s.literal('cnt'), 'DESC']]
  })
}).then((g) => {
  var rr = {'113':  [], '114': [], '115': []}
  g.forEach((t) => {
    rr[t.congress].push(t)
  })
  var cw = Object.keys(rr).map((sess) => {
    return rr[sess].map((t, idt) => {
      return Representative.findOne({
        where: { member_id: t.sponsor_id },
        include: [{
          model: Congress,
          as: 'Member'
        }]
      }).then((rep) => {
        //console.log(JSON.stringify(rep, null, 2))
        return rep.Member.map((csess, cid) => {
          if (csess.number == t.congress) {
            var id = rep.Member[cid].Members_of_congress.id;
            return Members_of_congress.findOne({ where: { id: id }}).then((moc) => {
              moc.bill_pass_rank = idt + 1;
              return moc.save();
            })
          } else {
            return;
          }
        })
      })
    })
  })
  return Promise.all(cw);
}).then((res) => {
  return;
}).then(() => {
  return Voting.findAll({
    order: [s.literal('missed_votes')]
  })
}).then((g) => {
  var rr = {'113':  [], '114': [], '115': []}
  g.forEach((t) => {
    rr[t.congress_number_chamber.split('_')[0]].push(t)
  })
  var cw = Object.keys(rr).map((sess) => {
    return rr[sess].map((t, idt) => {
      return Representative.findOne({
        where: { member_id: t.member_id },
        include: [{
          model: Congress,
          as: 'Member'
        }]
      }).then((rep) => {
        //console.log(JSON.stringify(rep, null, 2))
        return rep.Member.map((csess, cid) => {
          if (csess.number == t.congress_number_chamber.split('_')[0]) {
            var id = rep.Member[cid].Members_of_congress.id;
            return Members_of_congress.findOne({ where: { id: id }}).then((moc) => {
              moc.miss_rank = idt + 1;
              return moc.save();
            })
          } else {
            return;
          }
        })
      })
    })
  })
  return Promise.all(cw);
}).then((res) => {
  console.log(JSON.stringify(res, null, 2))
}).then(() => {
  return Voting.findAll({
    order: [s.literal('votes_with_party_pct')]
  })
}).then((g) => {
  var rr = {'113':  [], '114': [], '115': []}
  g.forEach((t) => {
    rr[t.congress_number_chamber.split('_')[0]].push(t)
  })
  var cw = Object.keys(rr).map((sess) => {
    return rr[sess].map((t, idt) => {
      return Representative.findOne({
        where: { member_id: t.member_id },
        include: [{
          model: Congress,
          as: 'Member'
        }]
      }).then((rep) => {
        //console.log(JSON.stringify(rep, null, 2))
        return rep.Member.map((csess, cid) => {
          if (csess.number == t.congress_number_chamber.split('_')[0]) {
            var id = rep.Member[cid].Members_of_congress.id;
            return Members_of_congress.findOne({ where: { id: id }}).then((moc) => {
              moc.align_rank = idt + 1;
              return moc.save();
            })
          } else {
            return;
          }
        })
      })
    })
  })
  return Promise.all(cw);
}).then((res) => {
  console.log(JSON.stringify(res, null, 2))
}).then(() => {
  return Member_of_committee.findAll({
    attributes: ['member_id', [s.fn('count', s.col('member_id')), 'cnt']],
    group: ['member_id'],
    order: [[s.literal('cnt'), 'DESC']]
  })
}).then((g) => {
  var cw = g.map((t, idt) => {
      return Representative.findOne({
        where: { member_id: t.member_id },
        include: [{
          model: Congress,
          as: 'Member'
        }]
      }).then((rep) => {
        //console.log(JSON.stringify(rep, null, 2))
        return rep.Member.map((csess, cid) => {
          if (csess.number == 115) {
            var id = rep.Member[cid].Members_of_congress.id;
            return Members_of_congress.findOne({ where: { id: id }}).then((moc) => {
              moc.committee_rank = idt + 1;
              return moc.save();
            })
          } else {
            return;
          }
        })
      })
    })
  return Promise.all(cw);
}).then((res) => {
  console.log(JSON.stringify(res, null, 2))
}).then(() => {
  return Member_of_committee.findAll({
    where: { m_rank: '1' },
    attributes: ['member_id', [s.fn('count', s.col('member_id')), 'cnt']],
    group: ['member_id'],
    order: [[s.literal('cnt'), 'DESC']]
  })
}).then((g) => {
  var cw = g.map((t, idt) => {
      return Representative.findOne({
        where: { member_id: t.member_id },
        include: [{
          model: Congress,
          as: 'Member'
        }]
      }).then((rep) => {
        //console.log(JSON.stringify(rep, null, 2))
        return rep.Member.map((csess, cid) => {
          if (csess.number == 115) {
            var id = rep.Member[cid].Members_of_congress.id;
            return Members_of_congress.findOne({ where: { id: id }}).then((moc) => {
              moc.committee_chair_rank = idt + 1;
              return moc.save();
            })
          } else {
            return;
          }
        })
      })
    })
  return Promise.all(cw);
}).then((res) => {
  console.log(JSON.stringify(res, null, 2))
}).then(()  => {
  return queries.getMaxCommitteeRank()
}).then((max) => maxCommittee=max)
.then(() => { 
  return queries.getMaxCommitteeChairRank()
}).then((r) => {
  maxCC = r;
})
.then(() => {
  return Representative.findAll()
}).then((reps) => {
  var calc = reps.map((r) => {
    return queries.getAllInfo(r.member_id).then((info) => {
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
      var overallA = ((1-(overall/6)) * 4)
      info.grade = overallA;
      return info.save()
    })
  })
  return Promise.all(calc)
})
