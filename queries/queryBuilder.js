// Errors are not handled
const {
  extractColumns,
  extractConditions,
  extractJoin,
  extractValues,
  extractNewValues,
  extractPagination,
  extractSort
} = require('./queryHelpers')
// Example Run
//  generateFind(
//   {
//     table: 'user',
//     join: {
//       tables: ['meeting', 'task', 'test'],
//       on: {
//         'meeting.id': 'user.id',
//         'task.id': 'meeting.id',
//         'test.df': 'meeting.id'
//       }
//     }
//   },
//   { id: 5, count: { value: 3, operator: '>=', next: 'OR' }, ft: 33 },
//   { 'user.id': 1, 'user.email': 1 }
// )
const generateFind = (
  tables,
  conditions = {},
  columns = {},
  pagination = false,
  sort = {}
) => {
  const { table, join } = tables
  const joinString = extractJoin(join)
  const columnString = extractColumns(columns)
  const conditionString = extractConditions(table, conditions)
  const paginationString = extractPagination(pagination)
  const sortString = extractSort(sort)
  const query = `SELECT ${columnString} FROM ${table} 
  ${joinString || conditionString}
  ${joinString ? conditionString : ''}
  ${sortString} 
  ${paginationString}`
  return query
}
// Example Run
// const test = generateCreate(
//   { table: 'user' },
//   { email: 'youssef@hotmail.com', name: 'youssef' }
// )
const generateCreate = (tables, columns = {}) => {
  const { table } = tables
  const columnString = extractColumns(columns)
  const valueString = extractValues(columns)
  const query = `INSERT INTO ${table} (${columnString})
  VALUES(${valueString})
  RETURNING *`
  return query
}
// Example run
// const test = generateUpdate(
//   { table: 'user' },
//   { email: 'youssef@hotmail.com', name: 'youssef' }
// )
const generateUpdate = (
  tables,
  columns = {},
  conditions = {},
  showFrozen = false
) => {
  const { table } = tables
  const updateString = extractNewValues(columns)
  const conditionString = extractConditions(table, conditions, showFrozen)
  const query = `UPDATE ${table}
  SET ${updateString}
  ${conditionString}
  RETURNING *`
  return query
}
const generateDelete = (tables, conditions) => {
  const { table } = tables
  const conditionString = extractConditions(table, conditions)
  const query = `DELETE FROM ${table}
  ${conditionString}
  RETURNING *`
  return query
}

module.exports = {
  generateFind,
  generateCreate,
  generateUpdate,
  generateDelete
}
