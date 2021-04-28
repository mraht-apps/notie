const { app, dialog, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

const Settings = require("./controller/settings.js");

let mainWindow = null;
let loginWindow = null;

class Main {
  static init() {
    mainWindow = Main.createWindow();

    app.on("activate", function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

    mainWindow.on("close", function (event) {
      console.log("Closing main window...");
    });
  }

  static createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        preload: path.join(__dirname, "preload.js"),
      },
    });

    mainWindow.loadFile("view/main.html");
    mainWindow.once("ready-to-show", function () {
      mainWindow.show();
    });

    mainWindow.webContents.openDevTools();

    return mainWindow;
  }
}

class Login {
  static init() {
    loginWindow = Login.createWindow();

    app.on("activate", function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) Login.createWindow();
    });

    loginWindow.on("close", function (event) {
      console.log("Closing login window...");
    });
  }

  static createWindow() {
    loginWindow = new BrowserWindow({
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
      width: 550,
      height: 286,
      parent: mainWindow,
      // modal: true,
      show: false,
      minimizable: false,
      resizable: false,
      maximizable: false,
      autoHideMenuBar: true,
    });
    loginWindow.loadFile("view/login.html");

    loginWindow.once("ready-to-show", function () {
      loginWindow.show();
    });

    // loginWindow.webContents.openDevTools();

    return loginWindow;
  }
}

class App {
  static databaseData;

  static init() {
    // This method will be called when Electron has finished initialization and is ready
    // to create browser windows. Some APIs can only be used after this event occurs.
    app.on("ready", function () {
      Settings.init();

      // TODO Check if valid database supplied
      if (Settings.DATA.PW && Settings.DATA.PW.length > 0) {
        Main.init();
      } else {
        Login.init();
      }
    });

    ipcMain.on("determineUserDataFolder", function (event) {
      event.returnValue = app.getPath("userData");
    });

    ipcMain.on("determineWindowData", function (event) {
      let position = mainWindow.getPosition();
      let size = mainWindow.getSize();
      event.returnValue = {
        width: size[0],
        height: size[1],
        x: position[0],
        y: position[1],
      };
    });

    ipcMain.on("getSettings", function (event) {
      event.returnValue = Settings.DATA;
    });

    ipcMain.on("databaseFilePicker", function (event) {
      let result = dialog.showOpenDialogSync({
        properties: ["openFile"],
        filters: [
          { name: "Encrypted Database", extensions: ["edb"] },
          { name: "All Files", extensions: ["*"] },
        ],
      });
      event.returnValue = result;
    });

    ipcMain.on("databaseFolderPicker", function (event) {
      let result = dialog.showOpenDialogSync({
        properties: ["openDirectory"],
      });
      event.returnValue = result;
    });

    ipcMain.on("openDatabase", function (event, databaseData) {
      App.databaseData = databaseData;
      Main.init();
      loginWindow.close();
    });

    ipcMain.on("getDatabaseData", function (event) {
      event.returnValue = App.databaseData;
    });

    ipcMain.on("resizeWindow", function (event, windowData) {
      if (!windowData) {
        mainWindow.maximize();
      } else {
        mainWindow.setSize(windowData.width, windowData.height);
        mainWindow.setPosition(windowData.x, windowData.y);
      }
    });

    // Quit when all windows are closed, except on macOS. There, it's common
    // for applications and their menu bar to stay active until the user quits
    // explicitly with Cmd + Q.
    app.on("window-all-closed", function () {
      if (process.platform !== "darwin") app.quit();
    });

    ipcMain.on("exit", function (event, restart) {
      if (restart) app.relaunch();
      app.exit();
    });
  }
}

App.init();
