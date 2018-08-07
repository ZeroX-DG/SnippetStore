const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const dialog = electron.dialog

function getMenu (app, mainWindow) {
  const macOS = process.platform === 'darwin'

  const file = {
    label: 'File',
    submenu: [
      {
        label: 'Exit',
        click () {
          app.quit()
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
          mainWindow.webContents.send(
            'modal:open',
            'createMultiFilesSnippetModal'
          )
        }
      },
      {
        label: 'Import a snippet',
        click () {
          dialog.showOpenDialog(
            BrowserWindow.getFocusedWindow(),
            {
              title: 'Select snippet JSON file to import',
              properties: ['openFile'],
              buttonLabel: 'Import'
            },
            paths => {
              if (paths[0]) {
                const file = paths[0]
                mainWindow.webContents.send('snippet:import', file)
              }
            }
          )
        }
      },
      {
        label: 'Export all snippets',
        click () {
          dialog.showOpenDialog(
            BrowserWindow.getFocusedWindow(),
            {
              title: 'Select folder to export',
              properties: ['openDirectory'],
              buttonLabel: 'Export'
            },
            paths => {
              if (paths[0]) {
                const folder = paths[0]
                mainWindow.webContents.send('snippet:exportAll', folder)
              }
            }
          )
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

  return [file, snippet, help]
}

module.exports = getMenu
