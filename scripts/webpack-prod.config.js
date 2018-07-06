const skeleton = require('./webpack-skeleton')
const path = require('path')
const NodeTargetPlugin = require('webpack/lib/node/NodeTargetPlugin')
const webpack = require('webpack')

var config = Object.assign({}, skeleton, {
  output: {
    path: path.join(__dirname, '..', 'compiled'),
    filename: '[name].js',
    publicPath: '../compiled/'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new NodeTargetPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
        'BABEL_ENV': JSON.stringify('production')
      }
    })
  ],
  mode: 'production',
  target: 'electron-renderer'
})

module.exports = config
