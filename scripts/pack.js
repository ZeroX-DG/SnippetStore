const packager = require('electron-packager')
const path = require('path')
const pkg = require('../package.json')
const chalk = require('chalk')

function start (platform) {
  var opts = {
    name: pkg.productName,
    arch: 'x64',
    dir: path.join(__dirname, '..'),
    version: pkg.version,
    'app-version': pkg.version,
    asar: true,
    prune: true,
    overwrite: true,
    out: path.join(__dirname, '..', 'dist'),
    ignore: /^\/browser|\.babelrc|README.md|CHANGELOG.md|jsconfig.json|\/test|\/scripts|\.gitignore|\.eslintignore|\.eslintrc.js|.travis.yml|contributing.md|^\/\.gitmodules|^\/readme.md|^\/webpack|^\/node_modules\/babel-register/
  }
  switch (platform) {
    case 'win':
      Object.assign(opts, {
        platform: 'win32',
        icon: path.join(__dirname, '..', 'resources', 'icon', 'icon512.ico'),
        'version-string': {
          FileDescription: 'SnippetStore',
          OriginalFilename: 'SnippetStore',
          FileVersion: pkg.version,
          ProductVersion: pkg.version,
          ProductName: pkg.productName,
          InternalName: pkg.productName
        }
      })
      packager(opts, function (err, appPath) {
        if (err) {
          console.log(chalk.default.red(err))
        }
      })
      break
    case 'osx':
      Object.assign(opts, {
        platform: 'darwin',
        icon: path.join(__dirname, '..', 'resources', 'icon', 'icon512.png'),
        'app-category-type': 'public.app-category.developer-tools'
      })
      packager(opts, function (err, appPath) {
        if (err) {
          console.log(chalk.default.red(err))
        }
      })
      break
    case 'linux':
      Object.assign(opts, {
        platform: 'linux',
        icon: path.join(__dirname, '..', 'resources', 'icon', 'icon512.png'),
        'app-category-type': 'public.app-category.developer-tools'
      })
      packager(opts, function (err, appPath) {
        if (err) {
          console.log(chalk.default.red(err))
        }
      })
      break
  }
}

function getTarget () {
  switch (process.platform) {
    case 'darwin':
      return 'osx'
    case 'win32':
      return 'win'
    case 'linux':
      return 'linux'
    default:
      return process.platform
  }
}

start(process.argv[2] !== 'current' ? process.argv[2] : getTarget())
