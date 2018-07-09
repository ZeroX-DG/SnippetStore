const { Menu, Tray } = require('electron')

function createTray (app, mainWindow) {
  const tray = new Tray('resources/icon/icon512.png')

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Item1', type: 'radio' },
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
