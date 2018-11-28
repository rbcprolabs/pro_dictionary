/**
 * Enviroment value selector
 * *
 * @param env
 * *
 * @example
 * enviroment({
 *  staging: 'hello from staging',
 *  development: 'hello from development',
 * })
 */
export default function enviroment(env) {
  // eslint-disable-next-line no-undef
  return env[process.env.NODE_ENV] || env.development
}
