const express = require('express')
const {
  organize_meeting,
  invite_users,
  set_meeting_tasks,
  edit,
  view_all,
  specific,
  user_meetings,
  confirm_attendance,
  freeze
} = require('../controllers/meeting.controller')
const verify = require('../middleware/authentication')

const router = express.Router()

router.post('/create', verify, organize_meeting)

router.post('/invite', verify, invite_users)

router.post('/setTask', verify, set_meeting_tasks)

router.post('/edit', verify, edit)

router.post('/viewAll', view_all)

router.post('/specific', specific)

router.post('/userMeetings', user_meetings)

router.post('/confirm', verify, confirm_attendance)

router.post('/freeze', verify, freeze)

module.exports = router
