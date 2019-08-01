// libraries
const express = require('express')
const cors = require('cors')

const app = express()

// API imports go here

// middleware go here
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
// routes go here

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Server running on port ${port} `))
