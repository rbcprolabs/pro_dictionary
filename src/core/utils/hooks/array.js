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
  if (itemIndex === undefined) return undefined
  const newArray = this.slice()
  newArray[itemIndex] = newItem
  return newArray
}

/**
 * Remove element from array by propery
 * @param {string|number} key
 * @param {*} value
 * @returns {any[]} new array
 */
export function removeByProperty(key, value) {
  const itemIndex = _indexOfByProperty(this, key, value)
  if (itemIndex === undefined) return undefined
  const newArray = this.slice()
  newArray.splice(itemIndex, 1)
  return newArray
}

/**
 * Splice array by chunks
 * @param {number} n chunk size
 * @returns {Array}
 * @example
 * [1,2,3,4,5]::splitByChunks(2) // [[1,2],[3,4],[5]]
 */
export function splitByChunks(n) {
  return Array.from(Array(Math.ceil(this.length / n)), (_, i) => this.slice(i * n, i * n + n))
}
