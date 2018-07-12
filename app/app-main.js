const { app, Menu } = require('electron')

let mainWindow = null

const isSecondInstance = app.makeSingleInstance(function (
  commandLine,
  workingDirectory
) {
  if (mainWindow) {
    if (process.platform === 'win32') {
      mainWindow.minimize()
      mainWindow.restore()
    }
    mainWindow.show()
    mainWindow.focus()
  }
  return true
})

if (isSecondInstance) {
  app.quit()
}

app.on('ready', () => {
  mainWindow = require('./app-window')(app)
  require('./app-tray')(app, mainWindow)
  const template = require('./app-menu')(app, mainWindow)
  const menu = Menu.buildFromTemplate(template)
  switch (process.platform) {
    case 'darwin':
      Menu.setApplicationMenu(menu)
      break
    case 'win32':
      mainWindow.setMenu(menu)
      break
    case 'linux':
      Menu.setApplicationMenu(menu)
      mainWindow.setMenu(menu)
      break
  }
})

app.on('before-quit', () => {
  mainWindow.shouldQuit()
})
