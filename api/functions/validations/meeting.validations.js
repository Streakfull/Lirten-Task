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
    userIds: joi.array().items(joi.number().required())
  }
  return joi.validate(request, schema)
}

const validateConfirmMeeting = request => {
  const schema = {
    userId: joi.number().required(),
    taskId: joi.number().required()
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

module.exports = {
  validateOrganizeMeeting,
  validateConfirmMeeting,
  validateEditMeeting,
  validateInviteUsers,
  validateSetMeetingTasks,
  validateViewMeeting
}
