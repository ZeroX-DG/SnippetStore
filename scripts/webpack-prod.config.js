const skeleton = require('./webpack-skeleton')
const path = require('path')
const NodeTargetPlugin = require('webpack/lib/node/NodeTargetPlugin')
const webpack = require('webpack')

var config = Object.assign({}, skeleton, {
  entry: {
    main: [
      path.resolve(__dirname, '..', 'browser', 'index.jsx')
    ]
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
          {
            loader: 'sass-resources-loader',
            options: {
              resources: path.resolve(__dirname, '../browser/render/lib/styles/vars.sass')
            }
          }
        ]
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(jpg|png|gif)$/,
        loader: 'file-loader'
      },
      {
        test: /\.(ttf|woff2|eot|woff)$/,
        loader: 'file-loader'
      }
    ]
  },
  output: {
    path: path.join(__dirname, '..', 'compiled'),
    filename: '[name].js'
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
  mode: 'production'
})

module.exports = config
