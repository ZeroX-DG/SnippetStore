const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const Store = require('electron-store')
const store = new Store()
const _ = require('lodash')

let showMenu = process.platform !== 'win32'
const windowSize = store.get('windowsize') || { width: 1080, height: 720 }
let mainWindow = null

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: windowSize.width,
    height: windowSize.height,
    minWidth: 500,
    minHeight: 320,
    autoHideMenuBar: showMenu,
    webPreferences: {
      zoomFactor: 1.0,
      blinkFeatures: 'OverlayScrollbars'
    },
    icon: path.resolve(__dirname, '../resources/app.png')
  })

  const url = 'file://' + path.resolve(__dirname, './index.html')

  mainWindow.loadURL(url)
  mainWindow.on('resize', _.throttle(storeWindowSize, 500))
  mainWindow.webContents.openDevTools()
}

function storeWindowSize () {
  try {
    store.set('windowsize', mainWindow.getBounds())
  } catch (e) {}
}

module.exports = createWindow
