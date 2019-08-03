const joi = require('joi')

const validateSubmission = request => {
  const schema = {
    userId: joi.number().required(),
    taskId: joi.number().required(),
    text: joi.string()
  }
  return joi.validate(request, schema)
}

module.exports = { validateSubmission }
