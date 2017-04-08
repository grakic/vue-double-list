var path = require('path')
var merge = require('webpack-merge')
var base = require('./webpack.config.base')

var outputFile = 'vue-double-list'
var globalName = 'DoubleList'

module.exports = merge(base, {
  output: {
    path: path.join(__dirname, '../dist'),
    filename: outputFile + '.common.js',
    library: globalName,
    libraryTarget: 'umd',
  },
  devtool: 'eval-source-map',
})
