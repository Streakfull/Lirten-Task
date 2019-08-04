const { create, find, freeze } = require('../../queries/queryExecutioner')

const table = 'submission'

const submitTask = async (userId, taskId, text) => {
  const submission = await create(
    { table },
    { user_id: userId, task_id: taskId, text }
  )
  return submission
}
const acceptSubmission = (userId, taskId) => {
  const query = {
    tables: { table },
    type: 'update',
    columns: { is_confirmed: true },
    conditions: { user_id: userId, task_id: taskId }
  }
  return query
}
const findSubmission = async (userId, taskId) => {
  const submission = await find({ table }, { user_id: userId, task_id: taskId })
  if (submission.length > 0) return submission
  return false
}
const freezeSubmission = async (userId, taskId, frozen) => {
  const submission = await freeze({ table }, frozen, {
    user_id: userId,
    task_id: taskId
  })
  return submission
}

module.exports = {
  submitTask,
  acceptSubmission,
  findSubmission,
  freezeSubmission
}
// const query = [
//   {
//     tables: { table: 'user' },
//     type: 'create',
//     columns: { id: 1, fk: 2 }
//   },
//   {
//     tables: { table: 'kkk' },
//     type: 'update',
//     columns: { id: 5, fk: 3 },
//     conditions: { id: 1 }
//   }
// ]
