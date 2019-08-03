const {
  find,
  create,
  updateMany,
  deleteMany,
  createMany
} = require('../../queries/queryExecutioner')

const meetingTable = 'meeting'
const meetingTask = 'meeting_task'
const meetingAttendance = 'meeting_user'

const createMeeting = async (userId, description) => {
  const meeting = await create(
    { table: meetingTable },
    { user_id: userId, description }
  )
  return meeting
}

// checks all users are accepted in the meeting tasks
const checkUserMeetingRelated = async (userIds, meetingId) => {
  const meetingTasks = await find(
    {
      table: meetingTask,
      join: {
        tables: ['application'],
        on: {
          'meeting_task.task_id': 'application.task_id'
        }
      }
    },
    { accepted: true, meeting_id: meetingId },
    { 'application.user_id': 1 }
  )
  let allRelated = true
  userIds.forEach(id => {
    if (!meetingTasks.includes(id)) allRelated = false
  })
  return allRelated
}

const checkMeetingConfirmed = async meetingId => {
  const usersMeeting = await find(
    { table: meetingAttendance },
    { meeting_id: meetingId }
  )
  // no invited members to the meeting
  if (usersMeeting.length === 0) return false
  const unConfirmedUsers = usersMeeting.filter(user => !user.confirmed)
  // if the unconfirmed users are 0 then the meeting is confirmed
  return unConfirmedUsers.length === 0
}

const editMeeting = async (meetingId, description) => {
  const newMeeting = await updateMany(
    { table: meetingTable },
    { description },
    { id: meetingId }
  )
  return newMeeting[0]
}

const findAllMeetings = async pagination => {
  const meetings = await find({ table: meetingTable }, {}, {}, pagination)
  return meetings
}
const findMeeting = async meetingId => {
  const meeting = await find({ table: meetingTable }, { id: meetingId })
  if (meeting.length > 0) {
    return meeting[0]
  }
  return false
}

const findUserMeetings = async userId => {
  const userMeetings = await find(
    { table: meetingTable },
    { organiser_id: userId }
  )
  return userMeetings
}

const inviteUsers = async (userIds, removed) => {
  const userIdsQuery = userIds.map(userId => ({ id: userId }))
  let data
  if (removed)
    data = await deleteMany({ table: meetingAttendance }, userIdsQuery)
  else data = await createMany({ table: meetingAttendance }, userIdsQuery)
  return data
}

const setMeetingTasks = async (userIds, removed) => {
  const userIdsQuery = userIds.map(userId => ({ id: userId }))
  let data
  if (removed) data = await deleteMany({ table: meetingTask }, userIdsQuery)
  else data = await createMany({ table: meetingTask }, userIdsQuery)
}

const confirmAttendance = async (userId, meetingId) => {
  const confirmedUser = await updateMany(
    { table: meetingAttendance },
    { confirmed: true },
    { user_id: userId, meeting_id: meetingId }
  )
  return confirmedUser
}
