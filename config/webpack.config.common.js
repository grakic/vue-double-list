var webpack = require('webpack')
var merge = require('webpack-merge')
var path = require('path')
var base = require('./webpack.config.base')

var outputFile = 'vue-double-list'
var globalName = 'DoubleList'

module.exports = merge(base, {
  output: {
    path: path.join(__dirname, '../dist'),
    filename: outputFile + '.common.js',
    libraryTarget: 'commonjs2',
  },
  target: 'node',
  externals: {
    // Put external libraries like lodash here
    // With their package name
    // Example: 'lodash': 'lodash'
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
