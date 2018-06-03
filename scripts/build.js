process.env.NODE_ENV = 'production'

const chalk = require('chalk')
const del = require('del')
const webpack = require('webpack')
const productionConfig = require('./webpack-prod.config')

function clean () {
  return new Promise((resolve, reject) => {
    console.log(chalk.default.yellow('Clearning compiled folder...'))
    del(['compiled/*']).then(() => {
      console.log(chalk.default.green('Done!'))
      resolve()
    }).catch((err) => {
      reject(err)
    })
  })
}

function start () {
  clean().then(() => {
    buildAll()
  }).catch((err) => {
    console.log(chalk.default.red(err))
  })
}

function buildAll () {
  console.log(chalk.default.yellow('Compiling...'))
  build(productionConfig).then(() => {
    console.log(chalk.default.green('Compile success!'))
  }).catch((err) => {
    console.log(chalk.default.red(err))
  })
}

function build (config) {
  return new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err) {
        reject(err)
      } else if (stats.hasErrors()) {
        let err = ''

        stats.toString({
          chunks: false,
          colors: true
        }).split(/\r?\n/).forEach(line => {
          err += `    ${line}\n`
        })
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

start()
