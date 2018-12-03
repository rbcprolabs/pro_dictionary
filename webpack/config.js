const
  fs = require('fs'),
  path = require('path')

module.exports = ({mode, dirname}) => ({
  mode,

  devtool: mode === 'production' ? false : 'source-map',

  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      /* Common */
      '@core/stores': path.resolve(dirname, 'src/core/stores'),
      '@core/utils': path.resolve(dirname, 'src/core/utils'),
      '@core/config': path.resolve(dirname, 'src/core/config.js'),
      /* Admin site */
      '@app/components': path.resolve(dirname, 'src/app/components'),
      '@app/containers': path.resolve(dirname, 'src/app/containers'),
      '@app/screens': path.resolve(dirname, 'src/app/screens'),
      '@app/stores': path.resolve(dirname, 'src/app/stores'),
      '@app/theme': path.resolve(dirname, 'src/app/theme.js'),
      '@app/assets': path.resolve(dirname, 'src/app/assets'),
      /* Contentful widget */
      '@widget/components': path.resolve(dirname, 'src/widget/components'),
      '@widget/containers': path.resolve(dirname, 'src/widget/containers'),
      '@widget/screens': path.resolve(dirname, 'src/widget/screens'),
      '@widget/stores': path.resolve(dirname, 'src/widget/stores'),
      '@widget/assets': path.resolve(dirname, 'src/widget/assets'),
    },
  },

  optimization: {
    minimize: mode === 'production',
  },

  devServer: {
    host: '0.0.0.0',
    historyApiFallback: true,
    hot: true,
    https: {
      pfx: fs.readFileSync(path.resolve(__dirname, 'certificate/localhost.pfx')),
      passphrase: 'localhost',
    },
  },
})
