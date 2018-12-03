/**
 * Find element from array by property
 * @param {Array} items
 * @param {string|number} key
 * @param {*} value
 */
export function _findByProperty(items, key, value) {
  if (key === '' || key === undefined || value === undefined)
    return undefined

  return items.find((element) => (element[key] == value)
    ? element
    : undefined
  )
}

/**
 * Find element from array by property
 * @param {string|number} key
 * @param {*} value
 */
export function findByProperty(key, value) {
  return _findByProperty(this, key, value)
}
