// This is mainly not my code
// Stackoverflow
const { getMongoDB } = require('../../config/DBConfig')

const logger = (req, res, next) => {
  const oldWrite = res.write
  const oldEnd = res.end

  const chunks = []

  res.write = (...restArgs) => {
    chunks.push(Buffer.from(restArgs[0]))
    oldWrite.apply(res, restArgs)
  }

  res.end = async (...restArgs) => {
    if (restArgs[0]) {
      chunks.push(Buffer.from(restArgs[0]))
    }
    const body = Buffer.concat(chunks).toString('utf8')
    const { headers } = req
    const { timestamp, servicename, request_id } = headers
    const log = {
      requestId: request_id,
      requestTimeStamp: timestamp,
      servicename,
      requestData: req.body,
      responseTimeStamp: res.getHeader('timeStamp'),
      responseStatusCode: res.getHeader('statusCode'),
      responseData: JSON.parse(body)
    }
    oldEnd.apply(res, restArgs)
    const db = getMongoDB()
    await db.collection('log').insertOne(log)
  }

  next()
}

module.exports = logger
