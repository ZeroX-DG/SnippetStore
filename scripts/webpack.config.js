const skeleton = require('./webpack-skeleton')
const path = require('path')
const NodeTargetPlugin = require('webpack/lib/node/NodeTargetPlugin')

var config = Object.assign({}, skeleton, {
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
    filename: '[name].js',
    publicPath: 'http://localhost:8000/assets/',
    libraryTarget: 'commonjs2'
  },
  plugins: [
    new NodeTargetPlugin()
  ],
  target: 'electron-renderer'
})

module.exports = config
