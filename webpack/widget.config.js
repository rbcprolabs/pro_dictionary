const
  pathResolve = require('path').resolve,
  webpack = require('webpack'),
  HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    widget: pathResolve(__dirname, '../', 'src/widget/index.jsx'),
  },

  output: {
    path: pathResolve(__dirname, '../', 'build/widget'),
    filename: 'bundle.js',
    publicPath: '/widget',
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
      test: /\.(ico|png|jpg)$/,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
        outputPath: 'assets/',
      },
    },{
      test: /\.svg$/,
      use: [
        'babel-loader',
        {
          loader: 'react-svg-loader',
          options: {
            jsx: true,
          },
        },
      ],
    }, {
      test: /\.scss$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            modules: true,
            importLoaders: 1,
            localIdentName: '[name]_[local]_[hash:base64]',
            sourceMap: true,
            minimize: true
          },
        },
        'sass-loader',
      ],
    }],
  },

  plugins: [
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new HtmlWebpackPlugin({
      template: './src/widget/index.html',
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
}
