const GhReleases = require('electron-gh-releases')

const options = {
  repo: 'ZeroX-DG/SnippetStore',
  currentVersion: process.getVersion()
}

const updater = new GhReleases(options)

const checkForUpdate = () => {
  return new Promise(resolve => {
    updater.check((err, status) => {
      if (!err && status) {
        resolve(true)
        return
      }
      resolve(false)
    })
  })
}

const downloadAndInstall = () => {
  updater.download()
  updater.on('update-downloaded', info => {
    // Restart the app and install the update
    updater.install()
  })
}

module.exports = {
  updater,
  checkForUpdate,
  downloadAndInstall
}
