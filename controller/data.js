// OPT Encapsulate loading and saving functions into table.js or textline.js
// OPT Show error if no or wrong password has been supplied
const filemanager = require("../utils/file.js");
const Table = require("../model/table.js");
const Textline = require("../model/textline.js");

function load() {
  let jsonData = readData();
  loadPageName(jsonData);
  loadPageContent(jsonData);
}

function readData() {
  if (filemanager.exists("data.enc")) {
    let data = filemanager.readFile("data.enc");
    let ivEnd = cryptomanager.IV_LENGTH * 2;
    cryptomanager.IV = cryptomanager.parseIV(data.slice(0, ivEnd));

    data = data.slice(ivEnd, data.length);
    let decryptedData = cryptomanager.decrypt(
      data,
      cryptomanager.PASSWORD,
      cryptomanager.IV
    );

    jsonData = JSON.parse(decryptedData);
    console.log(jsonData);
    return jsonData;
  }
}

function loadPageName(jsonData) {
  console.log("Set pagename to " + jsonData.name);
  $("#page-title").text(jsonData.name);
}

function loadPageContent(jsonData) {
  resetPageContent();

  let parent = $("#pageContent");
  $(jsonData.content).each(function (index, element) {
    switch (element.type) {
      case "table":
        loadTable(parent, element);
        break;
      case "textline":
        loadTextline(parent, element);
        break;
    }
  });
}

function resetPageContent() {
  $("#pageContent").empty();
}

function loadTextline(parent, element) {
  Textline.build(parent, element.text);
}

function loadTable(parent, data) {
  Table.build(parent, data);
}

function save() {
  let pageName = savePageName();
  let pageContent = savePageContent();

  let page = {
    name: pageName,
    content: pageContent,
  };

  return JSON.stringify(page);
}

function savePageName() {
  return $("#page-title").text();
}

function savePageContent() {
  let pageContent = [];
  let children = $("#pageContent").children();
  let textline, table;

  children.each(function () {
    let element = $(this);
    if (element.is("input:text") && element.val().trim()) {
      textline = saveTextline(element);
      pageContent.push(textline);
    } else if (element.is("table")) {
      table = saveTable(element);
      pageContent.push(table);
    }
  });

  return pageContent;
}

function saveTextline(element) {
  console.log(element);
  let textline = { type: "textline", text: element.val() };
  console.log(textline);
  return textline;
}

function saveTable(element) {
  console.log(element);

  let caption = $(element).find("caption").children("input").val();

  let columns = element.find("th");
  let columnsContent = [];

  for (var i = 0; i < columns.length - 1; i++) {
    let column = columns.eq(i);
    let columnContent = {
      name: column.children(".columnTitle").children("input").val(),
      type: column.data("type"),
      width: column.css("width"),
    };
    columnsContent.push(columnContent);
  }

  let rows = element.find("tr");
  let rowsContent = [];

  for (var i = 1; i < rows.length - 1; i++) {
    let row = rows.eq(i);
    let cells = $(row).find("td");

    let cellsContent = {};
    for (var j = 0; j < columns.length - 1; j++) {
      let columnName = $(columns[j])
        .children(".columnTitle")
        .children("input")
        .val();
      let element = cells.eq(j).children().eq(0);
      let text = element.val();
      if (element.is(":checked")) {
        text = "X";
      }
      $(cellsContent).attr(columnName, text);
    }
    rowsContent.push(cellsContent);
  }

  let table = {
    type: "table",
    caption: caption,
    columns: columnsContent,
    rows: rowsContent,
  };

  console.log(table);
  return table;
}

module.exports = {
  load,
  save,
};
