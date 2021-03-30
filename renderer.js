// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const ipcRenderer = require("electron").ipcRenderer;
const cryptomanager = require("./utils/cryptomanager.js");
const filemanager = require("./utils/filemanager.js");
window.$ = window.jQuery = require("jquery");

$("#newPage").on("click", function () {
  let uuid = cryptomanager.generateUUID();
  $("#navbarContent").append("<a href='#'>" + uuid + "</a>");
  return false;
});

// Only as example for interaction between main.js and renderer.js
// 1) Submit event in index.html
// 2) Submit event in renderer.js
// 3) Submit event in main.js
// 4) Reply event in renderer.js
$("#formPagename").on("submit", function (event) {
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
$("#formPassword").on("submit", function (event) {
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

// NEW Load data saved by user
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
  //let pagename = document.getElementById("page-title").innerText;
  let pagename = $("#page-title").text();

  let lineContent = [];
  const elements = $(".line");
  Array.prototype.forEach.call(elements, function (element) {
    lineContent.push(element.innerText);
  });

  let page = {
    pageName: pagename,
    lineContent: lineContent,
  };

  let jsonData = JSON.stringify(page);
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

//var tables = document.getElementsByClassName('flexiCol');
var tables = $("table");
for (var i = 0; i < tables.length; i++) {
  resizableGrid(tables[i]);
}

function resizableGrid(table) {
  var row = table.getElementsByTagName("tr")[0],
    cols = row ? row.children : undefined;
  if (!cols) return;

  table.style.overflow = "hidden";

  var rowHeight = row.offsetHeight;

  for (var i = 0; i < cols.length - 1; i++) {
    var div = createDiv(rowHeight);
    cols[i].appendChild(div);
    cols[i].style.position = "relative";
    setListeners(div);
  }

  function setListeners(div) {
    var pageX, curCol, nxtCol, curColWidth, nxtColWidth;

    $(div).on("mousedown", function (e) {
      curCol = e.target.parentElement;
      nxtCol = curCol.nextElementSibling;
      pageX = e.pageX;

      var padding = paddingDiff(curCol);

      curColWidth = curCol.offsetWidth - padding;
      if (nxtCol) nxtColWidth = nxtCol.offsetWidth - padding;
    });

    $(div).on("mouseover", function (e) {
      e.target.style.borderRight = "3px solid blue";
    });

    $(div).on("mouseout", function (e) {
      e.target.style.borderRight = "";
    });

    $(document).on("mousemove", function (e) {
      if (curCol) {
        var diffX = e.pageX - pageX;

        if (nxtCol) nxtCol.style.width = nxtColWidth - diffX + "px";

        curCol.style.width = curColWidth + diffX + "px";
      }
    });

    $(document).on("mouseup", function (e) {
      curCol = undefined;
      nxtCol = undefined;
      pageX = undefined;
      nxtColWidth = undefined;
      curColWidth = undefined;
    });
  }

  function createDiv(height) {
    var div = document.createElement("div");
    div.style.height = height + "px";
    div.className = "div";
    return div;
  }

  function paddingDiff(col) {
    if (getStyleVal(col, "box-sizing") == "border-box") {
      return 0;
    }

    var padLeft = getStyleVal(col, "padding-left");
    var padRight = getStyleVal(col, "padding-right");
    return parseInt(padLeft) + parseInt(padRight);
  }

  function getStyleVal(elm, css) {
    return window.getComputedStyle(elm, null).getPropertyValue(css);
  }
}