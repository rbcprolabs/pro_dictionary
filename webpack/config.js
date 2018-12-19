const
  pathResolve = require('path').resolve,
  webpack = require('webpack'),
  { version } = require('../package')

module.exports = ({ mode, dirname }) => {
  const plugins = []

  if (mode === 'development') plugins.push(
    new webpack.HotModuleReplacementPlugin()
  )

  return {
    mode,

    devtool: mode === 'production' ? false : 'source-map',

    resolve: {
      extensions: ['.js', '.jsx', '.json'],
      alias: {
        '@core/stores': pathResolve(dirname, 'src/core/stores'),
        '@core/utils': pathResolve(dirname, 'src/core/utils'),
        '@core/config': pathResolve(dirname, 'src/core/config.js'),
        '@core/configure': pathResolve(dirname, 'src/core/configure.js'),
      },
    },

    module: {
      rules: [{
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          'eslint-loader',
        ],
      }, {
        test: /\.(ico|png|jpg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'assets/',
        },
      }, {
        test: /\.svg$/,
        use: [
          '@svgr/webpack',
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets/',
            },
          },
        ],
      }]
    },

    optimization: {
      minimize: mode === 'production',
      nodeEnv: mode,
    },

    plugins: [
      // new webpack.EnvironmentPlugin(['NODE_ENV']),
      new webpack.DefinePlugin({
        'appVersion': JSON.stringify(version),
      }),
      ...plugins,
    ],
  }
}
