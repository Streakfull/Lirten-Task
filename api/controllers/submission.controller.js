const { errorCreator, send } = require('../functions/general.functions')

// error codes
const { entityNotFound, validation } = require('../constants/statusCodes')

// validations
const {
  validateApplication,
  validateFreeze
} = require('../functions/validations/application.validations')
const {
  validateSubmission
} = require('../functions/validations/submission.validations')

// functions
const { findApplication } = require('../functions/application.functions')
const { endTask, findTask } = require('../functions/task.functions')
const {
  submitTask,
  acceptSubmission,
  findSubmission,
  freezeSubmission
} = require('../functions/submission.functions')
const { acidExecute } = require('../../queries/queryExecutioner')

const submit = async (req, res) => {
  try {
    const { userId, taskId, text } = req.body
    const { error } = validateSubmission(req.body)
    if (error) {
      return errorCreator(req, res, validation, error.details[0].message)
    }
    const application = await findApplication(userId, taskId)
    if (!application || !application.accepted)
      return errorCreator(
        req,
        res,
        entityNotFound,
        'Accepted application not found'
      )
    const submission = await submitTask(userId, taskId, text)
    return send(submission, req, res)
  } catch (error) {
    return errorCreator(req, res)
  }
}
const accept = async (req, res) => {
  try {
    const { userId, taskId } = req.body
    const { error } = validateApplication(req.body)
    if (error) {
      return errorCreator(req, res, validation, error.details[0].message)
    }
    const submission = await findSubmission(userId, taskId)
    // end TASK
    if (!submission)
      return errorCreator(req, res, entityNotFound, 'Submission not found')
    const accpetSubmissionQuery = acceptSubmission(userId, taskId)
    const endTaskQuery = endTask(taskId)
    const queries = [accpetSubmissionQuery, endTaskQuery]
    await acidExecute(queries)
    // getting the data
    const newSubmission = await findSubmission(userId, taskId)
    const newTask = await findTask(taskId)
    const data = {
      newSubmission,
      newTask
    }
    return send(data, req, res)
  } catch (error) {
    return errorCreator(req, res)
  }
}
const freeze = async (req, res) => {
  try {
    const { frozen, userId, taskId } = req.body
    const { error } = validateFreeze(req.body)
    if (error) {
      return errorCreator(req, res, validation, error.details[0].message)
    }
    const submission = await freezeSubmission(userId, taskId, frozen)
    return send(submission, req, res)
  } catch (error) {
    return errorCreator(req, res)
  }
}

module.exports = { submit, accept, freeze }
