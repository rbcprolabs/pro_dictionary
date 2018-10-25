/**
 * Call callback if env != production
 * @param {Function} callback
 */
export default function debug(callback) {
  if (process.env.NODE_ENV !== 'production')
    callback()
}
