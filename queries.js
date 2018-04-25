const models = require('./models.js');
const Representative = models.Representative;
const Congress = models.Congress;
const Members_of_congress = models.Members_of_congress;
const Committee = models.Committee;
const Member_of_committee = models.Member_of_committee;
const Bill = models.Bill;
const Voting = models.Voting;
const s = models.sequelize;

// get all bills made by a certain person

const getBillsByMember = (id) => {
  return Representative.findOne({ where: { member_id: id }})
  .then((res) => {
    if (res) {
      return res.getBills()
    } else {
      throw new Error('No representative with that id found')
    }
  })
}
// example call
//getBillsByMember('S000250').then((res) => { res.forEach(bill => console.log(bill.title)) });

const getVotesByMember = (id) => {
  return Representative.findOne({ where: { member_id: id }})
  .then((res) => {
    if (res) {
      return res.getCongresses();
    } else {
      throw new Error('No representative with that id found')
    }
  })
}

//getVotesByMember('S000250').then((res) => { res.forEach(congress => console.log(congress.Voting.votes_with_party_pct)) });

const getCongressionalSessionsByMember = (id) => {
  return Representative.findOne({ where: { member_id: id }})
  .then((res) => {
    if (res) {
      return res.getMember();
    } else {
      throw new Error('No representative with that id found')
    }
  })
}

//getCongressionalSessionsByMember('S000250').then((res) => {
  //res.forEach((congress) => {
    //console.log(congress.Members_of_congress.title)
  //})
//})

const getChairsByMember = (id) => {
  return Representative.findOne({ where: { member_id: id }}).then((res) => {
    if (res) {
      return res.getChair();
    } else {
      throw new Error('No representative with that id found')
    }
  })
}

//getChairsByMember('S000250').then((res) => {
  //res.forEach((congress) => {
    //console.log(congress.Chair_of_Committee.committee_id)
  //})
//})

const getAllReps = () => {
  var reps;
  return Representative.findAll({
    include: [{
      model: Congress
    }]
  }).then((reps) => {
    reps.forEach((i) => {
      i.Congresses = i.Congresses.sort((a, b) => {
        return a.number -  b.number
      })
    })
    return reps;
  })
}

const getAllInfo = (id) => {
  return Representative.findOne({
    where: { member_id: id },
    include: [
    {
      model: Congress,
    },
    {
      model: Congress,
      as: 'Member'
    },
    {
      model: Committee,
      as: 'CommitteeMember'
    },
    {
      model: Bill,
      as: 'Bills'
    }]
  }).then((rep) => {
    return rep;
  })
}

const getAllBills = () => {
  return Bill.findAll({
    include: [{
      model: Representative,
    }]
  })
}

const getMaxCommitteeRank = () => {
  return Members_of_congress.max('committee_rank').then((r) => { console.log(r); return r})
}
const getMaxCommitteeChairRank = () => {
  return Members_of_congress.max('committee_chair_rank').then((r) => { console.log(r); return r})
}
//getAllReps().then((res) => {
  //console.log(res);
  //res.forEach((rep) => { console.log(rep.first_name + ' ' +  rep.last_name) })
//})

const getReps = (memberIds) => {
  var reps;
  return Representative.findAll({
    where: {
      member_id: memberIds
    },
    include: [{
      model: Congress
    }]
  }).then((reps) => {
    console.log(reps)
    // reps.forEach((i) => {
    //   i.Congresses = i.Congresses.sort((a, b) => {
    //     return a.number -  b.number
    //   })
    // })
    return reps;
  })
}

module.exports = {
  getBillsByMember,
  getAllReps,
  getAllInfo,
  getAllBills,
  getMaxCommitteeRank,
  getMaxCommitteeChairRank,
  getReps
}
