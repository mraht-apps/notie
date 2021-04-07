class Table {
  table;
  captionText;
  columns;
  rows;

  constructor(captionText, columns, rows) {
    this.table = document.createElement("table");
    this.table.className = "contentTable";

    this.captionText = captionText;
    this.columns = columns;
    this.rows = rows;
  }

  build() {
    this.createCaption();
    this.createHeader();
    this.createBody();

    return this.table;
  }

  createCaption() {
    let caption = document.createElement("caption");
    let captionDiv = document.createElement("div");
    captionDiv.contentEditable = "true";
    captionDiv.textContent = this.captionText;
    caption.appendChild(captionDiv);
    this.table.insertBefore(caption, this.table.childNodes[0]);
  }

  createHeader() {
    let thead = document.createElement("thead");
    this.createColumns(thead);
    this.table.append(thead);
  }

  createColumns(thead) {
    let tr = document.createElement("tr");
    let self = this;
    $(this.columns).each(function (index, column) {
      self.createColumn(thead, tr, column);
    });
    this.createColumnAdd(thead, tr);
  }

  createColumn(thead, tr, column) {
    let th = document.createElement("th");
    th.style.position = "relative";
    th.style.width = column.width + "px";
    let div = document.createElement("div");
    div.className = "columnTitle";
    div.contentEditable = "true";
    div.textContent = column.name;
    th.append(div);
    tr.append(th);

    thead.append(tr);
  }

  // Create "+"-column
  createColumnAdd(thead, tr) {
    let th = document.createElement("th");
    let div = document.createElement("div");
    div.className = "columnTitle";
    div.textContent = "+";
    th.append(div);
    tr.append(th);

    thead.append(tr);
  }

  createBody() {
    let tbody = document.createElement("tbody");
    this.createRows(tbody);
    this.createRowAdd(tbody);
    this.table.append(tbody);
  }

  createRows(tbody) {
    self = this;
    $(this.rows).each(function (index, row) {
      self.createRow(tbody, row);
    });
  }

  createRow(tbody, row) {
    let tr = document.createElement("tr");
    console.log(row);
    for (var i = 0; i < this.columns.length; i++) {
      let column = this.columns[i];
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

    // Create empty cell for add column
    let td = document.createElement("td");
    tr.append(td);

    tbody.append(tr);
  }

  createRowAdd(tbody) {
    // Create "+ New"-row
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    td.colSpan = this.columns.length + 1;
    td.textContent = "+ New";
    tr.append(td);
    tbody.append(tr);
  }

  getHtmlElement() {
    return this.table;
  }
}

function init() {
  var tables = $(".contentTable");
  for (var i = 0; i < tables.length; i++) {
    buildResizableGrid(tables[i]);
  }

  let rows = $("tr");
  for (var i = 0; i < rows.length; i++) {
    $(rows[i]).on("contextmenu", function (event) {
      let parents = $(event.target).parents();
      parents.each(function () {
        if ($(this).is("tr")) {
          setActiveRow($(this));
        }
      });
    });
  }
}

function setActiveRow(activeRow) {
  $("tr").each(function () {
    let row = $(this);
    if (row.is(activeRow)) {
      row.attr("id", "activeRow");
    } else {
      row.attr("id", "");
    }
  });
}

// TODO Build grid based on saved user data
function buildResizableGrid(table) {
  var row = $(table).find("tr").eq(0);
  var cols = row ? row.children() : undefined;
  if (!cols) return;

  var rowHeight = row.outerHeight();

  for (var i = 0; i < cols.length - 1; i++) {
    var div = createDiv(rowHeight);
    cols[i].appendChild(div);
    cols[i].style.position = "relative";
    setListeners(div);
  }
}

function createDiv(height) {
  var div = document.createElement("div");
  div.style.height = height + "px";
  div.className = "columnResizeSeparator";
  return div;
}

function setListeners(div) {
  var pageX, curCol, nxtCol, curColWidth, nxtColWidth;

  $(div).on("mousedown", function (e) {
    curCol = e.target.parentElement;
    nxtCol = curCol.nextElementSibling;
    pageX = e.pageX;

    var padding = paddingDiff(curCol);
    curColWidth = curCol.offsetWidth - padding;
  });

  $(div).on("mouseover", function (e) {
    e.target.style.backgroundColor = "rgba(46, 170, 220, 1)";
  });

  $(div).on("mouseout", function (e) {
    e.target.style.backgroundColor = "";
  });

  $(div).on("dblclick", function (e) {
    let column = $(e.target).parent();
    let text = column.text().trim();

    var tempDiv = document.createElement("div");
    document.body.appendChild(tempDiv);
    tempDiv.style.fontSize = "" + 16 + "px";
    tempDiv.style.position = "absolute";
    tempDiv.style.left = -1000;
    tempDiv.style.top = -1000;
    tempDiv.textContent = text;

    var width = tempDiv.clientWidth;
    document.body.removeChild(tempDiv);
    tempDiv = null;

    if (width === 0) {
      width = 20;
    }
    column.width(width);
  });

  $(document).on("mousemove", function (e) {
    if (curCol) {
      var diffX = e.pageX - pageX;
      let oldWidthStr = curCol.style.width;
      let sliceIndex = oldWidthStr.indexOf("px");
      let oldWidth = parseInt(parseInt(oldWidthStr.slice(0, sliceIndex)) + 1);

      let newWidth = curColWidth + diffX;
      if (newWidth >= 19 && oldWidth !== newWidth) {
        curCol.style.width = newWidth + "px";
      }
    }
  });

  $(document).on("mouseup", function (e) {
    console.log("up");
    curCol = undefined;
    nxtCol = undefined;
    pageX = undefined;
    nxtColWidth = undefined;
    curColWidth = undefined;
  });
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

module.exports = {
  Table,
  init,
};
