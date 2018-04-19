const models = require('./models.js');
const Representative = models.Representative;
const Congress = models.Congress;
const Members_of_congress = models.Members_of_congress;
const Committee = models.Committee;
const Chair_of_committee = models.Chair_of_committee;
const Bill = models.Bill;
const Voting = models.Voting;
const s = models.sequelize;
const csv = require('csvtojson');
const path = require('path')
const infoRaw = require('./files/legislators-current.json')
const info = {}
infoRaw.forEach((i) => {
  info[i.id.bioguide] = i
})

// welcome to callback hell


// Step 1: Import the base relationships


// set up representatives

const pcsv = (file) => {
  return new Promise((res, rej) => {
    var jsonObjs = []
    csv().fromFile(file).on('json', (obj) => {
      jsonObjs.push(obj)
    }).on('done',(err) => {
      if (err) { rej(err) }
      else { res(jsonObjs) }
    })
  })
}

s.sync().then(() => {
  return pcsv(path.join(__dirname, 'files', 'representatives.csv'))
}).then((objs) => {
  var reprArr = []
  objs.forEach((o) => {
    var infoObjRaw = info[o.id].terms
    var infoObj = infoObjRaw[infoObjRaw.length - 1]
    reprArr.push(Representative.create({
        member_id: o.id,
        first_name: o.first_name,
        last_name: o.last_name,
        middle_name: o.middle_name,
        state: o.state,
        party: o.party,
        last_term_start: infoObj ? infoObj.start : '', 
        last_term_end: infoObj ? infoObj.end : '',
        last_url: infoObj ? infoObj.url : ''
    }))
  })
  return Promise.all(reprArr)
}).then((arr) => {
  console.log('done adding reps: Added ' + arr.length)
}).catch((err) => {
  console.log(err)
}).then(() => { return pcsv(path.join(__dirname, 'files', 'congress.csv')) })
.then((objs) => {
  var congArr =  [];
  objs.forEach((o) => {
    congArr.push(Congress.create({
        number: o.number,
        chamber: o.chamber
      }))
  })
  return Promise.all(congArr);
}).then((arr) => { 
  console.log('done adding congress: Added ' + arr.length)
})
.catch((err) => { console.log(err) }).then(() => { return pcsv(path.join(__dirname, 'files', 'voting.csv')) })
.then((objs) => {
  var voteArr =  [];
  objs.forEach((o) => {
    if (o.congress_number && o.chamber) {
      voteArr.push(Voting.create({
          member_id: o.member_id,
          congress_number_chamber: o.congress_number + '_' + o.chamber,
          missed_votes: o.missed_votes,
          total_votes: o.total_votes,
          votes_with_party_pct: o.votes_with_party_pct
        }))
    }
  })
  return Promise.all(voteArr);
}).then((arr) => { 
  console.log('done adding voting: Added ' + arr.length)
})
.catch((err) => { console.log(err);  })
.then(()  => {
  return pcsv(path.join(__dirname, 'files', 'members_of_congress.csv'))
}).then((objs) => {
  var membersArr = [];
  objs.forEach((o) => {
    if (o.congress_number && o.chamber) {
      membersArr.push(Members_of_congress.create({
          member_id: o.member_id,
          congress_number_chamber: o.congress_number + '_' + o.chamber,
          leadership_role: o.leadership_role,
          title: o.title
        }))
    }
  })
  return Promise.all(membersArr);
}).then((arr) => {
  console.log('done adding members_of_cong: Added ' + arr.length)
}).catch((err) => {
  console.log(err); 
})
.then(()  => {
  return pcsv(path.join(__dirname, 'files', 'committee.csv'))
}).then((objs) => {
  var committeeArr = [];
  objs.forEach((o) => {
      committeeArr.push(Committee.create({
          committee_id: o.committee_id,
          chamber: o.chamber,
          name: o.name
        }))
  })
  return Promise.all(committeeArr);
}).then((arr) => {
  console.log('done adding committees: Added ' + arr.length)
}).catch((err) => {
  console.log(err); 
})
.then(()  => {
  return pcsv(path.join(__dirname, 'files', 'chair_of_committee.csv'))
}).then((objs) => {
  var committeeArr = [];
  objs.forEach((o) => {
      if (o.committee_id && o.chair_id) {
        committeeArr.push(Chair_of_committee.create({
            committee_id: o.committee_id,
            chair_id: o.chair_id,
        }))
      }
  })
  return Promise.all(committeeArr);
}).then((arr) => {
  console.log('done adding committee chairs: Added ' + arr.length)
}).catch((err) => {
  console.log(err); 
})
.then(()  => {
  return pcsv(path.join(__dirname, 'files', 'bill.csv'))
}).then((objs) => {
  var committeeArr = [];
  objs.forEach((o) => {
      if (o.sponsor_id) {
        committeeArr.push(Bill.create({
          bill_id: o.bill_id,
          bill_type:  o.bill_type,
          title: o.title,
          sponsor_id: o.sponsor_id,
          congress: o.congress,
          chamber: o.chamber,
          active: o.active,
          house_passage: o.house_passage,
          senate_passage: o.senate_passage,
          enacted: o.enacted,
          cosponsors_by_party: o.cosponsors_by_party,
          cosponsor: o.cosponsor
        }))
      }
  })
  return Promise.all(committeeArr);
}).then((arr) => {
  console.log('done adding bills: Added ' + arr.length)
}).catch((err) => {
  console.log(err); 
})

                         //id, member_id, congress_number_chamber, leadership_role, title

//s.sync().then(() => {
  //return Congress.findOne({ where: { number: '115' }})
//}).then((res) => {
  //return res.getRepresentatives()
//}).then((res) => {
  //res.map((i) => {
    //console.log(i.Voting.votes_with_party_pct)
  //})
//}).catch((err) => {
  //console.log(err)
//})
