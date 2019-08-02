const moment = require('moment')

const errorCreator = (statusCode, error, request, res) => {
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
