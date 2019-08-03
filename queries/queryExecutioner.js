const {
  generateFind,
  generateCreate,
  generateUpdate
} = require('./queryBuilder')

const { pgClient } = require('../config/DBConfig')

const find = async (tables, conditions, columns, pagination) => {
  const query = generateFind(tables, conditions, columns, pagination)
  console.log(`EXECUTING ${query}`)
  const { rows } = await pgClient.query(query)
  return rows
}
// id flag to specify whether to return the id or not
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
    console.log('Something went wrong,committing rollback')
    await pgClient.query('ROLLBACK')
    return false
  }
}

module.exports = { find, create, updateMany }
