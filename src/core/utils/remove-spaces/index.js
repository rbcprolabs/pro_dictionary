/**
 * Remove space from start & end string
 * @param {string} text
 * @returns {string}
 *
 * @example
 * " text "::removeSpaces() // "Text"
 */
export default function removeSpaces() {
  return this.replace(/(^\s*)|(\s*)$/g, '')
}
