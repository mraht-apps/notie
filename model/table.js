class Table {
  static parent;
  static captionText;
  static columns;
  static rows;

  static build(parent, data) {
    let table = document.createElement("table");
    table.className = "contentTable";
    this.createCaption(table, data.caption);

    this.generateTableBody(table, data);
    this.generateTableHead(table, data);

    parent.append(table);

    //this.createColumnSeparators(table);
    // this.createColumnSeparators(table);
    // this.addEventListenersRows();

    return table;
  }

  static createCaption(table, captionText) {
    let caption = document.createElement("caption");
    let input = document.createElement("input");
    input.type = "text";
    input.value = captionText;
    caption.appendChild(input);
    table.insertBefore(caption, table.childNodes[0]);
  }

  static generateTableBody(table, data) {
    let key = data.columns[0].name;

    $(data.rows).each(function () {
      let row = $(this);
      let rowName = row.attr(key);
      let tr = table.insertRow();
      if (rowName == "+ New") {
        $(tr).on("click", function (event) {
          Eventhandler.onClickRowAdd(event);
        });
      }

      $(data.columns).each(function (columnIndex, column) {
        Table.generateTableCell(tr, columnIndex, column, row, rowName);
      });
    });
  }

  static generateTableCell(tr, columnIndex, column, row, rowName) {
    let columnValue = row ? row.attr(column.name) : "";
    let columnType = column.type;

    let td = document.createElement("td");
    if (rowName == "+ New") {
      if (columnValue == "+ New") {
        td.textContent = columnValue;
      } else {
        // Ignore additional columns
      }
    } else if (columnType != "add") {
      let input = document.createElement("input");
      input.type = columnType;

      switch (columnType) {
        case "checkbox":
          input.checked = columnValue;
          break;
        case "text":
          input.value = columnValue;
          break;
      }

      td.appendChild(input);
    }

    let nextTd = $(tr).children("td").eq(columnIndex);
    if (nextTd.length > 0) {
      nextTd.before(td);
    } else {
      tr.append(td);
    }
  }

  static generateTableHead(table, data) {
    let thead = table.createTHead();
    let tr = thead.insertRow();

    $(data.columns).each(function (index, column) {
      Table.generateTableColumn(tr, index, $(column));
    });
  }

  // OPT Set colspan for last row instead of table cells per column
  static generateTableColumn(tr, index, column) {
    let columnType = column.attr("type");
    let columnName = column.attr("name");

    let th = document.createElement("th");
    let columnWidth = column.attr("width");
    if (columnWidth) th.style.width = columnWidth;
    th.dataset.type = columnType;

    let div = document.createElement("div");
    div.className = "columnTitle";

    if (columnType === "add") {
      div.textContent = columnName;

      $(th).on("click", function (event) {
        Eventhandler.onClickColumnAdd(event);
      });
    } else {
      let span = document.createElement("span");
      let img = document.createElement("img");
      switch (columnType) {
        case "checkbox":
          img.src = "./res/img/checkbox.png";
          break;
        case "text":
          img.src = "./res/img/text.png";
          break;
      }
      span.className = "columnIcon";
      span.appendChild(img);
      div.append(span);

      let input = document.createElement("input");
      input.type = "text";
      input.value = columnName;
      div.append(input);
      th.appendChild(div);

      div = document.createElement("div");
      div.className = "columnResizeSeparator";
      Table.addEventListenersColumnSeparator(div);
    }

    th.appendChild(div);

    let nextTh = $(tr).children("th").eq(index);
    if (nextTh.length > 0) {
      nextTh.before(th);
    } else {
      tr.appendChild(th);
    }
  }

  static addRow(table) {
    Table.addRowByNewRow(table);
  }

  static addRowByNewRow(table) {
    let tableRows = $(table).children("tbody").children("tr");
    let addNewTableRow = tableRows.eq(tableRows.length - 1);

    let tr = document.createElement("tr");
    addNewTableRow.before(tr);

    let columns = [];
    $(table)
      .children("thead")
      .children("tr")
      .children("th")
      .each(function () {
        let column = $(this);
        let columnTitleDiv = column.children(".columnTitle").eq(0);
        let input = column.children("div").eq(0).children("input").eq(0);
        let columnName = input.length > 0 ? input.val() : columnTitleDiv.text();
        let columnType = column.data("type");
        columns.push({ name: columnName, type: columnType });
      });

    $(columns).each(function (columnIndex, column) {
      Table.generateTableCell(tr, columnIndex, column, null, "");
    });
  }

  static addColumn(table, column) {
    let thead = $(table).children("thead");
    let headerRow = thead.children("tr").eq(0);
    let columnIndex = thead.children("th").length - 1;
    Table.generateTableColumn(headerRow, columnIndex, $(column));
    Table.addRowByNewColumn(table, column);
  }

  static addRowByNewColumn(table, column) {
    let tbody = $(table).children("tbody");
    let tableRows = tbody.children("tr");
    tableRows.each(function () {
      let tr = $(this);
      let tableColumns = $(tr).children("td");
      let columnIndex = tableColumns.length - 1;
      let rowName = tr.is(tableRows.eq(tableRows.length - 1)) ? "+ New" : "";
      Table.generateTableCell(tr, columnIndex, column, null, rowName);
    });
  }

  static addEventListenersColumnSeparator(div) {
    $(div).on("mousedown", function (event) {
      Eventhandler.onMousedownColumnSeparator(event);
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
      name: "Column",
      type: "text",
      width: "120px",
    };
    let table = $(event.target).parents("table");
    Table.addColumn(table, column);
  }

  static onClickRowAdd(event) {
    let table = $(event.target).parents("table");
    Table.addRow(table);
  }

  static pageX;
  static currentColumn;
  static width;

  static onMousedownColumnSeparator(event) {
    this.currentColumn = event.target.parentElement;
    this.pageX = event.pageX;
    this.width = this.currentColumn.offsetWidth;
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
}

module.exports = Table;
