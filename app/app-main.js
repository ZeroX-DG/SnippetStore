const createWindow = require('./app-window.js')
const { app } = require('electron')

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
