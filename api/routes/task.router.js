const express = require('express')
const {
  post_task,
  view_all,
  view_user,
  edit,
  freeze
  // filter
} = require('../controllers/task.controller')

const router = express.Router()

router.post('/create', post_task)

router.post('/viewAll', view_all)

router.post('/viewUser', view_user)

router.post('/edit', edit)

router.post('/freeze', freeze)

// router.post('/filter', filter)
module.exports = router
