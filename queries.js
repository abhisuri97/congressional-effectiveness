const models = require('./models.js');
const Representative = models.Representative;
const Congress = models.Congress;
const Members_of_congress = models.Members_of_congress;
const Committee = models.Committee;
const Chair_of_committee = models.Chair_of_committee;
const Bill = models.Bill;
const Voting = models.Voting;
const s = models.sequelize;


// get all bills made by a certain person

const getBillsByMember = (id) => {
  return s.sync().then(() => {
    return Representative.findOne({ where: { member_id: id }})
  }).then((res) => {
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
  return s.sync().then(() => {
    return Representative.findOne({ where: { member_id: id }})
  }).then((res) => {
    if (res) {
      return res.getCongresses();
    } else {
      throw new Error('No representative with that id found')
    }
  })
}

//getVotesByMember('S000250').then((res) => { res.forEach(congress => console.log(congress.Voting.votes_with_party_pct)) });

const getCongressionalSessionsByMember = (id) => {
  return s.sync().then(() => {
    return Representative.findOne({ where: { member_id: id }})
  }).then((res) => {
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
  return s.sync().then(() => {
    return Representative.findOne({ where: { member_id: id }})
  }).then((res) => {
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
  return s.sync().then(() => {
    return Representative.findAll()
  })
}

//getAllReps().then((res) => {
  //console.log(res);
  //res.forEach((rep) => { console.log(rep.first_name + ' ' +  rep.last_name) })
//})
