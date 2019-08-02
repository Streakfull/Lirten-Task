// libraries
const express = require('express')
const cors = require('cors')
const dbInit = require('./config/DBConfig')
const logger = require('./api/middleware/logger')

const app = express()

// API imports go here
const users = require('./api/routes/user.router')

// middleware go here
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(logger)
app.use(cors())

// routes go here
app.use('/api/v1/users', users)

// Tables and populate
// pgClient.query(tableCreation)
const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Server running on port ${port} `))
