module.exports = { 
  database: 'mongodb://localhost:27017/cis450-final-proj',
  secret: 'secretsaregood',
  sql: {
    name: 'cis450-db',
    uName: 'user',
    pass: 'password',
    host: 'localhost'
  },
  pgConfig: {
    user: 'postgres',
    database: 'cis450-db',
    password: 'password',
    port: 5432
  }
}
