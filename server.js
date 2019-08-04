// libraries
const express = require('express')
const cors = require('cors')

const dbInit = require('./config/DBConfig')
const logger = require('./api/middleware/logger')
const validateHeader = require('./api/middleware/validateHeader')
const setListener = require('./api/sockets')

const app = express()
const server = require('http').Server(express)
const io = require('socket.io')(server)

// API imports go here
const users = require('./api/routes/user.router')
const tasks = require('./api/routes/task.router')
const applications = require('./api/routes/application.router')
const submissions = require('./api/routes/submission.router')
const meetings = require('./api/routes/meeting.router')

// middleware goes here
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(validateHeader)
app.use(logger)
app.use(cors())

// routes go here
app.use('/api/v1/users', users)
app.use('/api/v1/tasks', tasks)
app.use('/api/v1/applications', applications)
app.use('/api/v1/submissions', submissions)
app.use('/api/v1/meetings', meetings)

//socket.io
setListener(io)

// Tables and populate
// pgClient.query(tableCreation)
const port = process.env.PORT || 5000
const serverPort = 80
server.listen(serverPort)
app.listen(port, () => console.log(`Server running on port ${port} `))
