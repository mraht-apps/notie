const { app, ipcRenderer } = require("electron");

const File = require("../utils/file.js");
const Crypto = require("../utils/crypto.js");

class Settings {
  static CACHE_FOLDER = "./cache/";
  static FILE = "settings.json";
  static DATA = {};

  static init() {
    try {
      let configData = File.readFile(Settings.FILE);
      Settings.DATA = JSON.parse(configData);
    } catch (e) {
      File.writeFile(Settings.FILE, JSON.stringify(Settings.DATA));
    }

    Settings.determineUserDataFolder();
  }

  static registerEvents() {
    $("#btnSavePassword").on("click", function (event) {
      Eventhandler.onClickBtnSavePassword(event);
    });

    $("#btnLogin").on("click", function (event) {
      Eventhandler.onClickBtnLogin(event);
    });

    $("#btnDatabasePicker").on("click", function (event) {
      let result = ipcRenderer.sendSync("onClickbtnDataFolderPicker");
      if (result && result.length > 0 && result[0].trim().length > 0) {
        Settings.DATA.FOLDER = result[0];
      } else {
        Settings.DATA.FOLDER = Settings.DATA.DEFAULT_FOLDER;
      }
      console.log(`Set data folder to: ${Settings.DATA.FOLDER}`);
      event.preventDefault();
    });
  }

  static determineUserDataFolder() {
    let result = app.getPath("userData");
    Settings.DATA.FOLDER = result;
    Settings.DATA.DEFAULT_FOLDER = result;
    console.log("Set settings folder to: " + result);
  }

  static resizeWindow() {
    ipcRenderer.send("resizeWindow", Settings.DATA.window);
  }

  static save() {
    Settings.clearCache();
    Settings.saveSettings();
  }

  static clearCache() {
    try {
      const path = require("path");
      let files = File.readFolder(Settings.CACHE_FOLDER);
      for (const file in files) {
        File.removeFile(
          path.join(Settings.CACHE_FOLDER, files[file]),
          function (error) {
            if (error) throw error;
          }
        );
      }
    } catch (e) {}
  }

  static saveSettings() {
    Settings.DATA.window = ipcRenderer.sendSync("determineWindowData");

    // Possible bug in electron if user maximized window: y is -8 which leads
    // - in constrast to the negative x of -8 - to a mispositioned window
    if (Settings.DATA.window.y < 0) {
      Settings.DATA.window.y = 0;
    }
    console.log("Save settings data: " + Settings.DATA);
    File.writeFile(Settings.FILE, JSON.stringify(Settings.DATA));
  }

  static set(key, val) {
    Config.DATA[key] = val;
  }
}

class Eventhandler {
  static onClickBtnLogin(event) {
    const password = $("#password").val();
    Crypto.PW = password;
    console.log("User set password to " + Crypto.PW + "\n");
  }
}

module.exports = Settings;
