let cache = {}

// gets the required property from the cache
const getCache = prop => cache[prop]
// appends an object to the cache
const setCache = data => {
  cache = { ...cache, ...data }
}
// removes a property from the cache
const removeFromCache = prop => {
  delete cache[prop]
}

module.exports = { getCache, setCache, removeFromCache }
