const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const {
  find,
  create,
  updateMany,
  freeze
} = require('../../queries/queryExecutioner')
const { tokenKey } = require('../../config/keys')
const { getCache, setCache, removeFromCache } = require('../cache')

const table = 'app_user'

// checks if an email is found
const findEmail = async (email, idCheck = false) => {
  const query = idCheck
    ? { email, id: { value: idCheck, operator: '!=' } }
    : { email }
  const user = await find({ table }, query)
  if (user.length > 0) return user[0]
  return false
}

const hashPassword = password => {
  const salt = bcrypt.genSaltSync(10)
  const hashedPassword = bcrypt.hashSync(password, salt)
  return hashedPassword
}
const createUser = async (name, email, password) => {
  const user = await create({ table }, { name, email, password })
  removeFromCache('users')
  return user
}

const comparePassword = (storedPassword, newPassword) =>
  bcrypt.compareSync(storedPassword, newPassword) // eslint-disable-line

const generateToken = user => {
  const { id, name, email } = user
  const payload = { id, name, email }
  return jwt.sign(payload, tokenKey)
}
const findUser = async (id, showSuspended = false) => {
  const query = showSuspended ? { id } : { id, is_suspended: false }
  const user = await find({ table }, query)
  if (user.length > 0) return user[0]
  return false
}
// checks if a user state can be moved to the required one
const checkSuspension = (user, suspension) => {
  const { is_suspended } = user
  if (is_suspended && suspension) return false
  if (!is_suspended && !suspension) return false
  return true
}
const suspendUser = async (userId, isSuspended) => {
  const user = await updateMany(
    { table },
    { is_suspended: isSuspended },
    { id: userId }
  )
  removeFromCache('users')
  return user
}
const findAllUsers = async pagination => {
  const { page, limit } = pagination
  const cachedUsers = getCache('users', page, limit)
  if (cachedUsers) {
    return cachedUsers
  }
  const users = await find({ table }, {}, {}, pagination)
  setCache('users', page, limit, users)
  return users
}
const updateUser = async (name, email, userId) => {
  const user = await updateMany({ table }, { name, email }, { id: userId })
  removeFromCache('users')
  return user
}
const freezeUser = async (userId, frozen) => {
  const user = await freeze({ table }, frozen, { id: userId })
  removeFromCache('users')
  return user
}

module.exports = {
  findEmail,
  hashPassword,
  createUser,
  comparePassword,
  generateToken,
  findUser,
  checkSuspension,
  suspendUser,
  findAllUsers,
  updateUser,
  freezeUser
}
