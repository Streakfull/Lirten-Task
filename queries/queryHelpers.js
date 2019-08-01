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
const extractConditions = conditions => {
  const conditionFields = Object.keys(conditions)
  if (conditionFields.length === 0) return 'WHERE NOT frozen'
  const conditionString = conditionFields.reduce((string, condition, index) => {
    const { value, operator, next } = conditions[condition]
    return `${string} ${condition}${operator || '='}${setString(value) ||
      setString(conditions[condition])} ${
      index !== conditionFields.length - 1 ? next || 'AND' : ''
    }`
  }, 'WHERE NOT frozen AND')
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

module.exports = {
  extractColumns,
  extractConditions,
  extractJoin,
  extractValues,
  extractNewValues
}
