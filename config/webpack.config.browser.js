var webpack = require('webpack')
var merge = require('webpack-merge')
var path = require('path')
var base = require('./webpack.config.base')

var outputFile = 'vue-double-list'
var globalName = 'DoubleList'

module.exports = merge(base, {
  output: {
    path: path.join(__dirname, '../dist'),
    filename: outputFile + '.js',
    library: globalName,
    libraryTarget: 'umd',
  },
  externals: {
    // Put external libraries like lodash here
    // With their global name
    // Example: 'lodash': '_'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: true,
      },
      mangle: false,
    }),
  ],
})
