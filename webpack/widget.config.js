const
  pathResolve = require('path').resolve,
  HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = ({ mode, dirname }) => {
  const etrypoint = [pathResolve(dirname, 'src/widget/index.jsx')]

  if (mode === 'development')
    // path = output.publicPath + __webpack_hmr
    etrypoint.push('webpack-hot-middleware/client?path=/widget__webpack_hmr&timeout=20000&reload=true')

  return {
    entry: {
      widget: etrypoint,
    },

    output: {
      path: pathResolve(dirname, 'build/widget'),
      filename: 'bundle.js',
      publicPath: '/widget',
    },

    resolve: {
      alias: {
        '@widget/components': pathResolve(dirname, 'src/widget/components'),
        '@widget/containers': pathResolve(dirname, 'src/widget/containers'),
        '@widget/screens': pathResolve(dirname, 'src/widget/screens'),
        '@widget/stores': pathResolve(dirname, 'src/widget/stores'),
        '@widget/assets': pathResolve(dirname, 'src/widget/assets'),
      },
    },

    module: {
      rules: [{
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
            },
          },
          'sass-loader',
        ],
      }],
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: './src/widget/index.html',
      }),
    ],
  }
}
