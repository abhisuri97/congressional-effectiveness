const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const hbs = require('hbs');

const config = require('../config.js');
const models = require('./models/allModels')
const index = require('../routes/index');

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

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '../views/partials');

// routes
app.use('/public',express.static(path.join(__dirname, '../public')));
app.use('/', index);

app.get('/', function(req, res, next) {
  res.send('Hello World!')
})

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), () => {
  console.log(`listening on port ${app.get('port')}`);
})
