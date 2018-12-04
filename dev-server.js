const
  fs = require('fs'),
  path = require('path'),
  https = require('https'),
  express = require('express'),
  webpack = require('webpack'),
  history = require('connect-history-api-fallback')

const app = express()

;(function() {
  const webpackConfig = require(process.env.WEBPACK_CONFIG || './webpack.config')

  app.use(history({
    rewrites: [{
      from: /^\/widget\/?$/,
      to: '/widget/index.html'
    }]
  }))

  webpackConfig.forEach((config, index) => {
    const compiler = webpack(config)

    app
      .use(require('webpack-dev-middleware')(compiler, {
        publicPath: config.output.publicPath,
        index: 'index.html'
      }))
      .use(require('webpack-hot-middleware')(compiler, {
        log: console.log,
        path: `${config.output.publicPath}__webpack_hmr`,
        heartbeat: 10 * 1000,
      }))
  })
})()

if (require.main === module) {
  const server = https.createServer({
    pfx: fs.readFileSync('./webpack/certificate/localhost.pfx'),
    passphrase: 'localhost',
  }, app)
  server.listen(process.env.PORT || 8080, () =>
    console.log('Listening on %j', server.address())
  )
}
