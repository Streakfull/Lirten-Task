const { errorCreator, send } = require('../functions/general.functions')

// error codes
const {
  alreadyAccpted,
  validation,
  entityNotFound,
  alreadyApplied
} = require('../constants/statusCodes')

// validations
const {
  validateApplication
} = require('../functions/validations/application.validations')

// functions
const { findUser } = require('../functions/user.functions')
const { findTask } = require('../functions/task.functions')
const {
  checkAcceptedApplicant,
  findApplication,
  apply,
  acceptApplication
} = require('../functions/application.functions')

const apply_task = async (req, res) => {
  try {
    const { userId, taskId } = req.body
    const { error } = validateApplication(req.body)
    if (error)
      return errorCreator(req, res, validation, error.details[0].message)
    const user = await findUser(userId)
    if (!user) return errorCreator(req, res, entityNotFound, 'User not found')
    const task = await findTask(taskId)
    if (!task) return errorCreator(req, res, entityNotFound, 'Task not found')
    const app = await findApplication(userId, taskId)
    if (!app)
      return errorCreator(req, res, alreadyApplied, 'User already applied')
    const acceptedApp = await checkAcceptedApplicant(taskId)
    if (acceptedApp)
      return errorCreator(
        req,
        res,
        alreadyApplied,
        'This task has an accepted applicant'
      )
    const newApp = await apply(userId, taskId)
    return send(newApp, req, res)
  } catch (e) {
    return errorCreator(req, res)
  }
}

const accept = async (req, res) => {
  try {
    const { userId, taskId } = req.body
    const { error } = validateApplication(req.body)
    if (error)
      return errorCreator(req, res, validation, error.details[0].message)
    const app = await findApplication(userId, taskId)
    if (!app)
      return errorCreator(req, res, entityNotFound, 'Application not found')
    const acceptedApp = await checkAcceptedApplicant(taskId)
    if (acceptedApp)
      return errorCreator(
        req,
        res,
        alreadyAccpted,
        'This task has an accepted applicant'
      )
    const newApp = await acceptApplication(userId, taskId)
    // end task here (ACID)
    return send(newApp, req, res)
  } catch (error) {
    return errorCreator(req, res)
  }
}

module.exports = { apply_task, accept }
