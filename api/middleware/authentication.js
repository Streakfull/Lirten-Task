const jwt = require('jsonwebtoken')
const { tokenKey } = require('../../config/keys')
const { errorCreator } = require('../functions/general.functions')
const { unauthorized } = require('../constants/statusCodes')

const verify = (req, res, next) => {
  try {
    const decoded = jwt.verify(req.headers.token, tokenKey)
    return next()
  } catch (error) {
    return errorCreator(req, res, unauthorized, 'Must be logged in')
  }
}

module.exports = verify
