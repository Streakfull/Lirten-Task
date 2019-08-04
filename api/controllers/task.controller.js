const { errorCreator, send } = require('../functions/general.functions')

// error codes
const {
  entityNotFound,
  validation,
  editFrozen,
  wrongStatus,
  alreadyAccepted
} = require('../constants/statusCodes')

// validations
const {
  validatePostTask,
  validateUserTaskView,
  validateEditTask,
  validateFreezeEdit,
  validateFreeze,
  validateFilter,
  validateUserId
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
  checkStatus,
  freezeTaskAll,
  filterQuery
} = require('../functions/task.functions')

const { checkAcceptedApplicant } = require('../functions/application.functions')

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
const filter = async (req, res) => {
  const { page, limit, userId, ...filters } = req.body
  const { error } = validateViewAll({ page, limit })
  if (error) return errorCreator(req, res, validation, error.details[0].message)
  const validUserId = validateUserId({ userId })
  if (validUserId.error)
    return errorCreator(
      req,
      res,
      validation,
      validUserId.error.details[0].message
    )
  const checkFilterError = validateFilter(filters)
  if (checkFilterError)
    return errorCreator(
      req,
      res,
      validation,
      checkFilterError.details[0].message
    )
  const result = await filterQuery(userId, filters)
  return send(result, req, res)
}

const edit = async (req, res) => {
  try {
    const { taskId, name } = req.body
    const { error } = validateEditTask
    if (error)
      return errorCreator(req, res, validation, error.details[0].message)
    const task = await findTask(taskId)
    if (!task) return errorCreator(req, res, entityNotFound, 'Task not found')
    const frozen = checkEditFrozen(task)
    const acceptedCheck = await checkAcceptedApplicant(taskId)
    if (acceptedCheck)
      return errorCreator(req, res, alreadyAccepted, 'Task cannot be edited')

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
const freeze_all = async (req, res) => {
  try {
    const { taskId, frozen } = req.body
    const { error } = validateFreeze(req.body)
    if (error)
      return errorCreator(req, res, validation, error.details[0].message)
    const frozenTask = await freezeTaskAll(taskId, frozen)
    return send(frozenTask, req, res)
  } catch (e) {
    return errorCreator(req, res)
  }
}

module.exports = {
  post_task,
  view_all,
  view_user,
  edit,
  freeze,
  freeze_all,
  filter
}
