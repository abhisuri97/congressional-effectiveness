module.exports =  {
  'database': (process.env.MONGODB_URI || 'mongodb://localhost:27017/450proj'),
  'development': {
    'db': 'cis450_project',
    'username': 'cis450project',
    'password': 'password',
    'host': 'localhost',
    'logging': false,
  },
  'production': {
    'db': 'congressdb',
    'username': 'congress',
    'password':  'congress2018',
    'host': 'congressional-effectiveness.cnlmnmamuogs.us-east-1.rds.amazonaws.com',
    'logging': true
  },
  'type': 'production'
}
