const packager = require('electron-packager')
const path = require('path')
const pkg = require('../package.json')
const chalk = require('chalk')

function start (platform) {
  var opts = {
    name: pkg.productName,
    arch: 'x64',
    dir: path.join(__dirname, '..'),
    version: '1.8.6',
    'app-version': pkg.version,
    asar: false,
    prune: true,
    overwrite: true,
    out: path.join(__dirname, '..', 'dist'),
    ignore: /^\/browser|\.babelrc|\.gitignore|^\/\.gitmodules|^\/readme.md|^\/webpack|^\/node_modules\/babel-register/
  }
  switch (platform) {
    case 'win':
      Object.assign(opts, {
        platform: 'win32',
        icon: path.join(__dirname, 'resources/app.ico'),
        'version-string': {
          FileDescription: 'DBPower',
          OriginalFilename: 'DBPower',
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
        icon: path.join(__dirname, 'resources/app.icns'),
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
        icon: path.join(__dirname, 'resources/app.icns'),
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

start('linux')
