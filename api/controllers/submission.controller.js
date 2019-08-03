const { errorCreator, send } = require('../functions/general.functions')

// error codes
const { entityNotFound, validation } = require('../constants/statusCodes')

// validations
const {
  validateApplication
} = require('../functions/validations/application.validations')
const {
  validateSubmission
} = require('../functions/validations/submission.validations')

// functions
const { findApplication } = require('../functions/application.functions')
const { endTask } = require('../functions/task.functions')
const {
  submitTask,
  acceptSubmission
} = require('../functions/submission.functions')

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
    const acceptedSubmissions = await acceptSubmission(userId, taskId)
    if (!acceptedSubmissions)
      return errorCreator(req, res, entityNotFound, 'Submission not found')
    return send(acceptedSubmissions, req, res)
  } catch (error) {
    return errorCreator(req, res)
  }
}

module.exports = { submit, accept }
