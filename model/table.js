class Table {
  table;
  parent;
  captionText;
  columns;
  rows;

  constructor(parent, captionText, columns, rows) {
    this.table = document.createElement("table");
    this.table.className = "contentTable";

    this.parent = parent;
    this.captionText = captionText;
    this.columns = columns;
    this.rows = rows;

    this.build();
  }

  build() {
    this.createCaption();
    this.createHeader();
    this.createBody();

    this.parent.append(this.table);
    this.addColumnSeparators();
    this.addEventListenersRows();
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
    th.dataset.type = column.type;
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

  addColumnSeparators() {
    let row = $(this.table).find("tr").eq(0);
    let cols = row ? row.children() : undefined;
    if (!cols) return;

    let rowHeight = row.outerHeight();

    for (let i = 0; i < cols.length - 1; i++) {
      let separatorDiv = this.createDiv(rowHeight);
      cols[i].appendChild(separatorDiv);
      cols[i].style.position = "relative";
      this.addEventListenersColumnSeparator(separatorDiv);
    }
  }

  createDiv(height) {
    let div = document.createElement("div");
    div.style.height = height + "px";
    div.className = "columnResizeSeparator";
    return div;
  }

  addEventListenersColumnSeparator(div) {
    let pageX, currentColumn, nextColumn, width, nxtColWidth;

    $(div).on("mousedown", function (event) {
      currentColumn = event.target.parentElement;
      nextColumn = currentColumn.nextElementSibling;
      pageX = event.pageX;

      let padding = 0;
      let boxSizing = window
        .getComputedStyle(currentColumn, null)
        .getPropertyValue("box-sizing");
      if (boxSizing !== "border-box") {
        let paddingLeft = window
          .getComputedStyle(currentColumn, null)
          .getPropertyValue("padding-left");
        let paddingRight = window
          .getComputedStyle(currentColumn, null)
          .getPropertyValue("padding-right");
        padding = parseInt(paddingLeft) + parseInt(paddingRight);
      }
      width = currentColumn.offsetWidth - padding;
    });

    $(div).on("mouseover", function (event) {
      event.target.style.backgroundColor = "rgba(46, 170, 220, 1)";
    });

    $(div).on("mouseout", function (event) {
      event.target.style.backgroundColor = "";
    });

    $(div).on("dblclick", function (event) {
      let column = $(event.target).parent();
      let text = column.text().trim();

      let tempDiv = document.createElement("div");
      document.body.appendChild(tempDiv);
      tempDiv.style.fontSize = "16px";
      tempDiv.style.position = "absolute";
      tempDiv.style.left = -1000;
      tempDiv.style.top = -1000;
      tempDiv.textContent = text;

      let width = tempDiv.clientWidth;
      document.body.removeChild(tempDiv);
      tempDiv = null;

      if (width === 0) {
        width = 20;
      }
      column.width(width);
    });

    $(document).on("mousemove", function (event) {
      if (currentColumn) {
        let diffX = event.pageX - pageX;
        let oldWidthStr = currentColumn.style.width;
        let sliceIndex = oldWidthStr.indexOf("px");
        let oldWidth = parseInt(parseInt(oldWidthStr.slice(0, sliceIndex)) + 1);

        let newWidth = width + diffX;
        if (newWidth >= 19 && oldWidth !== newWidth) {
          currentColumn.style.width = newWidth + "px";
        }
      }
    });

    $(document).on("mouseup", function (event) {
      console.log("up");
      currentColumn = undefined;
      nextColumn = undefined;
      pageX = undefined;
      nxtColWidth = undefined;
      width = undefined;
    });
  }

  addEventListenersRows() {
    let rows = $(this.table).find("tr");
    for (let i = 0; i < rows.length; i++) {
      $(rows[i]).on("contextmenu", function (event) {
        let row = $(event.target).parents().filter("tr").eq(0);
        self.setActiveRow(row);
      });
    }
  }

  setActiveRow(activeRow) {
    let currentlyActiveRow = $("#activeRow");
    if(activeRow.is(currentlyActiveRow)) return;

    if(currentlyActiveRow) {
      currentlyActiveRow.attr("id", "");
    }
    activeRow.attr("id", "activeRow");
  }
}

module.exports = Table
