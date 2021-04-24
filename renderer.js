// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
window.$ = window.jQuery = require("jquery");

const IPCRenderer = require("electron").ipcRenderer;

// Utilities
const GeneralJS = require("../utils/general.js");
const CryptoJS = require("../utils/crypto.js");
const FileJS = require("../utils/file.js");

// Controller
const SettingsJS = require("../controller/settings.js");
const DataJS = require("../controller/data.js");
const DatabaseJS = require("../controller/db.js");
const SearchMenuJS = require("../controller/searchmenu.js");
const DocumentJS = require("../controller/document.js");
const PagemenuJS = require("../controller/pagemenu.js");
const BlockmenuJS = require("../controller/blockmenu.js");
const TablemenuJS = require("../controller/tablemenu.js");

// Model
const EnumsJS = require("../model/enums.js");
const PageJS = require("../model/page.js");
const TextlineJS = require("../model/textline.js");
const PlaceholderJS = require("../model/placeholder.js");
const TableJS = require("../model/table.js");

class Renderer {
  static init() {
    PageJS.Page.load($("#dashboardPage"));
    TextlineJS.Textline.build($("#content"), "");
    PlaceholderJS.Placeholder.registerEvents($("#placeholder"));

    DatabaseJS.init();

    PagemenuJS.Pagemenu.registerEvents();
    BlockmenuJS.Blockmenu.registerEvents();
    SearchMenuJS.registerEvents();
    DocumentJS.registerEvents();

    Renderer.registerEvents();
  }

  static registerEvents() {
    $("#newPage").on("click", function (event) {
      let pagename = CryptoJS.generateUUID();
      FileJS.create("./cache/" + pagename + ".html", "");
      PageJS.Page.create("", pagename);
      return false;
    });

    // Load content based on user-data
    $("#btnLoad").on("click", function (event) {
      Eventhandler.onClickBtnLoad(event);
    });

    // Save data entered by user
    $("#btnSave").on("click", function (event) {
      Eventhandler.onClickBtnSave(event);
    });

    // Restart application
    $("#btnRestart").on("click", function (event) {
      Eventhandler.onClickBtnRestart(event);
    });
  }
}

class Eventhandler {
  static onClickBtnLoad(event) {
    DataJS.load();
    TextlineJS.Textline.build($("#content"), "");
  }

  static onClickBtnSave(event) {
    let jsonData = DataJS.save();
    let data = CryptoJS.IV.toString();
    data += CryptoJS.encrypt(jsonData, CryptoJS.PASSWORD, CryptoJS.IV);
    FileJS.create("data.enc", data);
  }

  static onClickBtnRestart(event) {
    IPCRenderer.send("restart");
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
