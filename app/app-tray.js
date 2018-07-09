const { Menu, Tray, nativeImage } = require('electron')
const path = require('path')

function createTray (app, mainWindow) {
  const tray = new Tray(
    nativeImage.createFromPath(
      path.join(__dirname, '..', 'resources', 'icon', 'icon512.png')
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
