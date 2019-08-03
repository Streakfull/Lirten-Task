const express = require('express')
const { apply_task, accept } = require('../controllers/application.controller')

const router = express.Router()

router.post('/apply', apply_task)

router.post('/accept', accept)

module.exports = router
