const { app, dialog, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile("view/main.html");
  mainWindow.webContents.openDevTools();
  mainWindow.maximize();

  return mainWindow;
}

var mainWindow = null;

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", function () {
  mainWindow = createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  mainWindow.on("close", function (event) {
    console.log("Closing window...");
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on("submitForm", function (event, pagename) {
  // Access form data here
  console.log("Handle submitForm with pagename " + pagename + "\n");
  event.sender.send("actionReply", pagename);
});

ipcMain.on("restart", function (event) {
  app.relaunch();
  app.exit();
});

ipcMain.on("onClickDataFolderPicker", function (event) {
  let result = dialog.showOpenDialogSync({
    properties: ["openDirectory"],
  });
  event.returnValue = result;
});

ipcMain.on("determineUserDataFolder", function (event) {
  event.returnValue = app.getPath("userData");
});

ipcMain.on("resizeWindow", function (event, width, height) {
  // FIX size is not being set
  mainWindow.setSize(width, height);
});
