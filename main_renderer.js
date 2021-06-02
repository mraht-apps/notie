// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
window.$ = window.jQuery = require("jquery");
const electron = require("electron");
const ipcRenderer = require("electron").ipcRenderer;
const Filepath = require("path");

// Utilities
const DOM = require("../utils/dom.js");
const General = require("../utils/general.js");
const Crypto = require("../utils/crypto.js");
const File = require("../utils/file.js");

// Controller
const Settings = require("../controller/settings.js");
const Document = require("../controller/document.js");
const Navigation = require("../controller/navigation.js");

const SearchMenu = require("../controller/menu/tableSearchMenu.js");
const NavbarMenu = require("../controller/menu/navbarMenu.js");
const BlockMenu = require("../controller/menu/blockMenu.js");
const TableMenu = require("../controller/menu/tableMenu.js");
const ColumnMenu = require("../controller/menu/columnMenu.js");
const ColumnTypeMenu = require("../controller/menu/columnTypeMenu.js");
const NumberFormatMenu = require("../controller/menu/numberFormatMenu.js");
const TableSearchMenu = require("../controller/menu/tableSearchMenu.js");

// Database
const Database = require("../controller/database/database.js");
const Image_DB = require("../controller/database/image_db.js");
const Page_DB = require("../controller/database/page_db.js");
const Table_DB = require("../controller/database/table_db.js");
const Textline_DB = require("../controller/database/textline_db.js");

// Model
const Enums = require("../model/enums.js");
const Blockelement = require("../model/blockelement.js");
const Image = require("../model/image.js");
const Navbar = require("../model/navbar.js");
const Page = require("../model/page.js");
const Textline = require("../model/textline.js");
const Placeholder = require("../model/placeholder.js");
const Table = require("../model/table.js");

class Renderer {
  static init() {
    DOM.enhanceMethods();

    ipcRenderer.send("setAppVersion");

    Renderer.registerEvents();

    let settings = ipcRenderer.sendSync("getSettings");
    Settings.CACHE = settings.CACHE;
    Settings.DATA = settings.DATA;

    if (File.isDir(Settings.CACHE.DATABASE)) {
      Settings.ENC_DATABASE = Filepath.join(Settings.CACHE.DATABASE, Settings.DEFAULT_ENC_DB_FILENAME);
      Settings.DEC_DATABASE = Filepath.join(Settings.CACHE_FOLDER, Settings.DEFAULT_DEC_DB_FILENAME);
    } else {
      Settings.ENC_DATABASE = Settings.CACHE.DATABASE;
      Settings.DEC_DATABASE =
        Filepath.join(Settings.CACHE_FOLDER, Filepath.parse(Settings.CACHE.DATABASE).name) + ".db";
    }

    console.log("ENC_DATABASE: " + Settings.ENC_DATABASE);
    console.log("DEC_DATABASE: " + Settings.DEC_DATABASE);
    console.log(Settings.CACHE);
    console.log(Settings.DATA);

    Database.init();

    Navbar.init();
    Page.init();

    Document.init();

    BlockMenu.init();
    ColumnMenu.init();
    NavbarMenu.init();
    SearchMenu.init();
    TableMenu.init();
  }

  static registerEvents() {
    ipcRenderer.onerror = (event, text) => Eventhandler.onError(event, text);
    ipcRenderer.onupdateAvailable = (event) => Eventhandler.onUpdateAvailable(event);
    ipcRenderer.onupdateNotAvailable = (event) => Eventhandler.onUpdateNotAvailable(event);
    ipcRenderer.onUpdateDownloaded = (event) => Eventhandler.onUpdateDownloaded(event);
    ipcRenderer.onProgMade = (event, text) => Eventhandler.onProgMade(event, text);

    window.onbeforeunload = (event) => Eventhandler.onBeforeUnloadWindow(event);

    document.querySelector("#btnUpdateApp").onclick = (event) => Eventhandler.onClickBtnUpdateApp(event);
    document.querySelector("#btnTest").addEventListener("click", (event) => Eventhandler.onClickBtnTest(event));
    document.querySelector("#btnLogout").addEventListener("click", (event) => Eventhandler.onClickBtnLogout(event));
    document.querySelector("#btnRestart").addEventListener("click", (event) => Eventhandler.onClickBtnRestart(event));
  }
}

class Eventhandler {
  static onError(event, text) {
    console.log("error", text);
  }

  static onUpdateAvailable(event) {
    console.log("update-available");
  }

  static onUpdateNotAvailable(event) {
    console.log("update-not-available");
  }

  static onUpdateDownloaded(event) {
    console.log("update-downloaded");
    document.getElementById("btnUpdateApp").removeAttribute("disabled");
  }

  static onProgMade(event, text) {
    console.log("prog-made");
    console.log(text);
  }

  static onBeforeUnloadWindow(event) {
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
  }

  static onClickBtnUpdateApp(event) {
    ipcRenderer.send("quitAndInstall");
  }

  static onClickBtnTest(event) {}

  static onClickBtnLogout(event) {
    window.dispatchEvent(new Event("beforeunload"));
    ipcRenderer.send("logout");
  }

  static onClickBtnRestart(event) {
    window.dispatchEvent(new Event("beforeunload"));
    ipcRenderer.send("exit", true);
  }
}

Renderer.init();
