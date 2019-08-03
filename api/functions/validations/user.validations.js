const joi = require('joi')

const validateSignUp = request => {
  const schema = {
    name: joi.string().required(),
    email: joi
      .string()
      .email({ minDomainAtoms: 2 })
      .required(),
    password: joi.string().required()
  }
  return joi.validate(request, schema)
}
const validateLogin = request => {
  const schema = {
    email: joi
      .string()
      .email({ minDomainAtoms: 2 })
      .required(),
    password: joi.string().required()
  }
  return joi.validate(request, schema)
}

const validateSuspension = request => {
  const schema = {
    userId: joi.number().required(),
    isSuspended: joi.boolean().required()
  }
  return joi.validate(request, schema)
}

const validateSpecificView = request => {
  const schema = {
    userId: joi.number().required()
  }
  return joi.validate(request, schema)
}

const validateUpdateUser = request => {
  const schema = {
    userId: joi.number().required(),
    name: joi.string().required(),
    email: joi.string().required()
  }
  return joi.validate(request, schema)
}

module.exports = {
  validateSignUp,
  validateLogin,
  validateSuspension,
  validateSpecificView,
  validateUpdateUser
}
