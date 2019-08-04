const {
  find,
  create,
  updateMany,
  freeze
} = require('../../queries/queryExecutioner')

const table = 'application'

const checkAcceptedApplicant = async taskId => {
  const acceptedApp = await find({ table }, { accepted: true, task_id: taskId })
  if (acceptedApp.length > 0) return acceptedApp[0]
  return false
}
const findApplication = async (userId, taskId) => {
  const acceptedApp = await find(
    { table },
    { user_id: userId, task_id: taskId }
  )
  if (acceptedApp.length > 0) return acceptedApp[0]
  return false
}

const apply = async (userId, taskId) => {
  const app = await create({ table }, { user_id: userId, task_id: taskId })
  return app
}
const acceptApplication = async (userId, taskId) => {
  const app = await updateMany(
    { table },
    { accepted: true },
    { user_id: userId, task_id: taskId }
  )
  if (app.length > 0) {
    return app[0]
  }
  return false
}
const freezeApplicaiton = async (userId, taskId, frozen) => {
  const app = await freeze({ table }, frozen, {
    user_id: userId,
    task_id: taskId
  })
  return app
}

module.exports = {
  checkAcceptedApplicant,
  findApplication,
  apply,
  acceptApplication,
  freezeApplicaiton
}
