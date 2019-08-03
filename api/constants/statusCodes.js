// Email already exists
const emailExists = 'E001'
// Wrong email or password
const wrongInfo = 'E002'
// Entity not found
const entityNotFound = 'E003'
// validation
const validation = 'E004'
// user already suspended
const suspended = 'E005'
// user already unsuspended
const unsuspended = 'E006'
// task edit frozen
const editFrozen = 'E007'
// task not edit frozen
const notEditFrozen = 'E009'
// task has an accepted app
const alreadyAccepted = 'E010'
// user doesn't belong to task
const unrelatedUserTask = 'E011'
// user is not related to meeting
const unrelatedUserMeeting = 'E012'
// meeting is already confirmed
const meetingConfirmed = 'E013'
// Unrelated task
const unrelatedTask = 'E014'
// user is not invited to the meeting
const unInvitedUser = 'E015'
//Unknown error
const unknown = 'E00X'

module.exports = {
  emailExists,
  wrongInfo,
  entityNotFound,
  validation,
  suspended,
  unsuspended,
  editFrozen,
  notEditFrozen,
  alreadyAccepted,
  unrelatedUserTask,
  unrelatedUserMeeting,
  meetingConfirmed,
  unrelatedTask,
  unInvitedUser,
  unknown
}
