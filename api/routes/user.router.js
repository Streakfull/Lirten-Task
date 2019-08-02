const express = require('express')

const router = express.Router()
const { sign_up } = require('../controllers/user.controller')

router.post('/signup', sign_up)

module.exports = router
