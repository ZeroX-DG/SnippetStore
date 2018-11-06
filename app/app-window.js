const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const Store = require('electron-store')
const store = new Store()
const _ = require('lodash')

const showMenu = process.platform !== 'win32'
const windowSize = store.get('windowsize') || { width: 1080, height: 720 }
let mainWindow = null
let isQuitting = false

function createWindow (app) {
  mainWindow = new BrowserWindow({
    width: windowSize.width,
    height: windowSize.height,
    minWidth: 500,
    minHeight: 320,
    autoHideMenuBar: showMenu,
    webPreferences: {
      zoomFactor: 1.0,
      blinkFeatures: 'OverlayScrollbars'
    },
    icon: path.resolve(__dirname, '../resources/icon/icon512.png')
  })

  const url = 'file://' + path.resolve(__dirname, './index.html')

  mainWindow.loadURL(url)
  mainWindow.on('resize', _.throttle(storeWindowSize, 500))
  if (process.env.NODE_ENV === 'dev') {
    mainWindow.webContents.openDevTools()
  }
  const screen = electron.screen.getPrimaryDisplay()
  if (
    windowSize.width >= screen.size.width &&
    windowSize.height >= screen.size.height - 1
  ) {
    mainWindow.maximize()
  }
  // prevent the app from quitting
  mainWindow.on('close', e => {
    if (!isQuitting) {
      e.preventDefault()
      mainWindow.blur()
      if (process.platform === 'darwin') {
        app.hide()
      } else {
        mainWindow.hide()
      }
    }
  })

  mainWindow.shouldQuit = function () {
    isQuitting = true
  }

  return mainWindow
}

function storeWindowSize () {
  try {
    store.set('windowsize', mainWindow.getBounds())
  } catch (e) {}
}

module.exports = createWindow
