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
    app.addEventListener("ready", () => Eventhandler.onReady());
    app.addEventListener("activate", () => Eventhandler.onActivate());
    app.addEventListener("window-all-closed", () => Eventhandler.onWindowAllClosed());

    ipcMain.addEventListener("determineWindowData", (event) => Eventhandler.onDetermineWindowData(event));
    ipcMain.addEventListener("getSettings", (event) => Eventhandler.onGetSettings(event));
    ipcMain.addEventListener("databaseFilePicker", (event) => Eventhandler.onDatabaseFilePicker(event));
    ipcMain.addEventListener("databaseFolderPicker", (event) => Eventhandler.onDatabaseFolderPicker(event));
    ipcMain.addEventListener("openDatabase", (event, databaseData) => Eventhandler.onOpenDatabase(event, databaseData));
    ipcMain.addEventListener("setAppVersion", (event) => Eventhandler.onSetAppVersion(event));

    ipcMain.addEventListener("logout", (event) => Eventhandler.onLogout(event));
    ipcMain.addEventListener("exit", (event, restart) => Eventhandler.onExit(event, restart));
  }

  static isDev() {
    let start = process.env["npm_lifecycle_script"];
    if (!start) return false;
    let args = start.split("--");
    return args[1].split("=")[1] == "true";
  }
}

class Main {
  static init() {
    App.mainWindow = Main.createWindow();
  }

  static createWindow() {
    let height = 600;
    let width = 800;
    let x = 0;
    let y = 0;
    let maximize = false;

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
        spellcheck: false,
        preload: path.join(__dirname, "preload.js"),
      },
    });

    if (maximize) mainWindow.maximize();
    mainWindow.loadFile("view/main.html");
    mainWindow.once("ready-to-show", () => mainWindow.show());
    mainWindow.webContents.openDevTools();

    if (!App.isDev()) {
      autoUpdater.checkForUpdates(); // also downloads new file

      autoUpdater.addListener("update-available", (info) => mainWindow.webContents.send("update-available"));
      autoUpdater.addListener("update-not-available", (info) => mainWindow.webContents.send("update-not-available"));
      autoUpdater.addListener("download-progress", (info) => mainWindow.webContents.send("prog-made", info));
      autoUpdater.addListener("update-downloaded", (info) => mainWindow.webContents.send("update-downloaded"));
      autoUpdater.addListener("error", (error) => mainWindow.webContents.send("error", error.toString()));
      ipcMain.addEventListener("quitAndInstall", (event, arg) => autoUpdater.quitAndInstall());
    }

    return mainWindow;
  }
}

class Login {
  static init() {
    App.loginWindow = Login.createWindow();
  }

  static createWindow() {
    const loginWindow = new BrowserWindow({
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        spellcheck: false,
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
    loginWindow.once("ready-to-show", () => loginWindow.show());
    loginWindow.webContents.openDevTools();

    return loginWindow;
  }
}

class Eventhandler {
  static onReady() {
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
  }

  static onWindowAllClosed() {
    if (process.platform !== "darwin") app.quit();
  }

  static onActivate() {
    console.log("app-activate");
  }

  static onDetermineWindowData(event) {
    let position = App.mainWindow.getPosition();
    let size = App.mainWindow.getSize();
    event.returnValue = {
      WIDTH: size[0],
      HEIGHT: size[1],
      X: position[0],
      Y: position[1],
    };
  }

  static onGetSettings(event) {
    event.returnValue = { CACHE: Settings.CACHE, DATA: Settings.DATA };
  }

  static onDatabaseFilePicker(event) {
    let result = dialog.showOpenDialogSync({
      properties: ["openFile"],
      filters: [
        { name: "Encrypted Database", extensions: ["edb"] },
        { name: "All Files", extensions: ["*"] },
      ],
    });
    event.returnValue = result;
  }

  static onDatabaseFolderPicker(event) {
    let result = dialog.showOpenDialogSync({
      properties: ["openDirectory"],
    });
    event.returnValue = result;
  }

  static onOpenDatabase(event, databaseData) {
    Settings.CACHE.REMEMBER_DB = databaseData.REMEMBER_DB;
    Settings.CACHE.DATABASE = databaseData.DATABASE;
    Settings.CACHE.REMEMBER_PW = databaseData.REMEMBER_PW;
    Settings.CACHE.PASSWORD = databaseData.PASSWORD;

    Main.init();
    App.loginWindow.close();
  }

  static onSetAppVersion(event) {
    App.mainWindow.setTitle("notie " + app.getVersion());
  }

  static onLogout(event) {
    Login.init();
    App.mainWindow.close();
  }

  static onExit(event, restart) {
    if (restart) app.relaunch();
    app.exit();
  }
}

App.init();
