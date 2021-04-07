function load() {
  let jsonData = readData();
  loadPageName(jsonData);
  loadPageContent(jsonData);
}

function readData() {
  const filemanager = require("./file.js");
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

  $(jsonData.content).each(function (index, element) {
    switch (element.type) {
      case "table":
        let table = loadTable(element);
        $("#pageContent").append(table);
        break;
      case "textline":
        let textline = loadTextline(element);
        $("#pageContent").append(textline);
        break;
    }
  });

  const tablemanager = require("./table.js");
  tablemanager.init();
}

function resetPageContent() {
  $("#pageContent").empty();
}

function loadTextline(element) {
  let textarea = document.createElement("textarea");
  textarea.className = "line";
  textarea.rows = "1";
  textarea.textContent = element.text;

  return textarea;
}

function loadTable(element) {
  let table = document.createElement("table");
  table.className = "contentTable";

  let caption = document.createElement("caption");
  let captionDiv = document.createElement("div");
  captionDiv.contentEditable = "true";
  captionDiv.textContent = element.caption;
  caption.appendChild(captionDiv);
  table.insertBefore(caption, table.childNodes[0]);

  let thead = document.createElement("thead");
  let tr = document.createElement("tr");
  $(element.columns).each(function (index, column) {
    let th = document.createElement("th");
    th.style.position = "relative";
    th.style.width = column.width + "px";
    let div = document.createElement("div");
    div.className = "columnTitle";
    div.contentEditable = "true";
    div.textContent = column.name;
    th.append(div);
    tr.append(th);
  });
  // Create "+"-column
  let th = document.createElement("th");
  let div = document.createElement("div");
  div.className = "columnTitle";
  div.textContent = "+";
  th.append(div);

  tr.append(th);
  thead.append(tr);
  table.append(thead);

  let tbody = document.createElement("tbody");
  $(element.rows).each(function (index, row) {
    let tr = document.createElement("tr");
    console.log(row);
    for (var i = 0; i < element.columns.length; i++) {
      let column = element.columns[i];
      let cell = row[i];
      let td = document.createElement("td");
      switch (column.type) {
        case "checkbox":
          let checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          if (cell.text === "X") {
            checkbox.checked = true;
          }
          td.append(checkbox);
          break;
        case "textarea":
          let textarea = document.createElement("textarea");
          textarea.rows = "1";
          textarea.textContent = cell.text;
          td.append(textarea);
          break;
      }
      tr.append(td);
    }
    let td = document.createElement("td");
    tr.append(td);
    tbody.append(tr);
  });
  // Create "+ New"-row
  tr = document.createElement("tr");
  let td = document.createElement("td");
  td.colSpan = element.columns.length + 1;
  td.textContent = "+ New";
  tr.append(td);
  tbody.append(tr);

  table.append(tbody);

  return table;
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
  children.each(function () {
    let element = $(this);
    let textline, table;

    if (element.is("textarea")) {
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

  let columns = element.find("th");
  let columnsContent = [];

  for (var i = 0; i < columns.length - 1; i++) {
    let column = columns.eq(i);
    let columnType = column.data("type");
    let columnContent = {
      type: columnType,
      name: column.text().trim(),
      width: column.width(),
    };
    columnsContent.push(columnContent);
  }

  let rows = element.find("tr");
  let rowsContent = [];

  for (var i = 1; i < rows.length - 1; i++) {
    let row = rows.eq(i);
    let cells = $(row).find("td");

    let cellsContent = [];
    for (var j = 0; j < columns.length - 1; j++) {
      let element = cells.eq(j).children().eq(0);
      let text = element.text();
      if (element.is(":checked")) {
        text = "X";
      }

      let cellContent = {
        text: text,
      };
      cellsContent.push(cellContent);
    }
    rowsContent.push(cellsContent);
  }

  let table = {
    type: "table",
    caption: $(element).find("caption").text().trim(),
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
