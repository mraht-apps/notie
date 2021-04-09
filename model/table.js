class Table {
  static table;
  static parent;
  static captionText;
  static columns;
  static rows;

  static build(parent, captionText, columns, rows) {
    this.table = document.createElement("table");
    this.table.className = "contentTable";

    this.parent = parent;
    this.captionText = captionText;
    this.columns = columns;
    this.rows = rows;

    this.createCaption();
    let thead = this.createHeader();
    let tbody = this.createBody();
    this.createColumns(thead, tbody);
    this.createRowAdd(tbody);
    this.parent.append(this.table);

    this.createColumnSeparators();
    this.addEventListenersRows();
  }

  static createCaption() {
    let caption = document.createElement("caption");
    let captionDiv = document.createElement("div");
    captionDiv.contentEditable = "true";
    captionDiv.textContent = this.captionText;
    caption.appendChild(captionDiv);
    this.table.insertBefore(caption, this.table.childNodes[0]);
  }

  static createHeader() {
    let thead = document.createElement("thead");
    this.table.append(thead);
    return thead;
  }

  static createBody() {
    let tbody = document.createElement("tbody");
    this.table.append(tbody);
    return tbody;
  }

  // OPT Try to optimize logic of addColumn/addRow and createColumns/createColumn/createRow
  static addColumn(thead, tbody, column) {
    let columnIndex = $(thead).find("th").length - 1;
    Table.createColumn($(thead, "tr"), columnIndex, column);
    Table.createColumnRowCells(tbody, columnIndex, column.type);
    let headerRow = $(thead).find("tr").eq(0);
    let tableColumn = $(thead).find("th").eq(columnIndex);
    Table.addColumnSeparator(headerRow, tableColumn);
  }

  static createColumns(thead, tbody) {
    let tr = document.createElement("tr");
    this.columns.push({ type: "add", name: "+ New" });
    $(this.columns).each(function (index, column) {
      Table.createColumn(tr, index, column);
      Table.createColumnRowCells(tbody, index, column.type);
    });
    thead.append(tr);
  }

  static createColumn(tr, columnIndex, column) {
    let th = document.createElement("th");
    th.style.position = "relative";
    if (column.width) th.style.width = column.width + "px";
    th.dataset.type = column.type;

    let div = document.createElement("div");
    div.className = "columnTitle";
    div.textContent = column.name;

    if (column.type == "add") {
      $(th).on("click", function (event) {
        Eventhandler.onClickColumnAdd(event);
      });
    } else {
      div.contentEditable = "true";
    }

    th.append(div);
    let prev = $(tr)
      .find("th")
      .eq(columnIndex - 1);
    if (prev.length > 0) {
      prev.after(th);
    } else {
      tr.append(th);
    }
  }

  static createColumnRowCells(tbody, columnIndex, columnType) {
    $(this.rows).each(function (index, row) {
      let tr = $(tbody).find("tr").eq(index);
      if (tr.length == 0) {
        tr = Table.createRow(tbody);
      }
      Table.createColumnRowCell(tr, columnIndex, columnType, row[columnIndex]);
    });
  }

  static addRow(thead, tbody) {
    let rowIndex = $(tbody).find("tr").length - 1;
    let tr = Table.createRow(tbody, rowIndex);
    let tableColumns = $(thead).find("th");
    tableColumns.each(function (index, tableColumn) {
      let columnType = $(tableColumn).data("type");
      Table.createColumnRowCell(tr, index, columnType, null);
    });
  }

  static createRow(tbody, index) {
    let tr = document.createElement("tr");
    let prev = $(tbody)
      .find("tr")
      .eq(index - 1);
    if (prev.length > 0) {
      prev.after(tr);
    } else {
      tbody.append(tr);
    }
    return tr;
  }

  static createColumnRowCell(tr, columnIndex, columnType, cell) {
    let td = document.createElement("td");
    let text = "";
    if (cell) {
      text = cell.text;
    }

    switch (columnType) {
      case "checkbox":
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        if (text === "X") {
          checkbox.checked = true;
        }
        td.append(checkbox);
        break;
      case "textarea":
        let textarea = document.createElement("textarea");
        textarea.rows = "1";
        textarea.textContent = text;
        td.append(textarea);
        break;
      case "add":
        break;
    }

    let prev = $(tr)
      .find("td")
      .eq(columnIndex - 1);
    if (prev.length > 0) {
      prev.after(td);
    } else {
      tr.append(td);
    }
  }

  static createRowAdd(tbody) {
    // Create "+ New"-row
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    td.colSpan = this.columns.length + 1;
    td.textContent = "+ New";
    tr.append(td);
    $(tr).on("click", function (event) {
      Eventhandler.onClickRowAdd(event);
    });
    tbody.append(tr);
  }

  static addColumnSeparator(headerRow, column) {
    let rowHeight = headerRow.outerHeight();
    Table.createColumnSeparator(column, rowHeight);
  }

  static createColumnSeparators() {
    let headerRow = $(this.table).find("tr").eq(0);
    let columns = headerRow.children();
    let rowHeight = headerRow.outerHeight();

    for (let i = 0; i < columns.length - 1; i++) {
      Table.createColumnSeparator(columns[i], rowHeight);
    }
  }

  static createColumnSeparator(column, rowHeight) {
    let separatorDiv = this.createDiv(rowHeight);
    column.append(separatorDiv);
    column.position = "relative";
    this.addEventListenersColumnSeparator(separatorDiv);
  }

  static createDiv(height) {
    let div = document.createElement("div");
    div.style.height = height + "px";
    div.className = "columnResizeSeparator";
    return div;
  }

  static addEventListenersColumnSeparator(div) {
    $(div).on("mousedown", function (event) {
      Eventhandler.onMousedownColumnSeparator(event);
    });

    $(div).on("mouseover", function (event) {
      Eventhandler.onMouseoverColumnSeparator(event);
    });

    $(div).on("mouseout", function (event) {
      Eventhandler.onMouseoutColumnSeparator(event);
    });

    $(div).on("dblclick", function (event) {
      Eventhandler.onDblclickColumnSeparator(event);
    });

    $(document).on("mousemove", function (event) {
      Eventhandler.onMousemove(event);
    });

    $(document).on("mouseup", function (event) {
      Eventhandler.onMouseup(event);
    });
  }

  static addEventListenersRows() {
    let rows = $(this.table).find("tr");
    for (let i = 0; i < rows.length; i++) {
      $(rows[i]).on("contextmenu", function (event) {
        Eventhandler.onContextmenuRow(event);
      });
    }
  }

  static setActiveRow(activeRow) {
    let currentlyActiveRow = $("#activeRow");
    if (activeRow.is(currentlyActiveRow)) return;

    if (currentlyActiveRow) {
      currentlyActiveRow.attr("id", "");
    }
    activeRow.attr("id", "activeRow");
  }
}

