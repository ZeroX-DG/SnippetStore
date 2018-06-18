const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const mainWindow = require('./app-window')

const macOS = process.platform === 'darwin'

const file = {
  label: 'File',
  submenu: [
    {
      label: 'Exit',
      click () {
        BrowserWindow.getCurrentWindow().close()
      }
    }
  ]
}

const snippet = {
  label: 'Snippet',
  submenu: [
    {
      label: 'Create new snippet',
      accelerator: macOS ? 'Command+N' : 'Control+N',
      click () {
        mainWindow.webContents.send('modal:open', 'pickSnippetTypeModal')
      }
    },
    {
      label: 'Create new single file snippet',
      click () {
        mainWindow.webContents.send('modal:open', 'createSnippetModal')
      }
    },
    {
      label: 'Create new multi file snippet',
      click () {
        mainWindow.webContents.send('modal:open', 'createMultiFilesSnippetModal')
      }
    }
  ]
}

const help = {
  label: 'Help',
  submenu: [
    {
      label: 'Open Devtool',
      accelerator: macOS ? 'Command+Alt+I' : 'Control+Shift+I',
      click () {
        BrowserWindow.getFocusedWindow().toggleDevTools()
      }
    },
    {
      label: 'Reload window',
      accelerator: macOS ? 'Command+Alt+R' : 'Control+Shift+R',
      click () {
        BrowserWindow.getFocusedWindow().reload()
      }
    }
  ]
}

module.exports = [file, snippet, help]
