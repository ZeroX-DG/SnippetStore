const electron = require('electron')
const os = require('os')
const { checkForUpdate, downloadAndInstall } = require('./app-updator')
const BrowserWindow = electron.BrowserWindow
const dialog = electron.dialog

function getAppInfo () {
  const info = `
Version: ${process.getVersion()}
Commit: ${process.getCommit()}
Electron: ${process.versions.electron}
Chrome: ${process.versions.chrome}
Node.js: ${process.versions.node}
V8: ${process.versions.v8}
OS: ${os.type()} ${os.arch()} ${os.release()}`
  return info
}

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
        label: 'Import all snippets',
        click () {
          dialog.showOpenDialog(
            BrowserWindow.getFocusedWindow(),
            {
              title: 'Select snippet JSON file to import',
              properties: ['openFile'],
              buttonLabel: 'Import'
            },
            paths => {
              if (paths && paths[0]) {
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
              if (paths && paths[0]) {
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
      },
      {
        label: 'About',
        click () {
          dialog.showMessageBox({
            type: 'info',
            title: 'Snippet Store',
            message: 'Snippet Store',
            detail: getAppInfo(),
            buttons: ['OK']
          })
        }
      },
      {
        label: 'Check for updates',
        click () {
          checkForUpdate().then(hasNewUpdate => {
            if (hasNewUpdate) {
              dialog.showMessageBox(
                {
                  type: 'info',
                  title: 'Snippet Store',
                  message: 'A new version is available!',
                  detail:
                    'A new version of SnippetStore is now available, please update to receive the latest bugfixes and features',
                  buttons: ['Update', 'Later']
                },
                response => {
                  if (response === 0) {
                    downloadAndInstall()
                  }
                }
              )
            } else {
              dialog.showMessageBox({
                type: 'info',
                title: 'Snippet Store',
                message: 'No new version',
                detail: "You're now on the latest version of SnippetStore",
                buttons: ['OK']
              })
            }
          })
        }
      }
    ]
  }

  const edit = {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'pasteandmatchstyle' },
      { role: 'delete' },
      { role: 'selectall' }
    ]
  }

  return [file, edit, snippet, help]
}

module.exports = getMenu
