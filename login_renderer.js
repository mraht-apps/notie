window.$ = window.jQuery = require("jquery");
const IPCRenderer = require("electron").ipcRenderer;

const Enums = require("../model/enums.js");
const General = require("../utils/general.js");
const Settings = require("../controller/settings.js");
const File = require("../utils/file.js");

class Renderer {
  static init() {
    Renderer.registerEvents();

    let settings = IPCRenderer.sendSync("getSettings");
    Settings.CACHE = settings.CACHE;
    Settings.DATA = settings.DATA;

    if (Settings.CACHE.REMEMBER_DB) {
      document.querySelector("#rememberDatabase").checked = true;
    }
    if (Settings.CACHE.REMEMBER_PW) {
      document.querySelector("#rememberPassword").checked = true;
    }

    if (Settings.DATA.PASSWORD) {
      document.querySelector("#password").value = Settings.DATA.PASSWORD;
    }

    if (Settings.DATA.DATABASE && Settings.DATA.DATABASE.length > 0) {
      document.querySelector("#openDatabase").dispatchEvent(new Event("click"));
    } else {
      document.querySelector("#createDatabase").dispatchEvent(new Event("click"));
    }
  }

  static registerEvents() {
    document.querySelector("#createDatabase").onclick = (event) => Eventhandler.onClickCreateDatabase(event);
    document.querySelector("#openDatabase").onclick = (event) => Eventhandler.onClickOpenDatabase(event);
    document.querySelector("#database").onchange = (event) => Eventhandler.onChangeDatabase(event);
    document.querySelector("#btnDatabasePicker").onclick = (event) => Eventhandler.onClickBtnDatabasePicker(event);
    document.querySelector("#password").onkeyup = (event) => Eventhandler.onKeyupPassword(event);
    document.querySelector("#btnPasswordVisibility").onclick = (event) =>
      Eventhandler.onClickBtnPasswordVisibility(event);
    document.querySelector("#btnExit").onclick = (event) => Eventhandler.onClickBtnExit(event);
    document.querySelector("#btnLogin").onclick = (event) => Eventhandler.onClickBtnLogin(event);
  }
}

class Eventhandler {
  static onClickCreateDatabase(event) {
    document.querySelector("#createDatabase").classList.add("active");
    document.querySelector("#openDatabase").classList.remove("active");

    document.querySelector(".firstLabel").textContent = "Database folder:";
    document.querySelector("#btnDatabasePicker").title = "Choose a database folder";

    document.querySelector("#database").title = "Choose a database folder";
    document.querySelector("#database").value = Settings.CACHE.DEFAULT_FOLDER;
    document.querySelector("#database").dispatchEvent(new Event("change"));

    if (
      document.querySelector("#database").value == "" ||
      document.querySelector("#database").classList.contains("error")
    ) {
      General.focus(document.querySelector("#database"));
    } else {
      General.focus(document.querySelector("#password"));
    }
  }

  static onClickOpenDatabase(event) {
    document.querySelector("#openDatabase").classList.add("active");
    document.querySelector("#createDatabase").classList.remove("active");

    document.querySelector(".firstLabel").textContent = "Database file:";
    document.querySelector("#btnDatabasePicker").title = "Choose a database file";

    document.querySelector("#database").title = "Choose a database file";

    if (Settings.CACHE.DEFAULT_FILE && Settings.CACHE.DEFAULT_FILE.length > 0) {
      document.querySelector("#database").value = Settings.CACHE.DEFAULT_FILE;
      document.querySelector("#database").dispatchEvent(new Event("change"));
    } else {
      document.querySelector("#database").value = "";
      document.querySelector("#database").dispatchEvent(new Event("change"));
    }

    if (
      document.querySelector("#database").value == "" ||
      document.querySelector("#database").classList.contains("error")
    ) {
      General.focus(document.querySelector("#database"));
    } else {
      General.focus(document.querySelector("#password"));
    }
  }

  static onChangeDatabase(event) {
    let database = event.target;
    if (File.exists(database.value)) {
      database.classList.remove("error");
    } else if (!database.classList.contains("error")) {
      database.classList.add("error");
    }
  }

  static onClickBtnDatabasePicker(event) {
    let result = null;
    if (document.querySelector("#openDatabase").classList.contains("active")) {
      result = IPCRenderer.sendSync("databaseFilePicker");
    } else {
      result = IPCRenderer.sendSync("databaseFolderPicker");
    }
    if (!result || result.length == 0 || result[0].trim().length == 0) return;
    document.querySelector("#database").value = result[0];
    document.querySelector("#database").dispatchEvent(new Event("change"));
    General.focus(document.querySelector("#password"));
  }

  static onKeyupPassword(event) {
    if (
      document.querySelector("#password").classList.contains("error") &&
      Settings.isSuitablePassword(document.querySelector("#password").value)
    ) {
      document.querySelector("#password").classList.remove("error");
    }
  }

  static onClickBtnPasswordVisibility(event) {
    let passwordInput = document.querySelector("#password");
    let passwordImg = document.querySelector("#imgHideShowPassword");
    if (passwordInput.type == "password") {
      passwordInput.type = "text";
      passwordImg.src = "../res/img/hide.svg";
    } else {
      passwordInput.type = "password";
      passwordImg.src = "../res/img/show.svg";
    }
    General.focus(passwordInput);
  }

  static onClickBtnExit() {
    IPCRenderer.send("exit", false);
  }

  static onClickBtnLogin() {
    let database = document.querySelector("#database").value;
    let password = document.querySelector("#password").value;

    if (document.querySelector("#openDatabase").classList.contains("active") && !File.exists(database)) {
      document.querySelector("#database").classList.add("error");
      General.focus(document.querySelector("#database"));
      return;
    } else if (!File.exists(database)) {
      document.querySelector("#database").classList.add("error");
      General.focus(document.querySelector("#database"));
      return;
    }

    if (password.length < 8) {
      document.querySelector("#password").classList.add("error");
      General.focus(document.querySelector("#password"));
      return;
    }

    IPCRenderer.send("openDatabase", {
      REMEMBER_DB: document.querySelector("#rememberDatabase").checked,
      DATABASE: document.querySelector("#database").value,
      REMEMBER_PW: document.querySelector("#rememberPassword").checked,
      PASSWORD: document.querySelector("#password").value,
    });
  }
}

Renderer.init();