class Eventhandler {
  static onClickColumnAdd(event) {
    let column = {
      type: "textarea",
      name: "",
    };
    let table = $(event.target).parents("table");
    let thead = table.children("thead");
    let tbody = table.children("tbody");
    Table.addColumn(thead, tbody, column);
  }

  static onClickRowAdd(event) {
    let table = $(event.target).parents("table");
    let thead = table.children("thead");
    let tbody = table.children("tbody");
    Table.addRow(thead, tbody);
  }

  static pageX;
  static currentColumn;
  static width;

  static onMousedownColumnSeparator(event) {
    this.currentColumn = event.target.parentElement;
    this.pageX = event.pageX;

    let padding = 0;
    let boxSizing = window
      .getComputedStyle(this.currentColumn, null)
      .getPropertyValue("box-sizing");
    if (boxSizing !== "border-box") {
      let paddingLeft = window
        .getComputedStyle(this.currentColumn, null)
        .getPropertyValue("padding-left");
      let paddingRight = window
        .getComputedStyle(this.currentColumn, null)
        .getPropertyValue("padding-right");
      padding = parseInt(paddingLeft) + parseInt(paddingRight);
    }
    this.width = this.currentColumn.offsetWidth - padding;
  }

  static onMouseoverColumnSeparator(event) {
    event.target.style.backgroundColor = "rgba(46, 170, 220, 1)";
  }

  static onMouseoutColumnSeparator(event) {
    event.target.style.backgroundColor = "";
  }

  static onDblclickColumnSeparator(event) {
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
  }

  static onMousemove(event) {
    if (this.currentColumn) {
      let diffX = event.pageX - this.pageX;
      let oldWidthStr = this.currentColumn.style.width;
      let sliceIndex = oldWidthStr.indexOf("px");
      let oldWidth = parseInt(parseInt(oldWidthStr.slice(0, sliceIndex)) + 1);

      let newWidth = this.width + diffX;
      if (newWidth >= 19 && oldWidth !== newWidth) {
        this.currentColumn.style.width = newWidth + "px";
      }
    }
  }

  static onMouseup(event) {
    this.currentColumn = undefined;
    this.pageX = undefined;
    this.width = undefined;
  }

  static onContextmenuRow(event) {
    let row = $(event.target).parents().filter("tr").eq(0);
    Table.setActiveRow(row);
  }
}

module.exports = Table;
