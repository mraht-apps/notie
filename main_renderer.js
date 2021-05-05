// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
window.$ = window.jQuery = require("jquery");
const ipcRenderer = require("electron").ipcRenderer;
const Filepath = require("path");

// Utilities
const General = require("../utils/general.js");
const Crypto = require("../utils/crypto.js");
const File = require("../utils/file.js");

// Controller
const Settings = require("../controller/settings.js");
const Document = require("../controller/document.js");
const Navigation = require("../controller/navigation.js");

const Searchmenu = require("../controller/menu/searchmenu.js");
const Navbarmenu = require("../controller/menu/navbarmenu.js");
const Blockmenu = require("../controller/menu/blockmenu.js");
const Tablemenu = require("../controller/menu/tablemenu.js");

// Database
const Database = require("../controller/database/database.js");
const Page_DB = require("../controller/database/page_db.js");
const Table_DB = require("../controller/database/table_db.js");
const Textline_DB = require("../controller/database/textline_db.js");

// Model
const Enums = require("../model/enums.js");
const Navbar = require("../model/navbar.js");
const Page = require("../model/page.js");
const Textline = require("../model/textline.js");
const Placeholder = require("../model/placeholder.js");
const Table = require("../model/table.js");

class Renderer {
  static init() {
    ipcRenderer.send("setAppVersion");

    Renderer.registerEvents();

    let settings = ipcRenderer.sendSync("getSettings");
    Settings.CACHE = settings.CACHE;
    Settings.DATA = settings.DATA;

    if (File.isDir(Settings.CACHE.DATABASE)) {
      Settings.ENC_DATABASE = Filepath.join(
        Settings.CACHE.DATABASE,
        Settings.DEFAULT_ENC_DB_FILENAME
      );
      Settings.DEC_DATABASE = Filepath.join(
        Settings.CACHE_FOLDER,
        Settings.DEFAULT_DEC_DB_FILENAME
      );
    } else {
      Settings.ENC_DATABASE = Settings.CACHE.DATABASE;
      Settings.DEC_DATABASE =
        Filepath.join(
          Settings.CACHE_FOLDER,
          Filepath.parse(Settings.CACHE.DATABASE).name
        ) + ".db";
    }

    console.log("ENC_DATABASE: " + Settings.ENC_DATABASE);
    console.log("DEC_DATABASE: " + Settings.DEC_DATABASE);
    console.log(Settings.CACHE);
    console.log(Settings.DATA);

    Database.init();

    Navbar.init();
    Page.init();

    Document.init();
    Blockmenu.init();
    Navbarmenu.init();
    Tablemenu.init();

    // Searchmenu.init();
  }

  static registerEvents() {
    ipcRenderer.on("update-downloaded", function (event, text) {
      console.log("update-downloaded");
      var container = document.getElementById("btnUpdateApp");
      container.removeAttribute("disabled");
    });
    ipcRenderer.on("update-available", function (event, text) {
      console.log("update-available");
    });
    ipcRenderer.on("error", function (event, text) {
      console.log("error", text);
    });
    ipcRenderer.on("prog-made", function (event, text) {
      console.log("prog-made");
      console.log(text);
    });
    ipcRenderer.on("update-not-available", function (event, text) {
      console.log("update-not-available");
    });

    $(window).on("beforeunload", function (event) {
      try {
        event.preventDefault();

        Page.saveCurrentContent();
      } catch (e) {}

      try {
        Database.close();
      } catch (e) {}

      try {
        Settings.save();
      } catch (e) {}
    });

    $("#btnUpdateApp").on("click", function (event) {
      ipcRenderer.send("quitAndInstall");
    });

    $("#btnTest").on("click", function (event) {});

    $("#btnLogout").on("click", function (event) {
      Eventhandler.onClickBtnLogout(event);
    });

    $("#btnRestart").on("click", function (event) {
      Eventhandler.onClickBtnRestart(event);
    });
  }
}

class Eventhandler {
  static onClickBtnLogout(event) {
    $(window).trigger("beforeunload");
    ipcRenderer.send("logout");
  }

  static onClickBtnRestart(event) {
    $(window).trigger("beforeunload");
    ipcRenderer.send("exit", true);
  }
}

Renderer.init();
