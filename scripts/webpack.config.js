const skeleton = require('./webpack-skeleton')
const path = require('path')
const NodeTargetPlugin = require('webpack/lib/node/NodeTargetPlugin')

var config = Object.assign({}, skeleton, {
  output: {
    path: path.join(__dirname, '..', 'compiled'),
    filename: '[name].js',
    publicPath: 'http://localhost:8000/assets/',
    libraryTarget: 'commonjs2'
  },
  plugins: [
    new NodeTargetPlugin()
  ],
  devtool: 'eval-source-map',
  target: 'electron-renderer'
})

module.exports = config
