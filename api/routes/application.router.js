const express = require('express')
const {
  apply_task,
  accept,
  freeze
} = require('../controllers/application.controller')

const router = express.Router()

router.post('/apply', apply_task)

router.post('/accept', accept)

router.post('/freeze', freeze)

module.exports = router
