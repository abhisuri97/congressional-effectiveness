const Sequelize =  require('sequelize')
const sequelize = new Sequelize('postgres://localhost:5432/cis450-db')
const Representative = sequelize.define('representative', {
  apiId: { type: Sequelize.STRING, allowNull: false, primaryKey: true },
  apiUrl: { type: Sequelize.STRING, allowNull: false },
  firstName: { type: Sequelize.STRING },
  lastName: { type: Sequelize.STRING },
  totalVotes: { type: Sequelize.INTEGER, defaultValue: 0 },
  authorCount: { type: Sequelize.INTEGER, defaultValue: 0 },
  billsSponsored: { type: Sequelize.INTEGER, defaultValue: 0 },
  percentAlignment: { type: Sequelize.DOUBLE, defaultValue: 0 },
  committeeNum: { type: Sequelize.INTEGER, defaultValue: 0 }
});

const Bill = sequelize.define('bill', {
  apiId: { type: Sequelize.STRING, allowNull: false, primaryKey: true },
  apiUrl: { type: Sequelize.STRING, allowNull: false },
  billName: { type: Sequelize.STRING },
  partyType: { type: Sequelize.STRING },
});

const Committee = sequelize.define('committee', {
  apiId: { type: Sequelize.STRING, allowNull: false, primaryKey: true },
  apiUrl: { type: Sequelize.STRING, allowNull: false },
  committeeName: { type: Sequelize.STRING },
})

const Votes = sequelize.define('votes', {
  voteType: { type: Sequelize.STRING }
})
const Authors = sequelize.define('authors')
const MemberOf = sequelize.define('memberOf')

Representative.belongsToMany(Bill, { through: Votes })
Bill.belongsToMany(Representative, { through: Votes })

Representative.belongsToMany(Bill, { through: Authors })
Bill.belongsToMany(Representative, { through: Authors })

Representative.belongsToMany(Committee, { through: MemberOf })
Committee.belongsToMany(Representative, { through: MemberOf })

Representative.sync().then( () => {
  return Representative.create({
    firstName: 'abhi',
    lastName: 'suri'
  })
})

module.exports = { Representative, Votes, Authors, Bill, Committee, MemberOf }
