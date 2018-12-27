/**
 * Async delay
 * @param {number} ms
 * @example
 * await asyncDelay(1000)
 */
export default function asyncDelay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
