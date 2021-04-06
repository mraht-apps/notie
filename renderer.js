// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const ipcRenderer = require("electron").ipcRenderer;
const cryptomanager = require("./utils/cryptomanager.js");
const filemanager = require("./utils/filemanager.js");
const pagemanager = require("./utils/pagemanager.js");
const savemanager = require("./utils/savemanager.js");
const tablemanager = require("./utils/tablemanager.js");
window.$ = window.jQuery = require("jquery");

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
  event.preventDefault(); // stop the form from submitting
  let pagename = document.getElementById("pagename").value;
  console.log("Call submitForm with pagename " + pagename + "\n");

  ipcRenderer.once("actionReply", function (event, response) {
    console.log("Handle actionReply with pagename " + pagename + "\n");
    $("#page-title").text(pagename);
  });
  ipcRenderer.send("submitForm", pagename);
});

// Save password entered by user
$("#btnSavePassword").on("click", function (event) {
  event.preventDefault(); // stop the form from submitting

  const password = $("#password").val();
  cryptomanager.PASSWORD = password;
  console.log("User set password to " + cryptomanager.PASSWORD + "\n");

  cryptomanager.IV = cryptomanager.generateIV();
  console.log("User set iv to " + cryptomanager.IV + "\n");
});

// Read password
$("#btnReadPassword").on("click", function (event) {
  console.log("User set password to " + cryptomanager.PASSWORD + "\n");
  console.log("User set iv to " + cryptomanager.IV + "\n");
});

// NEW Load content based on data saved by user
$("#btnLoad").on("click", function (event) {
  if (filemanager.exists("data.enc")) {
    let data = filemanager.readFile("data.enc");
    let ivEnd = cryptomanager.IV_LENGTH * 2;
    cryptomanager.IV = cryptomanager.parseIV(data.slice(0, ivEnd));

    data = data.slice(ivEnd, data.length);
    let jsonData = cryptomanager.decrypt(
      data,
      cryptomanager.PASSWORD,
      cryptomanager.IV
    );
    console.log(jsonData);
  }
});

// Save data entered by user
$("#btnSave").on("click", function (event) {
  let jsonData = savemanager.save();
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

// Make content line editable
const setContentEditable = function (event, enable) {
  if (enable) {
    event.target.readonly = "false";
    event.target.focus();
  } else if (!event.target.innerText.trim()) {
    event.target.readonly = "true";
  }
};
const elements = document.getElementsByClassName("line");
for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener("click", function (event) {
    setContentEditable(event, true);
  });
  elements[i].addEventListener("focusout", function (event) {
    setContentEditable(event, false);
  });
}

tablemanager.init();