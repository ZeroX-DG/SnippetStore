const path = require('path')

var config = {
  entry: {
    main: path.join(__dirname, '../browser/index.jsx')
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.sass'],
    alias: {
      'app': path.join(__dirname, '..', 'app'),
      'browser': path.join(__dirname, '..', 'browser'),
      'render': path.join(__dirname, '..', 'browser', 'render'),
      'core': path.join(__dirname, '..', 'browser', 'core'),
      'store': path.join(__dirname, '..', 'browser', 'store'),
      'lib': path.join(__dirname, '..', 'browser', 'lib'),
      'resources': path.join(__dirname, '..', 'resources')
    }
  }
}

module.exports = config
