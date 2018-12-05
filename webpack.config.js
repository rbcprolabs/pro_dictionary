const
  config = require('./webpack/config'),
  app = require('./webpack/app.config'),
  widget = require('./webpack/widget.config'),
  merge = require('webpack-merge')

const
  options = {
    mode: process.env.NODE_ENV || 'development',
    dirname: __dirname,
  },
  baseConfig = config(options)

module.exports = [
  merge.smart(baseConfig, app(options)),
  merge.smart(baseConfig, widget(options)),
]
