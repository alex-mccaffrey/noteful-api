const knex = require('knex')
const app = require('./app')
const { PORT, DATABASE_URL } = require('./config')

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const db = knex({client})

/*const db = knex({
  client: 'pg',
  connection: DATABASE_URL,
})*/

app.set('db', db)


app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})