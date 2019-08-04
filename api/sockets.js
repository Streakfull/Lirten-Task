// importing functions
const userFunctions = require('./functions/user.functions')
const meetingFunctions = require('./functions/meeting.functions')
const taskFunctions = require('./functions/task.functions')
const applicationFunctions = require('./functions/application.functions')
const sumbissionFunctions = require('./functions/submission.functions')
// combining all functions in a singleObject
const allfunctions = {
  ...userFunctions,
  ...meetingFunctions,
  ...taskFunctions,
  ...applicationFunctions,
  ...sumbissionFunctions
}
// ORDER OF FUNCTION ARGUMENTS IS IMPORTANT
const setListener = io => {
  io.on('connection', socket => {
    socket.on('callFunction', async data => {
      try {
        const obj = JSON.parse(data)
        const { functionName, ...functionValues } = obj
        const functionArguments = Object.values(functionValues)
        const result = await allfunctions[functionName](...functionArguments)
        socket.emit('receiveFunction', { data: result })
      } catch (e) {
        socket.emit('receiveFunction', { data: 'Something Went wrong' })
      }
    })

    console.log('a user connected')
  })
}
module.exports = setListener
