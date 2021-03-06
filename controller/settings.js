const { app, ipcRenderer } = require("electron");
const File = require("../utils/file.js");

class Settings {
  static DEFAULT_DEC_DB_FILENAME = "notie.db";
  static DEFAULT_ENC_DB_FILENAME = "notie.edb";

  static CACHE = {};
  static CACHE_FOLDER = "./cache/";

  static FILE = "./res/json/settings.json";
  static DATA = {};

  static init() {
    try {
      // Workaround as they have both different base paths
      Settings.DATA = require("." + Settings.FILE);
    } catch (e) {
      File.writeFile(Settings.FILE, JSON.stringify(Settings.DATA));
    }

    Settings.setDefault();
  }

  static registerEvents() {
    document.querySelector("#btnSavePassword").onclick = (event) => Eventhandler.onClickBtnSavePassword(event);
  }

  static setDefault() {
    Settings.CACHE.DEFAULT_FOLDER = app.getPath("userData");

    Settings.CACHE.REMEMBER_DB = false;
    if (Settings.DATA.DATABASE && Settings.DATA.DATABASE.length > 0) {
      Settings.CACHE.REMEMBER_DB = true;
      Settings.CACHE.DATABASE = Settings.DATA.DATABASE;
      Settings.CACHE.DEFAULT_FILE = Settings.DATA.DATABASE;
    }

    Settings.CACHE.REMEMBER_PW = false;
    if (Settings.DATA.PASSWORD && Settings.DATA.PASSWORD.length > 0) {
      Settings.CACHE.REMEMBER_PW = true;
      Settings.CACHE.PASSWORD = Settings.DATA.PASSWORD;
    }
  }

  static save() {
    let startpageId = document.querySelector("#content").dataset.uuid;
    if (startpageId && startpageId != "null") Settings.DATA.STARTPAGE = startpageId;

    Settings.DATA.WINDOW = ipcRenderer.sendSync("determineWindowData");

    // Possible bug in electron if user maximized window: y is -8 which leads
    // - in constrast to the negative x of -8 - to a mispositioned window
    if (Settings.DATA.WINDOW.Y < 0) {
      Settings.DATA.WINDOW.Y = 0;
    }

    if (Settings.CACHE.REMEMBER_DB) {
      Settings.DATA.DATABASE = Settings.ENC_DATABASE;
    } else {
      delete Settings.DATA.DATABASE;
    }

    if (Settings.CACHE.REMEMBER_PW) {
      Settings.DATA.PASSWORD = Settings.CACHE.PASSWORD;
    } else {
      delete Settings.DATA.PASSWORD;
    }

    console.log(Settings.DATA);
    File.writeFile(Settings.FILE, JSON.stringify(Settings.DATA));
  }

  static isSuitablePassword(password) {
    if (password.length >= 8) {
      return true;
    } else {
      return false;
    }
  }
}

class Eventhandler {
  static onClickBtnSavePassword(event) {
    let password = document.querySelector("#password").value;
    if (Settings.isSuitablePassword(password)) {
      Settings.CACHE.PASSWORD = password;
      console.log("User set password to " + Settings.CACHE.PASSWORD + "\n");
    }
  }
}

module.exports = Settings;
