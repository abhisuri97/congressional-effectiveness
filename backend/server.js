const express = require('express');
const mongoose = require('mongoose');
const config = require('../config.js');
const models = require('./models/allModels')

// mongoose connection call
mongoose.connect(config.database)
  .catch((err) => {
    console.log('Error on mongodb connection: ')
    console.log(err.message);
    process.exit()
  })
// promisify all mongoose functions
mongoose.Promise = global.Promise 

const app = express()
app.set('secret', config.secret);

// bodyparser middleware JIC

app.get('/', function() {
  res.send('hello world')
})

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), () => {
  console.log(`listening on port ${app.get('port')}`);
})
