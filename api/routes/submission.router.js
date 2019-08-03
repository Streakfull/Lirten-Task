const express = require('express')
const { submit, accept } = require('../controllers/submission.controller')

const router = express.Router()

router.post('/submit', submit)

router.post('/acceptSubmission', accept)

module.exports = router
