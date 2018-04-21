module.exports =  {
  'database': 'mongodb://localhost:27017/450proj',
  'development': {
    'db': 'cis450_project',
    'username': 'cis450project',
    'password': 'password',
    'host': 'localhost',
    'logging': false,
  },
  'production': {
    'db': 'cis450_project',
    'username': 'cis450',
    'password':  'cis450550',
    'host': 'cis450test.cnlmnmamuogs.us-east-1.rds.amazonaws.com',
    'logging': true
  },
  'type': 'development'
}
