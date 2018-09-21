const { Menu, Tray, nativeImage } = require('electron')
const path = require('path')
const isOSX = process.platform === 'darwin'
let tray = null

function createTray (app, mainWindow) {
  const icon = isOSX ? 'icon18.png' : 'icon512.png'
  tray = new Tray(
    nativeImage.createFromPath(
      path.join(__dirname, '..', 'resources', 'icon', icon)
    )
  )

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open app',
      type: 'normal',
      click: () => {
        mainWindow.show()
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      type: 'normal',
      click: () => {
        app.quit()
      }
    }
  ])
  tray.setToolTip('Snippet Store')
  tray.setContextMenu(contextMenu)

  tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  })
}

module.exports = createTray
