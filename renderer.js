// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
window.$ = window.jQuery = require("jquery");

const IPCRenderer = require("electron").ipcRenderer;

// Utilities
const CryptoJS = require("./utils/cryptography.js");
const FileJS = require("./utils/file.js");

// Controller
const DataJS = require("./controller/data.js");
const SearchMenuJS = require("./controller/searchmenu.js");
const DocumentJS = require("./controller/document.js");
const BlockmenuJS = require("./controller/blockmenu.js");
const TablemenuJS = require("./controller/tablemenu.js");

// Model
const PageJS = require("./model/page.js");
const TextlineJS = require("./model/textline.js");
const PlaceholderJS = require("./model/placeholder.js");
const TableJS = require("./model/table.js");

TextlineJS.build($("#pageContent"), "");

// DEBUG Test table build
// const Table = require("./model/table.js");
// Table.build($("#pageContent"), {
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

TextlineJS.build($("#pageContent"), "");
PlaceholderJS.build($(".content"));

const DB = require("./controller/db.js");
DB.init();

SearchMenuJS.registerEvents();
DocumentJS.registerEvents();

$("#newPage").on("click", function (event) {
  let pagename = CryptoJS.generateUUID();
  let templateData = FileJS.readFile("template.html");
  FileJS.writeFile(
    "./user_data/pages/" + pagename + ".html",
    templateData
  );
  PageJS.addPageToMenu(pagename);
  return false;
});

// TODO Encapsulate source code
// Handle pressing ENTER in table column header
$(".th_textArea").on("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
  }
});

// Only as example for interaction between main.js and renderer.js
// 1) Submit event in index.html
// 2) Submit event in renderer.js
// 3) Submit event in main.js
// 4) Reply event in renderer.js
$("#btnSubmitPagename").on("click", function (event) {
  let pagename = $("#pagename").val();
  console.log("Call submitForm with pagename " + pagename + "\n");

  IPCRenderer.once("actionReply", function (event, response) {
    console.log("Handle actionReply with pagename " + pagename + "\n");
    $("#page-title").text(pagename);
  });
  IPCRenderer.send("submitForm", pagename);
});

// Save password entered by user
$("#btnSavePassword").on("click", function (event) {
  const password = $("#password").val();
  CryptoJS.PASSWORD = password;
  console.log("User set password to " + CryptoJS.PASSWORD + "\n");

  CryptoJS.IV = CryptoJS.generateIV();
  console.log("User set iv to " + CryptoJS.IV + "\n");
});

// Set login password
$("#btnSetPassword").on("click", function (event) {
  const password = $("#password").val();
  CryptoJS.PASSWORD = password;
  console.log("User set password to " + CryptoJS.PASSWORD + "\n");
});

// Read password
$("#btnReadPassword").on("click", function (event) {
  console.log("User set password to " + CryptoJS.PASSWORD + "\n");
  console.log("User set iv to " + CryptoJS.IV + "\n");
});

// NEW Load content based on data saved by user
$("#btnLoad").on("click", function (event) {
  DataJS.load();
  TextlineJS.build($("#pageContent"), "");
});

// Save data entered by user
$("#btnSave").on("click", function (event) {
  let jsonData = DataJS.save();
  let data = CryptoJS.IV.toString();
  data += CryptoJS.encrypt(
    jsonData,
    CryptoJS.PASSWORD,
    CryptoJS.IV
  );
  FileJS.writeFile("data.enc", data);
});

// Restart application
$("#btnRestart").on("click", function (event) {
  IPCRenderer.send("restart");
});
