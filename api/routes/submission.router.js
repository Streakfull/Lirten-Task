const express = require('express')
const {
  submit,
  accept,
  freeze
} = require('../controllers/submission.controller')
const verify = require('../middleware/authentication')

const router = express.Router()

router.post('/submit', verify, submit)

router.post('/acceptSubmission', verify, accept)

router.post('/freeze', verify, freeze)

module.exports = router
