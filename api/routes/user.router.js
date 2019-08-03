const express = require('express')
const {
  sign_up,
  log_in,
  suspend,
  view_all,
  view_specific,
  update
} = require('../controllers/user.controller')

const router = express.Router()

router.post('/signup', sign_up)

router.post('/login', log_in)

router.post('/suspend', suspend)

router.post('/viewAll', view_all)

router.post('/specific', view_specific)

router.post('/update', update)

// FREEZE PENDING

module.exports = router
