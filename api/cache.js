// Will cache all getters
// in the form of
// // {
//  users:
//   [{page:0,limit:0,data:[]}
//   ]
//
// }
//
const cache = {}

// gets the required property from the cache
const getCache = (prop, page, limit) => {
  const data = cache[prop]
  if (!data) return false
  const cachedData = data.find(
    cacheEntry => cacheEntry.page === page && cacheEntry.limit === limit
  )
  if (cachedData) return cachedData.data
  return false
}
// appends an object to the cache
const setCache = (prop, page, limit, data) => {
  const old = cache[prop]
  if (!old) cache[prop] = [{ page, limit, data }]
  cache[prop].push({ page, limit, data })
}
// removes a property from the cache
const removeFromCache = prop => {
  delete cache[prop]
}

module.exports = { getCache, setCache, removeFromCache }
