/**
 * Find element from array by property
 * @param {any[]} items
 * @param {string|number} key
 * @param {*} value
 * @return {*} result item
 */
export function _findByProperty(items, key, value) {
  if (key === '' || key === undefined || value === undefined)
    return undefined

  return items.find((element) => (element[key] == value))
}

/**
 * Find element from array by property
 * @param {any[]} items
 * @param {string|number} key
 * @param {*} value
 * @returns {number} index
 */
export function _indexOfByProperty(items, key, value) {
  if (key === '' || key === undefined || value === undefined)
    return undefined

  return items.findIndex((element) => (element[key] == value))
}

/**
 * Find element from array by propery
 * @param {string|number} key
 * @param {*} value
 */
export function findByProperty(key, value) {
  return _findByProperty(this, key, value)
}

/**
 * Replce element from array by propery
 * @param {string|number} key
 * @param {*} value
 * @param {*} newItem
 * @returns {any[]} new array
 */
export function updateByProperty(key, value, newItem) {
  const itemIndex = _indexOfByProperty(this, key, value)
  if (!itemIndex) return undefined
  const newArray = this.slice()
  newArray[itemIndex] = newItem
  return newArray
}
