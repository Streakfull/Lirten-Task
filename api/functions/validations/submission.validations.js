const joi = require('joi')

const validateSubmission = request => {
  const schema = {
    userId: joi.number().required(),
    taskId: joi.number().required(),
    text: joi.string().required()
  }
  return joi.validate(request, schema)
}
const validateFreeze = request => {
  const schema = {
    userId: joi.number().required(),
    taskId: joi.number().required(),
    frozen: joi.boolean().required()
  }
  return joi.validate(request, schema)
}

module.exports = { validateSubmission, validateFreeze }
