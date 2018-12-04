const pathResolve = require('path').resolve

module.exports = ({mode, dirname}) => ({
  mode,

  devtool: mode === 'production' ? false : 'source-map',

  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      /* Common */
      '@core/stores': pathResolve(dirname, 'src/core/stores'),
      '@core/utils': pathResolve(dirname, 'src/core/utils'),
      '@core/config': pathResolve(dirname, 'src/core/config.js'),
      /* Admin site */
      '@app/components': pathResolve(dirname, 'src/app/components'),
      '@app/containers': pathResolve(dirname, 'src/app/containers'),
      '@app/screens': pathResolve(dirname, 'src/app/screens'),
      '@app/stores': pathResolve(dirname, 'src/app/stores'),
      '@app/theme': pathResolve(dirname, 'src/app/theme.js'),
      '@app/assets': pathResolve(dirname, 'src/app/assets'),
      /* Contentful widget */
      '@widget/components': pathResolve(dirname, 'src/widget/components'),
      '@widget/containers': pathResolve(dirname, 'src/widget/containers'),
      '@widget/screens': pathResolve(dirname, 'src/widget/screens'),
      '@widget/stores': pathResolve(dirname, 'src/widget/stores'),
      '@widget/assets': pathResolve(dirname, 'src/widget/assets'),
    },
  },

  optimization: {
    minimize: mode === 'production',
  },
})
