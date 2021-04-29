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
const Database = require("../controller/database/database.js");
const Document = require("../controller/document.js");

const Searchmenu = require("../controller/menu/searchmenu.js");
const Pagemenu = require("../controller/menu/pagemenu.js");
const Blockmenu = require("../controller/menu/blockmenu.js");
const Tablemenu = require("../controller/menu/tablemenu.js");

// Model
const Enums = require("../model/enums.js");
const Page = require("../model/page.js");
const Textline = require("../model/textline.js");
const Placeholder = require("../model/placeholder.js");
const Table = require("../model/table.js");

class Renderer {
  static init() {
    ipcRenderer.send("setAppVersion");

    Renderer.registerEvents();

    // FIX Encrypted file isn't being created
    // FIX Encrypted file is being created in wrong folder
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

    Database.init();

    // Page.firstRun();

    // Pagemenu.init();
    // Blockmenu.init();
    // Searchmenu.init();
    // Document.init();
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

    window.onbeforeunload = function (event) {
      event.preventDefault();

      Database.close();
      Settings.save();
    };

    $("#btnUpdateApp").on("click", function (event) {
      ipcRenderer.send("quitAndInstall");
    });

    $("#btnTest").on("click", function (event) {});

    $("#btnRestart").on("click", function (event) {
      Eventhandler.onClickBtnRestart(event);
    });

    $("#btnExit").on("click", function (event) {
      console.log("login onclick exit");
      Eventhandler.onClickBtnExit(event);
    });
  }
}

class Eventhandler {
  static onClickBtnExit() {
    ipcRenderer.send("exit", false);
  }

  static onClickBtnRestart(event) {
    ipcRenderer.send("exit", true);
  }
}

Renderer.init();

// DEBUG Test table build
// const Table = require("./model/table.js");
// Table.build($("#content"), {
//   caption: "Untitled",
//   columns: [
//     { name: "Name", type: "text", width: "120px" },
//     { name: "Tags", type: "checkbox", width: "20px" },
//     { name: "Status", type: "text", width: "120px" },
//   ],
//   rows: [
//     {
//       Name: "Hallo Welt 1",
//       Tags: true,
//       Status: "Offen und in Bearbeitung",
//     },
//     {
//       Name: "Hallo Welt 2",
//       Tags: false,
//       Status: "Geschlossen und abgeschlossen",
//     },
//   ],
// });
