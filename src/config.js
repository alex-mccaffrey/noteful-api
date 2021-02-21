module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  API_TOKEN: process.env.API_TOKEN,
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://alex-mcc@localhost/noteful2',
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://alex-mcc@localhost/noteful-test2',
}