// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
window.$ = window.jQuery = require("jquery");
const IPCRenderer = require("electron").ipcRenderer;
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
    Renderer.registerEvents();
    let settings = IPCRenderer.sendSync("getSettings");
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
    window.onbeforeunload = function (event) {
      event.preventDefault();

      Database.close();
      Settings.save();
    };

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
    IPCRenderer.send("exit", false);
  }

  static onClickBtnRestart(event) {
    IPCRenderer.send("exit", true);
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
