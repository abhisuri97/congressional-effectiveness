const config = require('../config.js');
var pg = require('pg');
module.exports = (function() {
  var dbName = config.sql.name;
  var username = config.sql.uName;
  var password  = config.sql.pass;
  var host = config.sql.host;

  var conStringPri = 'postgres://' + username + ':' + password + '@' + host + '/postgres';
  var conStringPost = 'postgres://' + username + ':' + password + '@' + host + '/' + dbName;

  var pool =  new pg.Pool(conStringPri);
  pool.connect(function(err, client, done) { 
    // create the db and ignore any errors, for example if it already exists.
    if (err) {
      console.log(err)
    }
    client.query('CREATE DATABASE ' + dbName, function(err) {
      //db should exist now, initialize Sequelize
      console.log('done');
      client.end(); // close the connection
    });
  });
  pool.end()
})()
