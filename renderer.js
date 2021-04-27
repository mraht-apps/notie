// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
window.$ = window.jQuery = require("jquery");

const IPCRenderer = require("electron").ipcRenderer;

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
    Settings.init();

    Page.firstRun();

    Database.init();

    Pagemenu.init();
    Blockmenu.init();
    Searchmenu.init();
    Document.init();

    Renderer.registerEvents();
  }

  static registerEvents() {
    window.onbeforeunload = function (event) {
      event.preventDefault();
      console.log("Before unloading window...");

      Database.close();
      Settings.save();
    };

    $("#btnTest").on("click", function (event) {
      IPCRenderer.send("onClickDataFolderPicker");
      console.log(Settings.DATA_FOLDER);
    });

    // Restart application
    $("#btnRestart").on("click", function (event) {
      Eventhandler.onClickBtnRestart(event);
    });
  }
}

class Eventhandler {
  // static onClickBtnLoad(event) {
  //   DataJS.load();
  //   Textline.build($("#content"), "");
  // }

  // static onClickBtnSave(event) {
  //   let jsonData = DataJS.save();
  //   let data = Crypto.IV.toString();
  //   data += Crypto.encrypt(jsonData, Crypto.PW, Crypto.IV);
  //   File.writeFile("data.enc", data);
  // }

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
