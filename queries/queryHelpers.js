// function to set quotations around a string
const setString = string => {
  if (typeof string === 'string') return `'${string}'`
  return string
}
// gets column string from the column object
const extractColumns = columns => {
  const columnNames = Object.keys(columns)
  if (columnNames.length === 0) return '*'
  const columnString = columnNames.reduce((string, name, index) => {
    const concatenation = `${string}${name}`
    if (index === columnNames.length - 1) return concatenation
    return `${concatenation},`
  }, '')
  return columnString
}

// gets condition string from condition object
const extractConditions = (tableName, conditions, showFrozen = false) => {
  console.log(conditions)
  const baseCondition = showFrozen ? '' : `WHERE NOT ${tableName}.frozen`
  const startingCondition = showFrozen
    ? 'WHERE '
    : `WHERE NOT ${tableName}.frozen AND`
  const conditionFields = Object.keys(conditions)
  if (conditionFields.length === 0) return baseCondition
  const conditionString = conditionFields.reduce((string, condition, index) => {
    const { value, operator, next } = conditions[condition]
    const valueInserted =
      value !== undefined ? setString(value) : setString(conditions[condition])
    return `${string} ${condition}${operator || '='}${valueInserted} ${
      index !== conditionFields.length - 1 ? next || 'AND' : ''
    }`
  }, startingCondition)
  return conditionString
}
// gets join string from join object
const extractJoin = join => {
  if (!join) return false
  const { tables, on } = join
  const joinAttributes = Object.keys(on)
  const joinString = tables.reduce((string, table, index) => {
    const joinProperty = joinAttributes[index]
    const query = `${string} INNER JOIN ${table} ON ${joinProperty} = ${
      on[joinProperty]
    }`
    if (index === tables.length - 1) return query
    return `${query},
  `
  }, '')
  return joinString
}

// get value string from column object
const extractValues = columns => {
  const columNames = Object.keys(columns)
  const valueString = columNames.reduce((string, columnName, index) => {
    const value = setString(columns[columnName])
    const query = `${string} ${value}`
    if (index === columNames.length - 1) return query
    return `${query},`
  }, '')
  return valueString
}

// gets new values from column object
const extractNewValues = columns => {
  if (columns === {}) return ''
  const columNames = Object.keys(columns)
  const valueString = columNames.reduce((string, columnName, index) => {
    const value = setString(columns[columnName])
    const query = `${string} ${columnName}=${value}`
    if (index === columNames.length - 1) return query
    return `${query},`
  }, '')
  return valueString
}
const extractPagination = pagination => {
  if (!pagination) return ''
  const { limit, page } = pagination
  const offset = limit * page
  return `OFFSET ${offset} LIMIT ${limit}`
}
const extractSort = sort => {
  const keys = Object.keys(sort)
  if (keys.length === 0) return ''
  return `ORDER BY ${keys[0]} ${sort[keys[0]]}`
}

module.exports = {
  extractColumns,
  extractConditions,
  extractJoin,
  extractValues,
  extractNewValues,
  extractPagination,
  extractSort
}
