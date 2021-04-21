class Table {
  static parent;
  static captionText;
  static columns;
  static rows;

  static build(parent, data) {
    let table = document.createElement("table");
    table.className = "table";
    const uuid = require("../utils/cryptography.js");
    $(table).data("id", uuid.generateUUID());
    this.createCaption(table, data.caption);

    this.prepareGeneration(data);
    this.generateTableBody(table, data);
    this.generateTableHead(table, data);

    if (parent != null) {
      parent.append(table);
    }

    return table;
  }

  static createCaption(table, captionText) {
    let caption = document.createElement("caption");

    let captionContainer = document.createElement("div");
    captionContainer.className = "captionContainer";

    let tableTitleContainer = document.createElement("div");
    tableTitleContainer.className = "tableTitleContainer";
    let captionInput = document.createElement("input");
    captionInput.type = "text";
    captionInput.value = captionText;
    tableTitleContainer.appendChild(captionInput);
    captionContainer.appendChild(tableTitleContainer);

    let tableMenuContainer = document.createElement("div");
    tableMenuContainer.className = "tableMenuContainer";
    let menuImg = document.createElement("img");
    menuImg.src = "res/img/menu.svg";
    tableMenuContainer.appendChild(menuImg);
    $(tableMenuContainer).on("click", function (event) {
      Eventhandler.onClickTableMenuContainer(event);
    });
    captionContainer.appendChild(tableMenuContainer);
    caption.appendChild(captionContainer);

    let tableMenu = document.createElement("div");
    tableMenu.className = "tableMenu";
    let tableMenuTable = document.createElement("table");
    let tr = tableMenuTable.insertRow();
    tr.id = "deleteTable";
    TablemenuJS.Tablemenu.registerEvent(tr);
    let td = document.createElement("td");
    let deleteImg = document.createElement("img");
    deleteImg.src = "res/img/trash.svg";
    td.appendChild(deleteImg);
    let text = document.createTextNode("Delete");
    td.appendChild(text);
    tr.appendChild(td);
    tableMenu.appendChild(tableMenuTable);
    caption.appendChild(tableMenu);
    table.insertBefore(caption, table.childNodes[0]);
  }

  static prepareGeneration(data) {
    data.columns.push({ name: "+ New", type: "add" });
  }

  static generateTableBody(table, data) {
    $(data.rows).each(function () {
      Table.generateTableRow(table, data, $(this));
    });
    Table.generateTableRowNew(table, data);
    $(table).children("tbody").addClass("tableBody");
  }

  static generateTableRowNew(table, data) {
    let numberOfColumns = data.columns.length + 1;
    let tr = table.insertRow();
    $(tr).on("click", function (event) {
      Eventhandler.onClickRowAdd(event);
    });
    let td = document.createElement("td");
    td.textContent = "+ New";
    td.colSpan = numberOfColumns;
    tr.append(td);
  }

  static generateTableRow(table, data, row) {
    let tr = table.insertRow();

    $(data.columns).each(function (columnIndex, column) {
      let exit = Table.generateTableCell(tr, columnIndex, column, row);
      if (exit) return false;
    });
  }

  static generateTableCell(tr, columnIndex, column, row) {
    let exit = false;
    let columnValue = row ? row.attr(column.name) : "";
    let columnType = column.type;

    let td = document.createElement("td");
    if (columnType != "add") {
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

    return exit;
  }

  static generateTableHead(table, data) {
    let thead = table.createTHead();
    thead.className = "tableHead";
    let tr = thead.insertRow();

    $(data.columns).each(function (index, column) {
      Table.generateTableColumn(tr, index, $(column));
    });
  }

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
      let img = document.createElement("img");
      switch (columnType) {
        case "checkbox":
          img.src = "./res/img/checkbox.png";
          break;
        case "text":
          img.src = "./res/img/text.png";
          break;
      }
      div.append(img);

      let input = document.createElement("input");
      input.type = "text";
      input.value = columnName;
      div.append(input);
      th.appendChild(div);

      div = document.createElement("div");
      div.className = "columnResizeSeparator";
      Table.registerEventsColumnSeparator(div);
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
      Table.generateTableCell(tr, columnIndex, column, null);
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
    let tableColumns = tableRows.eq(0).children("td");

    for (let i = 0; i < tableRows.length - 1; i++) {
      let tr = $(tableRows[i]);
      let columnIndex = tableColumns.length - 1;
      Table.generateTableCell(tr, columnIndex, column, null);
    }

    let numberOfColumns = tableColumns.length + 1;
    tableRows
      .eq(tableRows.length - 1)
      .children("td")
      .eq(0)
      .attr("colspan", numberOfColumns);
  }

  static registerEventsColumnSeparator(div) {
    $(div).on("mousedown", function (event) {
      Eventhandler.onMousedownColumnSeparator(event);
    });

    $(div).on("dblclick", function (event) {
      Eventhandler.onDblclickColumnSeparator(event);
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

  static remove(table) {
    table.remove();
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
    let text = column
      .children(".columnTitle")
      .children("input:text")
      .val()
      .trim();

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

  static onClickTableMenuContainer(event) {
    TablemenuJS.Tablemenu.open();
  }
}

module.exports = { Table, Eventhandler };
