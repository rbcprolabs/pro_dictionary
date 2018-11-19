const
  pathResolve = require('path').resolve,
  webpack = require('webpack'),
  OfflinePlugin = require('offline-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  CopyWebpackPlugin = require('copy-webpack-plugin'),
  { version } = require('../package')

module.exports = {
  entry: {
    app: pathResolve(__dirname, '../', 'src/app/index.jsx'),
  },

  output: {
    path: pathResolve(__dirname, '../', 'build'),
    filename: '[name].bundle.js',
    publicPath: '/',
  },

  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /(node_modules)/,
      loader: ['babel-loader'],
    },{
      test: /\.js$/,
      exclude: /node_modules/,
      use: ['babel-loader', 'eslint-loader'],
    },{
      test: /\.(svg|ico|png|jpg)$/,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
        outputPath: 'assets/',
      },
    }]
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
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new webpack.DefinePlugin({
      'appVersion': JSON.stringify(version),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: './src/app/index.html',
    }),
    new CopyWebpackPlugin([{
      from: './src/app/manifest.json',
      to: './',
    }, {
      from: './src/app/browserconfig.xml',
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
        '/browserconfig.xml',
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
