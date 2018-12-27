const
  pathResolve = require('path').resolve,
  OfflinePlugin = require('offline-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = ({ mode, dirname }) => {
  const etrypoint = [pathResolve(dirname, 'src/app/bootstrap.js'), pathResolve(dirname, 'src/app/index.jsx')]

  if (mode === 'development')
    // path = output.publicPath + __webpack_hmr
    etrypoint.push('webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true')

  return {
    entry: {
      app: etrypoint,
    },

    output: {
      path: pathResolve(dirname, 'build'),
      filename: '[name].bundle.js',
      publicPath: '/',
    },

    resolve: {
      alias: {
        '@app/components': pathResolve(dirname, 'src/app/components'),
        '@app/containers': pathResolve(dirname, 'src/app/containers'),
        '@app/screens': pathResolve(dirname, 'src/app/screens'),
        '@app/stores': pathResolve(dirname, 'src/app/stores'),
        '@app/theme': pathResolve(dirname, 'src/app/theme.js'),
        '@app/assets': pathResolve(dirname, 'src/app/assets'),
      },
    },

    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /node_modules/,
            chunks: 'initial',
            name: 'vendor',
            enforce: true
          },
        }
      },
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: './src/app/index.html',
      }),
      new CopyWebpackPlugin([{
        from: './src/app/manifest.json',
        to: './',
      }, {
        from: './src/app/assets/icons',
        to: './assets/icons',
      }]),
      new OfflinePlugin({
        safeToUseOptionalCaches: true,
        caches: {
          main: [
            'app.bundle.js',
            'vendor.bundle.js',
            ':rest:',
          ],
          additional: [
            ':externals:',
          ],
        },
        externals: [
          '/manifest.json',
          '/assets/**/*.*',
          '/',
        ],
        ServiceWorker: {
          events: true,
          navigateFallbackURL: '/',
          output: 'service-worker.js',
        },
        publicPath: '/',
        AppCache: false,
      }),
    ],
  }
}
