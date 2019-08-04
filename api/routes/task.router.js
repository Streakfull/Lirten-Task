const express = require('express')
const {
  post_task,
  view_all,
  view_user,
  edit,
  freeze,
  freeze_all,
  filter
} = require('../controllers/task.controller')
const verify = require('../middleware/authentication')

const router = express.Router()

router.post('/create', verify, post_task)

router.post('/viewAll', view_all)

router.post('/viewUser', view_user)

router.post('/edit', verify, edit)

router.post('/freezeEdit', verify, freeze)

router.post('/freeze', verify, freeze_all)

router.post('/filter', filter)
module.exports = router
