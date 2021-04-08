// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
window.$ = window.jQuery = require("jquery");

const ipcRenderer = require("electron").ipcRenderer;

// Utilities
const cryptomanager = require("./utils/cryptography.js");
const filemanager = require("./utils/file.js");

// Controller
const datamanager = require("./controller/data.js");

// Model
const pagemanager = require("./model/page.js");
const textline = require("./model/textline.js");

$("#newPage").on("click", function (event) {
  let pagename = cryptomanager.generateUUID();
  let templateData = filemanager.readFile("template.html");
  filemanager.writeFile("./pages/" + pagename + ".html", templateData);
  pagemanager.addPageToMenu(pagename);
  return false;
});

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

  ipcRenderer.once("actionReply", function (event, response) {
    console.log("Handle actionReply with pagename " + pagename + "\n");
    $("#page-title").text(pagename);
  });
  ipcRenderer.send("submitForm", pagename);
});

// Save password entered by user
$("#btnSavePassword").on("click", function (event) {
  const password = $("#password").val();
  cryptomanager.PASSWORD = password;
  console.log("User set password to " + cryptomanager.PASSWORD + "\n");

  cryptomanager.IV = cryptomanager.generateIV();
  console.log("User set iv to " + cryptomanager.IV + "\n");
});

// Set login password
$("#btnSetPassword").on("click", function (event) {
  const password = $("#password").val();
  cryptomanager.PASSWORD = password;
  console.log("User set password to " + cryptomanager.PASSWORD + "\n");
});

// Read password
$("#btnReadPassword").on("click", function (event) {
  console.log("User set password to " + cryptomanager.PASSWORD + "\n");
  console.log("User set iv to " + cryptomanager.IV + "\n");
});

// NEW Load content based on data saved by user
$("#btnLoad").on("click", function (event) {
  datamanager.load();
});

// Save data entered by user
$("#btnSave").on("click", function (event) {
  let jsonData = datamanager.save();
  let data = cryptomanager.IV.toString();
  data += cryptomanager.encrypt(
    jsonData,
    cryptomanager.PASSWORD,
    cryptomanager.IV
  );
  filemanager.writeFile("data.enc", data);
});

// Restart application
$("#btnRestart").on("click", function (event) {
  ipcRenderer.send("restart");
});

$(".line").each(function () {
  $(this).on("keypress", function (event) {
    switch (event.key) {
      case "/":
        console.log(event.key);
        break;
      case "Enter":
        console.log(event.key);
        event.preventDefault();
        break;
    }
  });
});

textline.init();
