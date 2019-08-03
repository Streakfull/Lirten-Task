const { errorCreator, send } = require('../functions/general.functions')

// error codes
const {
  entityNotFound,
  validation,
  editFrozen,
  wrongStatus
} = require('../constants/statusCodes')

// validations
const {
  validatePostTask,
  validateUserTaskView,
  validateEditTask,
  validateFreezeEdit
} = require('../functions/validations/task.validation')
const { findUser } = require('../functions/user.functions')
const {
  validateViewAll
} = require('../functions/validations/general.validations')

// functions
const {
  createTask,
  findAllTasks,
  findUserTasks,
  findTask,
  checkEditFrozen,
  editTask,
  freezeTask,
  checkStatus
} = require('../functions/task.functions')

const post_task = async (req, res) => {
  try {
    const { userId, name } = req.body
    const { error } = validatePostTask(req.body)
    if (error)
      return errorCreator(req, res, validation, error.details[0].message)
    const user = await findUser(userId)
    if (!user) return errorCreator(req, res, entityNotFound, 'User not found')
    const task = await createTask(userId, name)
    return send(task, req, res)
  } catch (error) {
    return errorCreator(req, res)
  }
}
const view_all = async (req, res) => {
  try {
    const { error } = validateViewAll(req.body)
    if (error)
      return errorCreator(req, res, validation, error.details[0].message)
    const tasks = await findAllTasks(req.body)
    return send(tasks, req, res)
  } catch (error) {
    return errorCreator(req, res)
  }
}
const view_user = async (req, res) => {
  try {
    const { userId, page, limit } = req.body
    const { error } = validateUserTaskView(req.body)
    if (error)
      return errorCreator(req, res, validation, error.details[0].message)
    const tasks = await findUserTasks(userId, page, limit)
    return send(tasks, req, res)
  } catch (error) {
    return errorCreator(req, res)
  }
}
// const filter = async (req, res) => {
//   const { page, limit, ...filters } = req.body
//   const { error } = validateViewAll({ page, limit })
//   if (error) return errorCreator(req, res, validation, error.details[0].message)
//   const checkFilterError = validateFilter(filters)
//   if (checkFilterError)
//     return errorCreator(
//       req,
//       res,
//       validation,
//       checkFilterError[0].detail.message
//     )
// }

const edit = async (req, res) => {
  try {
    const { taskId, name } = req.body
    const { error } = validateEditTask
    if (error)
      return errorCreator(req, res, validation, error.details[0].message)
    const task = await findTask(taskId)
    if (!task) return errorCreator(req, res, entityNotFound, 'Task not found')
    const frozen = checkEditFrozen(task)
    if (frozen)
      return errorCreator(req, res, editFrozen, 'Task cannot be edited')
    const newTask = await editTask(taskId, name)
    return send(newTask, req, res)
  } catch (error) {
    return errorCreator(req, res)
  }
}

const freeze = async (req, res) => {
  try {
    const { taskId, editFreeze } = req.body
    const { error } = validateFreezeEdit(req.body)
    if (error)
      return errorCreator(req, res, validation, error.details[0].message)
    const task = await findTask(taskId)
    if (!task) return errorCreator(req, res, entityNotFound, 'Task not found')
    const checkChangeStatus = checkStatus(task, editFreeze)
    if (!checkChangeStatus)
      return errorCreator(req, res, wrongStatus, 'Task already has this status')
    const newTask = await freezeTask(taskId, editFreeze)
    return send(newTask, req, res)
  } catch (error) {
    return errorCreator(req, res)
  }
}

module.exports = { post_task, view_all, view_user, edit, freeze }
