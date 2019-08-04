const express = require('express')
const {
  sign_up,
  log_in,
  suspend,
  view_all,
  view_specific,
  update,
  freeze
} = require('../controllers/user.controller')
const verify = require('../middleware/authentication')

const router = express.Router()

router.post('/signup', sign_up)

router.post('/login', log_in)

router.post('/suspend', verify, suspend)

router.post('/viewAll', view_all)

router.post('/specific', view_specific)

router.post('/update', update)

router.post('/freeze', freeze)

module.exports = router
