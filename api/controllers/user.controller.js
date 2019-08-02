const { find } = require('../../queries/queryExecutioner')
const { errorCreator, send } = require('../functions/general.functions')
const { emailExists, validation } = require('../constants/statusCodes')

const sign_up = async (req, res) => {
  return send('hi', req, res)
}

module.exports = { sign_up }
