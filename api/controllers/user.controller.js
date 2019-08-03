const { errorCreator, send } = require('../functions/general.functions')
const {
  emailExists,
  validation,
  entityNotFound,
  wrongInfo,
  suspended
} = require('../constants/statusCodes')
const {
  validateSignUp,
  validateLogin,
  validateSuspension,
  validateSpecificView,
  validateUpdateUser
} = require('../functions/validations/user.validations')
const {
  validateViewAll
} = require('../functions/validations/general.validations')
const {
  findEmail,
  hashPassword,
  createUser,
  comparePassword,
  generateToken,
  findUser,
  checkSuspension,
  suspendUser,
  findAllUsers,
  updateUser
} = require('../functions/user.functions')

const sign_up = async (req, res) => {
  try {
    const { name, email, password } = req.body
    const { error } = validateSignUp(req.body)
    if (error)
      return errorCreator(req, res, validation, error.details[0].message)
    const emailCheck = await findEmail(email)
    if (emailCheck)
      return errorCreator(
        req,
        res,
        emailExists,
        'Email belongs to another user'
      )
    const hashedPassword = hashPassword(password)
    const user = await createUser(name, email, hashedPassword)
    return send(user, req, res)
  } catch (error) {
    return errorCreator(req, res)
  }
}

const log_in = async (req, res) => {
  try {
    const { email, password } = req.body
    const { error } = validateLogin(req.body)
    if (error)
      return errorCreator(req, res, validation, error.details[0].message)
    const user = await findEmail(email)
    if (!user) {
      return errorCreator(req, res, entityNotFound, 'User not found')
    }
    const compareResult = comparePassword(password, user.password)
    if (!compareResult)
      return errorCreator(req, res, wrongInfo, 'Wrong email or password')
    const token = generateToken(user)
    const data = `Bearer ${token}`
    return send(data, req, res)
  } catch (error) {
    return errorCreator(req, res)
  }
}

const suspend = async (req, res) => {
  try {
    const { userId, isSuspended } = req.body
    const { error } = validateSuspension(req.body)
    if (error)
      return errorCreator(req, res, validation, error.details[0].message)
    const user = await findUser(userId)
    if (!user) {
      return errorCreator(req, res, entityNotFound, 'User not found')
    }
    const checkStatus = checkSuspension(user, isSuspended)
    if (!checkStatus) {
      return errorCreator(req, res, suspended, 'User already has this status')
    }
    const newUser = await suspendUser(userId, isSuspended)
    return send(newUser, req, res)
  } catch (error) {
    return errorCreator(req, res)
  }
}
// cache will be used here
const view_all = async (req, res) => {
  try {
    const { error } = validateViewAll(req.body)
    if (error)
      return errorCreator(req, res, validation, error.details[0].message)
    const users = await findAllUsers(req.body)
    return send(users, req, res)
  } catch (error) {
    return errorCreator(req, res)
  }
}

const view_specific = async (req, res) => {
  try {
    console.log('hi')
    const { userId } = req.body
    const { error } = validateSpecificView(req.body)
    if (error)
      return errorCreator(req, res, validation, error.details[0].message)
    const user = await findUser(userId)
    return send(user, req, res)
  } catch (error) {
    console.log(error)
    return errorCreator(req, res)
  }
}
const update = async (req, res) => {
  try {
    const { userId, name, email } = req.body
    const { error } = validateUpdateUser(req.body)
    if (error)
      return errorCreator(req, res, validation, error.details[0].message)
    const user = await findUser(userId)
    if (!user) {
      return errorCreator(req, res, entityNotFound, 'User not found')
    }
    // a user with a different id has this email
    const emailCheck = await findEmail(email, userId)
    if (emailCheck) {
      return errorCreator(
        req,
        res,
        emailExists,
        'Email belongs to another user'
      )
    }
    const newUser = await updateUser(name, email, userId)
    return send(newUser, req, res)
  } catch (error) {
    console.log(error)
    return errorCreator(req, res)
  }
}

module.exports = { sign_up, log_in, suspend, view_all, view_specific, update }
