const { app, dialog, BrowserWindow, ipcMain } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");

const File = require("./utils/file.js");
const Settings = require("./controller/settings.js");

class App {
  static loginWindow;
  static mainWindow;
  static databaseData;

  static init() {
    // This method will be called when Electron has finished initialization and is ready
    // to create browser windows. Some APIs can only be used after this event occurs.
    app.on("ready", function () {
      Settings.init();

      if (
        Settings.DATA.DATABASE &&
        File.exists(Settings.DATA.DATABASE) &&
        Settings.DATA.PASSWORD &&
        Settings.DATA.PASSWORD.length > 0
      ) {
        Main.init();
      } else {
        Login.init();
      }
    });

    ipcMain.on("determineUserDataFolder", function (event) {
      event.returnValue = app.getPath("userData");
    });

    ipcMain.on("determineWindowData", function (event) {
      let position = App.mainWindow.getPosition();
      let size = App.mainWindow.getSize();
      event.returnValue = {
        WIDTH: size[0],
        HEIGHT: size[1],
        X: position[0],
        Y: position[1],
      };
    });

    ipcMain.on("getSettings", function (event) {
      event.returnValue = { CACHE: Settings.CACHE, DATA: Settings.DATA };
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
      Settings.CACHE.REMEMBER_DB = databaseData.REMEMBER_DB;
      Settings.CACHE.DATABASE = databaseData.DATABASE;
      Settings.CACHE.REMEMBER_PW = databaseData.REMEMBER_PW;
      Settings.CACHE.PASSWORD = databaseData.PASSWORD;

      Main.init();
      App.loginWindow.close();
    });

    ipcMain.on("setAppVersion", (event) => {
      App.mainWindow.setTitle("notie " + app.getVersion());
    });

    // Quit when all windows are closed, except on macOS. There, it's common
    // for applications and their menu bar to stay active until the user quits
    // explicitly with Cmd + Q.
    app.on("window-all-closed", function () {
      if (process.platform !== "darwin") app.quit();
    });

    ipcMain.on("logout", function(event) {
      Login.init();
      App.mainWindow.close();
    });

    ipcMain.on("exit", function (event, restart) {
      if (restart) app.relaunch();
      app.exit();
    });
  }

  static isDev() {
    let start = process.env["npm_package_scripts_start"];
    if (!start) return false;
    let args = start.split("--");
    return args[1].split("=")[1] == "true";
  }
}

class Main {
  static init() {
    App.mainWindow = Main.createWindow();

    app.on("activate", function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

    App.mainWindow.on("close", function (event) {
      console.log("Closing main window...");
    });
  }

  static createWindow() {
    var height = 600;
    var width = 800;
    var x = 0;
    var y = 0;
    var maximize = false;

    if (!Settings.DATA.WINDOW) {
      maximize = true;
    } else {
      if (Settings.DATA.WINDOW.HEIGHT) height = Settings.DATA.WINDOW.HEIGHT;
      if (Settings.DATA.WINDOW.WIDTH) width = Settings.DATA.WINDOW.WIDTH;
      if (Settings.DATA.WINDOW.X) x = Settings.DATA.WINDOW.X;
      if (Settings.DATA.WINDOW.Y) y = Settings.DATA.WINDOW.Y;
    }

    const mainWindow = new BrowserWindow({
      height: height,
      width: width,
      x: x,
      y: y,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        preload: path.join(__dirname, "preload.js"),
      },
    });

    if (maximize) mainWindow.maximize();

    mainWindow.loadFile("view/main.html");
    mainWindow.once("ready-to-show", function () {
      mainWindow.show();
    });

    mainWindow.webContents.openDevTools();

    if (!App.isDev()) {
      // Let autoUpdater check for updates, it will start downloading it automatically
      autoUpdater.checkForUpdates();

      // Catch the update-available event
      autoUpdater.addListener("update-available", (info) => {
        mainWindow.webContents.send("update-available");
      });

      // Catch the update-not-available event
      autoUpdater.addListener("update-not-available", (info) => {
        mainWindow.webContents.send("update-not-available");
      });

      // Catch the download-progress events
      autoUpdater.addListener("download-progress", (info) => {
        mainWindow.webContents.send("prog-made", info);
      });

      // Catch the update-downloaded event
      autoUpdater.addListener("update-downloaded", (info) => {
        mainWindow.webContents.send("update-downloaded");
      });

      // Catch the error events
      autoUpdater.addListener("error", (error) => {
        mainWindow.webContents.send("error", error.toString());
      });

      ipcMain.on("quitAndInstall", (event, arg) => {
        autoUpdater.quitAndInstall();
      });
    }

    return mainWindow;
  }
}

class Login {
  static init() {
    App.loginWindow = Login.createWindow();

    app.on("activate", function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) Login.createWindow();
    });

    App.loginWindow.on("close", function (event) {
      console.log("Closing login window...");
    });
  }

  static createWindow() {
    const loginWindow = new BrowserWindow({
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
      width: 550,
      height: 286,
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

    loginWindow.webContents.openDevTools();

    return loginWindow;
  }
}

App.init();
