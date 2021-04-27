class Settings {
  static CACHE_FOLDER = "../cache/";
  static DEFAULT_DATA_FOLDER = "";
  static DATA_FOLDER = "";
  static FILE = "settings.json";
  static DATA = {};

  static init() {
    Settings.determineUserDataFolder();

    try {
      let configData = File.readFile(Settings.getFilePath());
      Settings.DATA = JSON.parse(configData);
    } catch (e) {
      File.writeFile(Settings.getFilePath(), JSON.stringify(Settings.DATA));
    }

    Settings.resizeWindow();
  }

  static registerEvents() {
    $("#btnSavePassword").on("click", function (event) {
      Eventhandler.onClickBtnSavePassword(event);
    });

    $("#btnSetPassword").on("click", function (event) {
      Eventhandler.onClickBtnSetPassword(event);
    });

    $("#btnReadPassword").on("click", function (event) {
      Eventhandler.onClickBtnReadPassword(event);
    });

    $("#dataFolderPicker").on("click", function (event) {
      let result = IPCRenderer.sendSync("onClickDataFolderPicker");
      if (result && result.length > 0 && result[0].trim().length > 0) {
        Settings.DATA_FOLDER = result[0];
      } else {
        Settings.DATA_FOLDER = Settings.DEFAULT_DATA_FOLDER;
      }
      console.log(`Set data folder to: ${Settings.DATA_FOLDER}`);
      event.preventDefault();
    });
  }

  static determineUserDataFolder() {
    let result = IPCRenderer.sendSync("determineUserDataFolder");
    Settings.DATA_FOLDER = result;
    Settings.DEFAULT_DATA_FOLDER = result;
    console.log("Set settings folder to: " + result);
  }

  static getFilePath() {
    return Settings.DATA_FOLDER + "/" + Settings.FILE;
  }

  static resizeWindow() {
    let width = Settings.DATA.width;
    let height = Settings.DATA.height;
    if (width > 0 && height > 0) {
      console.log("Set window size to: " + width + "/" + height);
      IPCRenderer.send("resizeWindow", width, height);
    }
  }

  static save() {
    // NEW Remove folder CACHE
    Settings.DATA.height = $(window).height();
    Settings.DATA.width = $(window).width();
    File.writeFile(Settings.getFilePath(), JSON.stringify(Settings.DATA));
  }

  static set(key, val) {
    Config.DATA[key] = val;
  }
}

class Eventhandler {
  static onClickBtnSavePassword(event) {
    const password = $("#password").val();
    Crypto.PW = password;
    console.log("User set password to " + Crypto.PW + "\n");
  }

  static onClickBtnSetPassword(event) {
    const password = $("#password").val();
    Crypto.PW = password;
    console.log("User set password to " + Crypto.PW + "\n");
  }

  static onClickBtnReadPassword(event) {
    console.log("User set password to " + Crypto.PW + "\n");
    console.log("User set iv to " + Crypto.IV + "\n");
  }
}

module.exports = Settings;
