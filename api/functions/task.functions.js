const moment = require('moment')

const taskTable = 'task'
const {
  find,
  create,
  updateMany,
  freeze
} = require('../../queries/queryExecutioner')
const { getCache, setCache, removeFromCache } = require('../cache')

const createTask = async (userId, name) => {
  const task = await create({ table: taskTable }, { user_id: userId, name })
  removeFromCache('tasks')
  return task
}
const findAllTasks = async pagination => {
  const { page, limit } = pagination
  const cachedtasks = getCache('tasks', page, limit)
  if (cachedtasks) return cachedtasks
  const tasks = await find({ table: taskTable }, {}, {}, pagination)
  setCache('tasks', page, limit, tasks)
  return tasks
}
const findUserTasks = async (userId, pagination) => {
  const tasks = await find(
    { table: taskTable },
    { user_id: userId },
    {},
    pagination
  )
  return tasks
}
const findTask = async taskId => {
  const task = await find({ table: taskTable }, { id: taskId })
  if (task.length > 0) return task[0]
  return false
}

const editTask = async (taskId, name) => {
  const task = await updateMany({ table: taskTable }, { name }, { id: taskId })
  removeFromCache('tasks')
  return task
}

const checkEditFrozen = task => task.edit_frozen

const checkStatus = (task, editFrozen) => {
  const { edit_frozen } = task
  if (edit_frozen && editFrozen) return false
  if (!edit_frozen && !editFrozen) return false
  return true
}
const freezeTask = async (taskId, frozen) => {
  const task = await updateMany(
    { table: taskTable },
    { edit_frozen: frozen },
    { id: taskId }
  )
  removeFromCache('tasks')
  return task
}

const endTask = taskId => {
  const query = {
    tables: { table: taskTable },
    type: 'update',
    columns: { end_date: moment().format() },
    conditions: { id: taskId }
  }
  removeFromCache('tasks')
  return query
}
const freezeTaskAll = async (taskId, frozen) => {
  const task = await freeze({ table: taskTable }, frozen, { id: taskId })
  removeFromCache('tasks')
  return task
}
const filterQuery = async (userId, filterObject) => {
  const keys = Object.keys(filterObject)
  let conditionQuery = {}
  let sortFound = false
  const sort = {}
  keys.forEach(key => {
    const { value, exact, sortBy, lower, type } = filterObject[key]
    let query
    if (key === 'isDone')
      query = {
        end_date: {
          value: null,
          operator: filterObject.isDone.value ? '!=' : '='
        }
      }
    else if (exact) query = { [key]: value }
    else if (lower) query = { [key]: { value, operator: '<=' } }
    else query = { [key]: { value, operator: '>=' } }
    if (sortBy && !sortFound) {
      const sortType = type || 'DESC'
      sort[key] = sortType
      sortFound = true
    }
    conditionQuery = { ...conditionQuery, ...query }
  })
  if (userId) conditionQuery.user_id = userId
  const result = await find(
    { table: taskTable },
    conditionQuery,
    {},
    false,
    sort
  )
  return result
}

module.exports = {
  createTask,
  findAllTasks,
  findUserTasks,
  findTask,
  checkEditFrozen,
  editTask,
  checkStatus,
  freezeTask,
  endTask,
  freezeTaskAll,
  filterQuery
}
