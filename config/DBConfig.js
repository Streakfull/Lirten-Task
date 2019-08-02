// setting up 2 databases postgres & mongo
const { Client } = require('pg')
const { MongoClient } = require('mongodb')

const config = {
  user: 'Youssef',
  password: 'zaq12wsx',
  database: 'Task'
}
const pgClient = new Client(config)
const mongoUrl = 'mongodb://localhost:27017/task-module'

pgClient
  .connect()
  .then(() => console.log('Connected to postgres DB'))
  .catch(e => console.error('connection error', e.stack))
// for logging purposes
let mongoClient
MongoClient.connect(mongoUrl, { useNewUrlParser: true }).then(async db => {
  console.log('connected to mongoDB')
  mongoClient = db.db('task-module')
})

const getMongoDB = () => mongoClient

module.exports = { pgClient, getMongoDB }
