const {
  find,
  create,
  updateMany,
  deleteMany,
  createMany,
  freeze
} = require('../../queries/queryExecutioner')

const { getCache, setCache, removeFromCache } = require('../cache')
const { findUser } = require('./user.functions')
const { findTask } = require('./task.functions')

const meetingTable = 'meeting'
const meetingTask = 'meeting_task'
const meetingAttendance = 'meeting_attendance'

const createMeeting = async (userId, description) => {
  const meeting = await create(
    { table: meetingTable },
    { organiser_id: userId, description }
  )
  removeFromCache('meetings')
  return meeting
}

// checks all users are accepted in the meeting tasks
const checkUserMeetingRelated = async (userIds, meeting) => {
  const meetingId = meeting.id
  //oraganiser
  let allUsersRelated = [meeting.organiser_id]
  // task owners
  const tasks = await find(
    {
      table: meetingTask,
      join: {
        tables: ['task'],
        on: {
          'meeting_task.task_id': 'task.id'
        }
      }
    },
    { meeting_id: meetingId, 'task.frozen': false },
    { 'task.user_id': 1 }
  )
  // accepted applicants
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
    { accepted: true, meeting_id: meetingId, 'application.frozen': false },
    { 'application.user_id': 1 }
  )
  const usersFound = tasks.concat(meetingTasks).map(user => user.user_id)
  allUsersRelated = allUsersRelated.concat(usersFound)
  let allRelated = true
  userIds.forEach(id => {
    if (!allUsersRelated.includes(id)) allRelated = false
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
  removeFromCache('meetings')
  return newMeeting[0]
}

const findAllMeetings = async pagination => {
  const { page, limit } = pagination
  const cachedMeetings = getCache('meetings', page, limit)
  if (cachedMeetings) {
    return cachedMeetings
  }
  const meetings = await find({ table: meetingTable }, {}, {}, pagination)
  setCache('meetings', page, limit, meetings)
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

const inviteUsers = async (meetingId, userIds, removed) => {
  const userIdsQuery = userIds.map(userId => ({
    user_id: userId,
    meeting_id: meetingId
  }))
  const data = removed
    ? await deleteMany({ table: meetingAttendance }, userIdsQuery)
    : await createMany({ table: meetingAttendance }, userIdsQuery)
  removeFromCache('meetings')
  return data
}

const setMeetingTasks = async (meetingId, taskIds) => {
  const query = taskIds.map(id => ({
    meeting_id: meetingId,
    task_id: id
  }))

  const data = await createMany({ table: meetingTask }, query)
  removeFromCache('meetings')
  return data
}

const confirmAttendance = async (userId, meetingId) => {
  const confirmedUser = await updateMany(
    { table: meetingAttendance },
    { confirmed: true },
    { user_id: userId, meeting_id: meetingId }
  )
  if (confirmedUser.length > 0) return confirmedUser
  return false
}
const checkAlreadyInvited = async (userIds, meetingId) => {
  const invitedUsers = await find(
    { table: meetingAttendance },
    { meeting_id: meetingId }
  )
  const invitedIds = invitedUsers.map(user => user.user_id)
  let alreadyInvited = false
  userIds.forEach(id => {
    if (invitedIds.includes(id)) alreadyInvited = true
  })
  return alreadyInvited
}
// to if the meeting already has theses tasks
const checkAlreadyAdded = async (taskIds, meetingId) => {
  const addedTasks = await find(
    { table: meetingTask },
    { meeting_id: meetingId }
  )
  const tasks = addedTasks.map(task => task.task_id)
  let alreadyAdded = false
  taskIds.forEach(id => {
    if (tasks.includes(id)) alreadyAdded = true
  })
  return alreadyAdded
}
// check that all users are found
const checkValidUsers = async userIds => {
  const promises = []
  userIds.forEach(id => promises.push(findUser(id)))
  const foundUsers = await Promise.all(promises)
  return !foundUsers.includes(false)
}

const checkValidTasks = async taskIds => {
  const promises = []
  taskIds.forEach(id => promises.push(findTask(id)))
  const foundTasks = await Promise.all(promises)
  return !foundTasks.includes(false)
}
const freezeMeeting = async (meetingId, frozen) => {
  const meeting = await freeze({ table: meetingTable }, frozen, {
    id: meetingId
  })
  return meeting
}

module.exports = {
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
  checkValidUsers,
  checkValidTasks,
  freezeMeeting
}
