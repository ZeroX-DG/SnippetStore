const path = require('path')

var config = {
  entry: {
    main: [path.join(__dirname, '../browser/index.jsx')]
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(scss|sass)$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
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
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.sass'],
    alias: {
      app: path.join(__dirname, '..', 'app'),
      browser: path.join(__dirname, '..', 'browser'),
      render: path.join(__dirname, '..', 'browser', 'render'),
      core: path.join(__dirname, '..', 'browser', 'core'),
      store: path.join(__dirname, '..', 'browser', 'store'),
      lib: path.join(__dirname, '..', 'browser', 'lib'),
      resources: path.join(__dirname, '..', 'resources')
    }
  }
}

module.exports = config
