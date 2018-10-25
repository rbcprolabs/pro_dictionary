const
  path = require('path'),
  webpack = require('webpack'),
  OfflinePlugin = require('offline-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  CopyWebpackPlugin = require('copy-webpack-plugin'),
  { version } = require('./package')

const mode = process.env.NODE_ENV || 'development',
  plugins = []

mode === 'production' &&
  plugins.push(
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
        publicPath: '/sw.js'
      },
    }),
  )

module.exports = {
  mode,

  entry: {
    app: `${__dirname}/src/index.jsx`,
  },

  output: {
    path: `${__dirname}/build`,
    filename: '[name].bundle.js',
    publicPath: '/',
  },

  devtool: mode === 'production' ? false : 'source-map',

  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      'components': path.resolve(__dirname, 'src/components'),
      'containers': path.resolve(__dirname, 'src/containers'),
      'screens': path.resolve(__dirname, 'src/screens'),
      'stores': path.resolve(__dirname, 'src/stores'),
      'utils': path.resolve(__dirname, 'src/utils'),
      'assets': path.resolve(__dirname, 'src/assets'),
    }
  },

  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /(node_modules)/,
      loader: ['babel-loader'],
    }, {
      test: /\.(ico|svg|png|jpg)$/,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
        outputPath: 'assets/',
      },
    }]
  },

  optimization: {
    minimize: mode === 'production',
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
      template: './src/index.html',
    }),
    new CopyWebpackPlugin([{
      from: './src/manifest.json',
      to: './',
    }, {
      from: './src/browserconfig.xml',
      to: './',
    }, {
      from: './src/assets/icons',
      to: './assets/icons',
    }]),
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new webpack.DefinePlugin({
      'appVersion': JSON.stringify(version),
    }),
    ...plugins,
  ],

  devServer: {
    host: '0.0.0.0',
    historyApiFallback: true,
  },
}
