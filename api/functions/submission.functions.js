const { create, updateMany } = require('../../queries/queryExecutioner')

const table = 'submission'

const submitTask = async (userId, taskId, text) => {
  const submission = await create(
    { table },
    { user_id: userId, task_id: taskId, text }
  )
  return submission
}
const acceptSubmission = async (userId, taskId) => {
  const submission = await updateMany(
    { table },
    { is_confirmed: true },
    { user_id: userId, task_id: taskId }
  )
  if (submission.length > 0) return submission
  return false
}

module.exports = { submitTask, acceptSubmission }
