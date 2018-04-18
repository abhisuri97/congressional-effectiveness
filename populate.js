const models = require('./models.js');
const Representative = models.Representative;
const Congress = models.Congress;
const Members_of_congress = models.Members_of_congress;
const Voting = models.Voting;
const s = models.sequelize;
const csv = require('csvtojson');
const path = require('path')
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

//pcsv(path.join(__dirname, 'files', 'representatives.csv')).then((objs) => {
  //var reprArr = []
  //objs.forEach((o) => {
    //reprArr.push(s.sync().then(() => { 
      //return Representative.create({
        //member_id: o.id,
        //first_name: o.first_name,
        //last_name: o.last_name,
        //middle_name: o.middle_name,
        //state: o.state,
        //party: o.party
      //})
    //}))
  //})
  //return Promise.all(reprArr)
//}).then((arr) => {
  //console.log(arr)
//}).catch((err) => {
  //console.log(err)
//})
//pcsv(path.join(__dirname, 'files', 'congress.csv'))
//.then((objs) => {
  //var congArr =  [];
  //objs.forEach((o) => {
    //congArr.push(s.sync().then(() => {
      //return Congress.create({
                             //number: o.number,
                             //chamber: o.chamber
      //})
    //}))
  //})
  //return Promise.all(congArr);
//}).then((arr) => { console.log(arr) })
//.catch((err) => { console.log(err) })
pcsv(path.join(__dirname, 'files', 'voting.csv'))
.then((objs) => {
  var voteArr =  [];
  objs.forEach((o) => {
    console.log(o)
    if (o.congress_number && o.chamber) {
      voteArr.push(s.sync().then(() => {
        return Voting.create({
          member_id: o.member_id,
          congress_number_chamber: o.congress_number + '_' + o.chamber,
          missed_votes: o.missed_votes,
          total_votes: o.total_votes,
          votes_with_party_pct: o.votes_with_party_pct
        })
      }))
    }
  })
  return Promise.all(voteArr);
}).then((arr) => { console.log(arr) })
.catch((err) => { console.log(err); process.exit(0) })
//.then(()  => {
  //return pcsv(path.join(__dirname, 'files', 'members_of_congress.csv'))
//}).then((objs) => {
  //var membersArr = [];
  //objs.forEach((o) => {
    //if (o.congress_number && o.chamber) {
      //membersArr.push(s.sync().then(() => {
        //return Members_of_congress.create({
          //member_id: o.member_id,
          //congress_number_chamber: o.congress_number + '_' + o.chamber,
          //leadership_role: o.leadership_role,
          //title: o.title
        //})
      //}))
    //}
  //})
  //return Promise.all(membersArr);
//}).then((arr) => {
  //console.log(arr)
//}).catch((err) => {
  //console.log(err); process.exit(0)
//})

                        // id, member_id, congress_number_chamber, leadership_role, title

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
