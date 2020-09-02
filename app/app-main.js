const { app, Menu, ipcMain } = require("electron");

let mainWindow = null;

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", (event, commandLine, workingDirectory) => {
    if (mainWindow) {
      if (process.platform === "win32") {
        mainWindow.minimize();
        mainWindow.restore();
      }
      mainWindow.show();
      mainWindow.focus();
    }
  });

  app.on("ready", () => {
    mainWindow = require("./app-window")(app);
    require("./app-tray")(app, mainWindow);
    ipcMain.on("bringToFront", () => {
      if (process.platform === "win32") {
        mainWindow.minimize();
        mainWindow.restore();
      }
      mainWindow.show();
      mainWindow.focus();
    });
    const template = require("./app-menu")(app, mainWindow);
    const menu = Menu.buildFromTemplate(template);
    switch (process.platform) {
      case "darwin":
        Menu.setApplicationMenu(menu);
        break;
      case "win32":
        mainWindow.setMenu(menu);
        break;
      case "linux":
        Menu.setApplicationMenu(menu);
        mainWindow.setMenu(menu);
        break;
    }
  });

  app.on("before-quit", () => {
    mainWindow.shouldQuit();
  });
}
