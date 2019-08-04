const { errorCreator, send } = require('../functions/general.functions')

// error codes
const {
  entityNotFound,
  validation,
  unrelatedUserMeeting,
  meetingConfirmed,
  alreadyInvited,
  unInvitedUser,
  alreadyAdded
} = require('../constants/statusCodes')

// validations
const {
  validateOrganizeMeeting,
  validateConfirmMeeting,
  validateEditMeeting,
  validateInviteUsers,
  validateSetMeetingTasks,
  validateViewMeeting,
  validateViewUserMeetings,
  validateFreeze
} = require('../functions/validations/meeting.validations')

const {
  validateViewAll
} = require('../functions/validations/general.validations')

// functions
const {
  createMeeting,
  checkUserMeetingRelated,
  checkMeetingConfirmed,
  editMeeting,
  findAllMeetings,
  findMeeting,
  findUserMeetings,
  inviteUsers,
  setMeetingTasks,
  confirmAttendance,
  checkAlreadyInvited,
  checkAlreadyAdded,
  checkValidTasks,
  checkValidUsers,
  freezeMeeting
} = require('../functions/meeting.functions')
const { findUser } = require('../functions/user.functions')

const organize_meeting = async (req, res) => {
  try {
    const { userId, description } = req.body
    const { error } = validateOrganizeMeeting(req.body)
    if (error) errorCreator(req, res, validation, error.details[0].message)
    const user = findUser(userId)
    if (!user) return errorCreator(req, res, entityNotFound, 'User not found')
    const meeting = await createMeeting(userId, description)
    return send(meeting, req, res)
  } catch (error) {
    return errorCreator(req, res)
  }
}
const invite_users = async (req, res) => {
  try {
    const { meetingId, userIds, revoked } = req.body
    const { error } = validateInviteUsers(req.body)
    if (error) errorCreator(req, res, validation, error.details[0].message)
    const meeting = await findMeeting(meetingId)
    if (!meeting)
      return errorCreator(req, res, entityNotFound, 'Meeting not found')
    const isConfirmed = await checkMeetingConfirmed(meetingId)
    if (isConfirmed)
      return errorCreator(
        req,
        res,
        meetingConfirmed,
        'Meeting is already confirmed'
      )
    const validUsers = await checkValidUsers(userIds)
    if (!validUsers)
      return errorCreator(req, res, entityNotFound, 'Some users are not found')
    const allRelated = await checkUserMeetingRelated(userIds, meeting)
    if (!allRelated)
      return errorCreator(
        req,
        res,
        unrelatedUserMeeting,
        'Users not related to the meeting'
      )
    if (!revoked) {
      const isAlreadyInvited = await checkAlreadyInvited(userIds, meetingId)
      if (isAlreadyInvited)
        return errorCreator(
          req,
          res,
          alreadyInvited,
          'Some users are already invited`'
        )
    }
    await inviteUsers(meetingId, userIds, revoked)
    return send('Users invited', req, res)
  } catch (error) {
    return errorCreator(req, res)
  }
}
const set_meeting_tasks = async (req, res) => {
  try {
    const { meetingId, taskIds } = req.body
    const { error } = validateSetMeetingTasks(req.body)
    if (error) errorCreator(req, res, validation, error.details[0].message)
    const meeting = await findMeeting(meetingId)
    if (!meeting)
      return errorCreator(req, res, entityNotFound, 'Meeting not found')
    const isConfirmed = await checkMeetingConfirmed(meetingId)
    if (isConfirmed)
      return errorCreator(
        req,
        res,
        meetingConfirmed,
        'Meeting is already confirmed'
      )
    const isAlreadyAdded = await checkAlreadyAdded(taskIds, meetingId)
    if (isAlreadyAdded)
      return errorCreator(
        req,
        res,
        alreadyAdded,
        'Some tasks are already added'
      )
    const validTasks = await checkValidTasks(taskIds)
    if (!validTasks)
      return errorCreator(req, res, entityNotFound, 'Some tasks are not found')
    await setMeetingTasks(meetingId, taskIds)
    return send('Tasks set', req, res)
  } catch (error) {
    return errorCreator(req, res)
  }
}

const edit = async (req, res) => {
  try {
    const { description, meetingId } = req.body
    const { error } = validateEditMeeting(req.body)
    if (error) errorCreator(req, res, validation, error.details[0].message)
    const meeting = await findMeeting(meetingId)
    if (!meeting)
      return errorCreator(req, res, entityNotFound, 'Meeting not found')
    const isConfirmed = await checkMeetingConfirmed(meetingId)
    if (isConfirmed)
      return errorCreator(
        req,
        res,
        meetingConfirmed,
        'Meeting is already confirmed'
      )
    const newMeeting = await editMeeting(meetingId, description)
    return send(newMeeting, req, res)
  } catch (error) {
    return errorCreator(req, res)
  }
}
const view_all = async (req, res) => {
  try {
    const { error } = validateViewAll(req.body)
    if (error) errorCreator(req, res, validation, error.details[0].message)
    const meetings = await findAllMeetings(req.body)
    return send(meetings, req, res)
  } catch (error) {
    return errorCreator(req, res)
  }
}
const specific = async (req, res) => {
  try {
    const { error } = validateViewMeeting(req.body)
    if (error) errorCreator(req, res, validation, error.details[0].message)
    const { meetingId } = req.body
    const meeting = await findMeeting(meetingId)
    return send(meeting, req, res)
  } catch (error) {
    return errorCreator(req, res)
  }
}
const user_meetings = async (req, res) => {
  try {
    const { error } = validateViewUserMeetings(req.body)
    if (error) errorCreator(req, res, validation, error.details[0].message)
    const { userId } = req.body
    const userMeetings = await findUserMeetings(userId)
    return send(userMeetings, req, res)
  } catch (error) {
    return errorCreator(req, res)
  }
}
const confirm_attendance = async (req, res) => {
  try {
    const { userId, meetingId } = req.body
    const { error } = validateConfirmMeeting(req.body)
    if (error) errorCreator(req, res, validation, error.details[0].message)
    const meeting = await findMeeting(meetingId)
    if (!meeting)
      return errorCreator(req, res, entityNotFound, 'Meeting not found')
    const confirmed = await confirmAttendance(userId, meetingId)
    if (!confirmed)
      return errorCreator(req, res, unInvitedUser, 'User is not invited')
    return send(confirmed, req, res)
  } catch (e) {
    return errorCreator(req, res)
  }
}
const freeze = async (req, res) => {
  try {
    const { meetingId, frozen } = req.body
    const { error } = validateFreeze(req.body)
    if (error) errorCreator(req, res, validation, error.details[0].message)
    const meeting = await freezeMeeting(meetingId, frozen)
    return send(meeting, req, res)
  } catch (e) {
    return errorCreator(req, res)
  }
}

module.exports = {
  organize_meeting,
  invite_users,
  set_meeting_tasks,
  edit,
  view_all,
  specific,
  user_meetings,
  confirm_attendance,
  freeze
}
