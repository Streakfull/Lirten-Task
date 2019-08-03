const joi = require('joi')

const validateViewAll = request => {
  const schema = {
    page: joi.number().required(),
    limit: joi.number().required()
  }
  return joi.validate(request, schema)
}

module.exports = { validateViewAll }
