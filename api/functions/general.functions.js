const moment = require('moment')
const { unknown } = require('../constants/statusCodes')
// defining the message to be sent in all catches
const unknownMsg = 'Something went wrong'
const errorCreator = (
  request,
  res,
  statusCode = unknown,
  error = unknownMsg
) => {
  const { headers } = request
  const { request_id } = headers
  res.set({
    statusCode,
    requestId: request_id,
    timestamp: moment().format()
  })
  return res.json({ error })
}

const send = (data, request, res) => {
  const { headers } = request
  const { request_id } = headers
  res.set({
    statusCode: '0000',
    requestId: request_id,
    timestamp: moment().format()
  })
  return res.json({ data })
}

module.exports = { errorCreator, send }
