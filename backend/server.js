const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session')
const hbs = require('hbs');

const config = require('../config.js');
const index = require('../routes/index');
const datadb = require('../models.js');

hbs.registerHelper("ifv", function(conditional, options) {
  if (options.hash.desired === options.hash.type) {
    options.fn(this);
  } else {
    options.inverse(this);
  }
});

hbs.registerHelper('getGrade', function(a) {
  if (a >= 2.7) { return 'A+' }
  if (a >= 2.4) { return 'A' }
  if (a >= 2.1) { return 'A-' }
  if (a >= 1.8) return 'B+'
  if (a  >= 1.5) return 'B'
  if (a  >= 1.2) return 'B-'
  if (a >= 0.9) return 'C+'
  if (a >= 0.6) return 'C'
  if (a >= 0.5) return 'C'
  if (a >= 0.4) return 'D'
  else return 'F'
})

// mongoose connection call
mongoose.connect(config.database)
  .catch((err) => {
    console.log('Error on MongoDB connection: ')
    console.log(err.message);
    process.exit()
  })
// promisify all mongoose functions
mongoose.Promise = global.Promise

const app = express()
app.set('secret', config.secret);

// bodyparser middleware JIC
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'cis450project',
  resave: false,
  saveUninitialized: true
}));

// view engine setup
app.set('views', path.join(__dirname, '/../views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/../views/partials');
hbs.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

// routes
app.use('/public',express.static(path.join(__dirname, '../public')))
app.use('/', index)

app.get('/', function(req, res, next) {
  res.send('Hello World!')
})

app.set('port', process.env.PORT || 3000);

datadb.sequelize.sync().then(() => {
  app.listen(app.get('port'), () => {
    console.log(`listening on port ${app.get('port')}`);
  })
})
