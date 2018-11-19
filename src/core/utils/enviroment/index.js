import config from '@core/config'

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
  return env[config.env] || env.development
}
