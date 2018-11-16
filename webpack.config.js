const
  config = require('./webpack/config'),
  app = require('./webpack/app.config'),
  widget = require('./webpack/widget.config')

const
  mode = process.env.NODE_ENV || 'development',
  baseConfig = config({
    mode,
    dirname: __dirname,
  })

module.exports = [
  Object.assign({}, baseConfig, app),
  Object.assign({}, baseConfig, widget),
]
