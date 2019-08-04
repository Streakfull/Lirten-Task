const { errorCreator } = require('../functions/general.functions')
const {
  validateHeader
} = require('../functions/validations/general.validations')
const { validation } = require('../constants/statusCodes')

const checkHeader = (req, res, next) => {
  const { request_id, timestamp, servicename } = req.headers
  const { error } = validateHeader({ request_id, timestamp, servicename })
  if (error)
    return errorCreator(
      req,
      res,
      validation,
      `${error.details[0].message} in request header`
    )
  return next()
}

module.exports = checkHeader
