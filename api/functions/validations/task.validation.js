const joi = require('joi')

const validatePostTask = request => {
  const schema = {
    userId: joi.number().required(),
    name: joi.string().required()
  }
  return joi.validate(request, schema)
}
const validateUserTaskView = request => {
  const schema = {
    userId: joi.number().required(),
    page: joi.number().required(),
    limit: joi.number().required()
  }
  return joi.validate(request, schema)
}
/* const validateFilter = request => {
  const schema = {
    value: joi.required(),
    exact: joi.boolean(),
    sortBy: joi.boolean()
  }
  const keys = Object.keys(request)
  let error
  keys.forEach(key => {
    const isValid = joi.validate(request[key], schema)
    if (isValid.error) error = isValid.error
  })
  return error
} */

const validateEditTask = request => {
  const schema = {
    taskId: joi.number().required(),
    name: joi.string().required()
  }
  return joi.validate(request, schema)
}
const validateFreezeEdit = request => {
  const schema = {
    taskId: joi.number().required(),
    editFreeze: joi.boolean().required()
  }
  return joi.validate(request, schema)
}

module.exports = {
  validatePostTask,
  validateUserTaskView,
  validateEditTask,
  validateFreezeEdit
}
