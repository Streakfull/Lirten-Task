const joi = require('joi')

const validateApplication = request => {
  const schema = {
    userId: joi.number().required(),
    taskId: joi.number().required()
  }
  return joi.validate(request, schema)
}

module.exports = { validateApplication }
