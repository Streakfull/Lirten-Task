const joi = require('joi')

const validateViewAll = request => {
  const schema = {
    page: joi.number().required(),
    limit: joi.number().required()
  }
  return joi.validate(request, schema)
}
const validateHeader = request => {
  const schema = {
    request_id: joi.number().required(),
    timestamp: joi.date().required(),
    servicename: joi.string().required()
  }
  return joi.validate(request, schema)
}

module.exports = { validateViewAll, validateHeader }
