process.env.NODE_ENV = 'dev'
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const config = require('./webpack.config')
const signale = require('signale')
const { spawn } = require('child_process')
const electron = require('electron')
const port = 8000
let server = null

const options = {
  publicPath: config.output.publicPath,
  hot: true,
  inline: true,
  quiet: true
}

function startServer () {
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
  config.entry.main.unshift(
    `webpack-dev-server/client?http://localhost:${port}/`,
    'webpack/hot/dev-server'
  )
  const compiler = webpack(config)
  server = new WebpackDevServer(compiler, options)

  return new Promise((resolve, reject) => {
    server.listen(port, 'localhost', function (err) {
      if (err) {
        reject(err)
      }
      signale.success(`Webpack Dev Server listening at localhost:${port}`)
      signale.watch(`Waiting for webpack to bundle...`)
      compiler.hooks.done.tap('done', stats => {
        if (!stats.hasErrors()) {
          signale.success(`Bundle success !`)
          resolve()
        } else {
          reject(stats.compilation.errors[0])
        }
      })
    })
  })
}

function startElectron () {
  spawn(electron, ['--hot', './index.js'])
    .on('close', () => {
      server.close()
    })
    .on('error', err => {
      signale.error(err)
      server.close()
    })
    .on('disconnect', () => {
      server.close()
    })
    .on('exit', () => {
      server.close()
    })
}

startServer()
  .then(() => {
    startElectron()
    signale.success('Electron started')
  })
  .catch(err => {
    signale.error(err)
    process.exit(1)
  })
