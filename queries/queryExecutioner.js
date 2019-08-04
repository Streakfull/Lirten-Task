const {
  generateFind,
  generateCreate,
  generateUpdate,
  generateDelete
} = require('./queryBuilder')

const { pgClient } = require('../config/DBConfig')

const find = async (tables, conditions, columns, pagination, sort) => {
  const query = generateFind(tables, conditions, columns, pagination, sort)
  console.log(`EXECUTING ${query}`)
  const { rows } = await pgClient.query(query)
  return rows
}

const create = async (tables, columns) => {
  try {
    const query = generateCreate(tables, columns)
    await pgClient.query('BEGIN')
    console.log(`EXECUTING ${query}`)
    const { rows } = await pgClient.query(query)
    await pgClient.query('COMMIT')
    return rows
  } catch (e) {
    console.log('Something went wrong,committing rollback')
    await pgClient.query('ROLLBACK')
    return false
  }
}

const updateMany = async (tables, columns, conditions) => {
  try {
    const query = generateUpdate(tables, columns, conditions)
    await pgClient.query('BEGIN')
    console.log(`EXECUTING ${query}`)
    const { rows } = await pgClient.query(query)
    await pgClient.query('COMMIT')
    return rows
  } catch (e) {
    console.log(e)
    console.log('Something went wrong,committing rollback')
    await pgClient.query('ROLLBACK')
    return false
  }
}
const freeze = async (tables, frozen, conditions) => {
  try {
    const query = generateUpdate(tables, { frozen }, conditions, true)
    await pgClient.query('BEGIN')
    console.log(`EXECUTING ${query}`)
    const { rows } = await pgClient.query(query)
    await pgClient.query('COMMIT')
    return rows
  } catch (e) {
    console.log(e)
    console.log('Something went wrong,committing rollback')
    await pgClient.query('ROLLBACK')
    return false
  }
}
const createMany = async (tables, columns) => {
  try {
    // refactor to reduce
    let query = ''
    columns.forEach(column => {
      query = `${query}
            ${generateCreate(tables, column)};`
    })
    await pgClient.query('BEGIN')
    console.log(`EXECUTING ${query}`)
    const { rows } = await pgClient.query(query)
    await pgClient.query('COMMIT')
    return rows
  } catch (e) {
    console.log('Something went wrong,committing rollback')
    await pgClient.query('ROLLBACK')
    return false
  }
}
// array of condition objects
const deleteMany = async (tables, conditions) => {
  try {
    let query = ''
    conditions.forEach(condition => {
      query = `${query}
      ${generateDelete(tables, condition)};`
    })
    await pgClient.query('BEGIN')
    console.log(`EXECUTING ${query}`)
    const { rows } = await pgClient.query(query)
    await pgClient.query('COMMIT')
    return rows
  } catch (e) {
    console.log('Something went wrong,committing rollback')
    await pgClient.query('ROLLBACK')
    return false
  }
}
// takes a list of unrelated queries and performs an acid transaction
const acidExecute = async queries => {
  try {
    console.log(queries)
    let query = ''
    queries.forEach(q => {
      const { type, tables, conditions, columns } = q
      if (type === 'update')
        query = `${query}
      ${generateUpdate(tables, columns, conditions)};`
      else
        query = `${query}
         ${generateCreate(tables, columns)};`
    })
    await pgClient.query('BEGIN')
    const { rows } = await pgClient.query(query)
    await pgClient.query('COMMIT')
    return rows
  } catch (e) {
    console.log('Something went wrong,committing rollback')
    await pgClient.query('ROLLBACK')
    return false
  }
}

module.exports = {
  find,
  create,
  updateMany,
  createMany,
  deleteMany,
  acidExecute,
  freeze
}
