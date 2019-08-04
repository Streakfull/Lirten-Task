const joi = require('joi')

const validateOrganizeMeeting = request => {
  const schema = {
    userId: joi.number().required(),
    description: joi.string()
  }
  return joi.validate(request, schema)
}

const validateInviteUsers = request => {
  const schema = {
    meetingId: joi.number().required(),
    revoked: joi.boolean(),
    userIds: joi.array().items(joi.number().required())
  }
  return joi.validate(request, schema)
}

const validateSetMeetingTasks = request => {
  const schema = {
    meetingId: joi.number().required(),
    taskIds: joi.array().items(joi.number().required()),
    removed: joi.boolean()
  }
  return joi.validate(request, schema)
}

const validateConfirmMeeting = request => {
  const schema = {
    userId: joi.number().required(),
    meetingId: joi.number().required()
  }
  return joi.validate(request, schema)
}

const validateEditMeeting = request => {
  const schema = {
    meetingId: joi.number().required(),
    description: joi.string()
  }
  return joi.validate(request, schema)
}

const validateViewMeeting = request => {
  const schema = {
    meetingId: joi.number().required()
  }
  return joi.validate(request, schema)
}

const validateViewUserMeetings = request => {
  const schema = {
    userId: joi.number().required()
  }
  return joi.validate(request, schema)
}
const validateFreeze = request => {
  const schema = {
    frozen: joi.boolean().required(),
    meetingId: joi.number().required()
  }
  return joi.validate(request, schema)
}
module.exports = {
  validateOrganizeMeeting,
  validateConfirmMeeting,
  validateEditMeeting,
  validateInviteUsers,
  validateSetMeetingTasks,
  validateViewMeeting,
  validateViewUserMeetings,
  validateFreeze
}
