const models = require('./models.js');
const Representative = models.Representative;
const Congress = models.Congress;
const Members_of_congress = models.Members_of_congress;
const Committee = models.Committee;
const Member_of_committee = models.Member_of_committee;
const Bill = models.Bill;
const Voting = models.Voting;
const s = models.sequelize;

Bill.findAll({
  attributes: ['sponsor_id', 'congress', [s.fn('count', s.col('sponsor_id')), 'cnt']],
  group: ['sponsor_id', 'congress'],
  order: [[s.literal('cnt')]]
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
            console.log(JSON.stringify(id, null, 2));
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
  console.log(JSON.stringify(res, null, 2))
})
