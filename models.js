const Sequelize = require('sequelize');
const config = require('./config.js');
const type = config[config.type]

const sequelize = new Sequelize(type.db, type.username, type.password, {
  host: type.host,
  dialect: 'postgres',
  pool: {
    min: 0,
    acquire: 30000,
  },
  operatorsAliases: false,
  logging: type.logging
});

var Representative = sequelize.define('Representative', {
  member_id: { type: Sequelize.STRING, primaryKey: true },
  first_name: { type: Sequelize.STRING }, 
  last_name: { type: Sequelize.STRING },
  middle_name: { type: Sequelize.STRING },
  state: { type: Sequelize.STRING },
  party: { type: Sequelize.STRING },
  last_term_start: { type: Sequelize.STRING },
  last_term_end: { type: Sequelize.STRING },
  last_url: { type: Sequelize.TEXT  },
  image: { type: Sequelize.TEXT }
}, {
  hooks: {
    beforeValidate : (rep, options) => {
      rep.image = `https://theunitedstates.io/images/congress/original/${rep.member_id}.jpg`
    }
  }
})

var Congress = sequelize.define('Congress', {
  number: { type: Sequelize.INTEGER },
  chamber: { type: Sequelize.STRING },
  number_chamber: { type: Sequelize.STRING, primaryKey: true },
}, { 
  hooks: {
    beforeValidate: (cong, options) => {
      cong.number_chamber = '' + cong.number + '_' + cong.chamber;
    }
  }
})

var Voting = sequelize.define('Voting', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  member_id: { type: Sequelize.STRING },
  congress_number_chamber: { type: Sequelize.STRING },
  missed_votes: {type:  Sequelize.STRING },
  total_votes: { type: Sequelize.STRING  },
  votes_with_party_pct: { type: Sequelize.STRING }
})

Representative.belongsToMany(Congress, { through: Voting, foreignKey: 'member_id' })
Congress.belongsToMany(Representative,  { through: Voting, foreignKey: 'congress_number_chamber' })

var Members_of_congress = sequelize.define('Members_of_congress', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  member_id: { type: Sequelize.STRING },
  congress_number_chamber: { type: Sequelize.STRING },
  leadership_role: { type: Sequelize.STRING },
  title: { type: Sequelize.STRING }
})

Representative.belongsToMany(Congress, { through: Members_of_congress, foreignKey: 'member_id', as: 'Member' })
Congress.belongsToMany(Representative, { through: Members_of_congress, foreignKey: 'congress_number_chamber', as: 'Session' })

var Committee = sequelize.define('Committee', {
  name: { type: Sequelize.STRING },
  committee_id: { type: Sequelize.STRING, primaryKey: true },
  chamber: { type: Sequelize.STRING }
})

var Chair_of_committee = sequelize.define('Chair_of_Committee', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  committee_id: { type: Sequelize.STRING },
  chair_id: { type: Sequelize.STRING }
})

Representative.belongsToMany(Committee, { through: Chair_of_committee, foreignKey: 'chair_id', as: 'Chair' })
Committee.belongsToMany(Representative, { through: Chair_of_committee, foreignKey: 'committee_id', as: 'CommiteeRep' })

var Bill = sequelize.define('Bill', {
  bill_id: { type: Sequelize.STRING },
  bill_unique_id: { type: Sequelize.STRING, primaryKey: true },
  bill_type: {type:  Sequelize.STRING },
  title: { type: Sequelize.TEXT },
  sponsor_id: { type: Sequelize.STRING },
  congress: { type: Sequelize.STRING },
  chamber: {type:  Sequelize.STRING },
  active: {type:  Sequelize.STRING },
  house_passage: { type: Sequelize.STRING },
  senate_passage: { type: Sequelize.STRING },
  enacted: { type: Sequelize.STRING },
  cosponsors_by_party: { type: Sequelize.STRING },
  cosponsor: {type:  Sequelize.STRING },
}, { 
  hooks: {
    beforeValidate: (bill, options) => {
      bill.bill_unique_id = '' + bill.bill_id + '_' + bill.chamber;
    }
  }
})

Representative.hasMany(Bill, {foreignKey: 'sponsor_id', sourceKey: 'member_id', as: 'Bills' })
Bill.belongsTo(Representative, { foreignKey: 'sponsor_id', targetKey: 'member_id' })

module.exports = {
  Representative: Representative,
  Congress: Congress,
  Voting: Voting,
  Members_of_congress: Members_of_congress,
  Committee: Committee,
  Bill: Bill,
  Chair_of_committee: Chair_of_committee,
  sequelize: sequelize
}
//var rep;
//var cong;
//var cong2;
//var committee;
//var bill;
//sequelize.sync()
  //.then(() => {
    //return Representative.create({
      //member_id: 'hi there'
    //})
  //})
  //.then((res) => {
    //rep = res;
    //return Congress.create({
      //number: '114',
      //chamber: 'test',
    //})
  //})
  //.then((res) => {
    //cong = res;
    //return Congress.create({
      //number: '115',
      //chamber: 'test',
    //})
  //})
  //.then((res) => {
    //cong2 = res;
    //rep.addCongress(cong)
  //})
  //.then((res) => {
    //rep.addMember(cong);
  //})
  //.then((res) => {
    //rep.addMember(cong2)
  //})
  //.then((res) => {
    //return Committee.create({
      //committee_id: 'test'
    //})
  //})
  //.then((res) => {
    //committee = res;
    //rep.addChair(committee)
  //})
  //.then((res) => {
    //return Bill.create({
      //bill_id: 'test1'
    //})
  //})
  //.then((res) => {
    //bill = res;
    //rep.addBills(bill)
  //})
//
