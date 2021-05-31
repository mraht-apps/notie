const Enums = require("../model/enums.js");
const General = require("../utils/general.js");

class Table {
  static createByPageId(pageId) {
    let htmlElements = [];
    let tables = Table_DB.getByPageId(pageId);
    let tableColumns = Table_DB.getColumns(tables);

    document.querySelector(tables).each(function (index, table) {
      let columns = document.querySelector(tableColumns).filter(function () {
        return this.table_id == table.id;
      });

      let values = Table_DB.getValues(table.id);

      let rows = [];
      document.querySelector(values).each(function (index, value) {
        let row = {};
        document.querySelector(columns).each(function (index, column) {
          let cellValue = value[column.id];
          if (column.type == Enums.ColumnTypes.CHK.id) {
            cellValue = cellValue == "true";
          }
          row[column.id] = cellValue;
        });
        rows.push(row);
      });

      let htmlElement = Table.create({
        id: table.id,
        caption: table.name,
        columns: columns,
        rows: rows,
      });
      htmlElements.push(htmlElement);
    });

    return htmlElements;
  }

  static create(jsonData) {
    let jsonData = this.initData(jsonData);

    let htmlTable = document.createElement("table");
    htmlTable.className = "table";
    Table.createCaption(htmlTable, jsonData.caption);

    Table.prepare(jsonData);
    Table.generateTableBody(htmlTable, jsonData);
    Table.generateTableHead(htmlTable, jsonData);

    let htmlElement = document.createElement("div");
    htmlElement.className = "pageElement table";
    if (!jsonData.id || jsonData.id.length == 0) {
      document.querySelector(htmlElement).dataset.uuid", Crypto.generateUUID(6));
    } else {
      document.querySelector(htmlElement).dataset.uuid", jsonData.id);
    }
    htmlElement.append(htmlTable);

    return htmlElement;
  }

  static initData(jsonData) {
    if (!jsonData) {
      jsonData = {
        id: "",
        caption: "",
        columns: [
          { id: "", name: "Name", type: Enums.ColumnTypes.TXT.id, width: "120px" },
          { id: "", name: "Done", type: Enums.ColumnTypes.CHK.id, width: "20px" },
        ],
        rows: [
          {
            Name: "",
            Done: false,
          },
          {
            Name: "",
            Done: false,
          },
          {
            Name: "",
            Done: false,
          },
        ],
      };
    }
    return jsonData;
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
    captionInput.placeholder = "Untitled";
    tableTitleContainer.appendChild(captionInput);
    captionContainer.appendChild(tableTitleContainer);

    let tableMenuContainer = document.createElement("div");
    tableMenuContainer.className = "tableMenuContainer";
    let sortImg = document.createElement("img");
    sortImg.src = "../res/img/sort.svg";
    sortImg.id = "btnSortTable";
    sortImg.draggable = false;
    sortImg.title = "Sort table data";
    tableMenuContainer.appendChild(sortImg);
    let filterImg = document.createElement("img");
    filterImg.src = "../res/img/filter.svg";
    filterImg.id = "btnFilterTable";
    filterImg.draggable = false;
    filterImg.title = "Filter table data";
    tableMenuContainer.appendChild(filterImg);
    let menuImg = document.createElement("img");
    menuImg.src = "../res/img/menu.svg";
    menuImg.id = "btnTableMenu";
    menuImg.draggable = false;
    menuImg.title = "Open table menu";
    tableMenuContainer.appendChild(menuImg);
    TableMenu.registerEvent(tableMenuContainer);
    captionContainer.appendChild(tableMenuContainer);
    caption.appendChild(captionContainer);
    table.insertBefore(caption, table.children[0]);
  }

  static prepare(data) {
    data.columns.push({ name: "New", type: Enums.ColumnTypes.ADD.id });
  }

  static generateTableBody(table, data) {
    document.querySelector(data.rows).each(function () {
      Table.generateTableRow(table, data, document.querySelector(this));
    });
    Table.generateTableRowNew(table, data);
    document.querySelector(table).children("tbody").classList.add("tableBody");
  }

  static generateTableRow(table, data, row) {
    let tr = table.insertRow();
    document.querySelector(tr).dataset.uuid", Crypto.generateUUID(6));

    document.querySelector(data.columns).each(function (columnIndex, column) {
      let exit = Table.generateTableCell(tr, columnIndex, column, row);
      if (exit) return false;
    });
  }

  static resetTableBody(table) {
    table.querySelector("tbody").clear();
    // TODO fill data from table
    Table.generateTableBody(table, data);
  }

  static generateTableRowNew(table, data) {
    let numberOfColumns = data.columns.length + 1;
    let tr = table.insertRow();
    document.querySelector(tr).addEventListener("click", (event) => Eventhandler.onClickRowAdd(event));
    let td = document.createElement("td");
    td.colSpan = numberOfColumns;
    let div = document.createElement("div");
    div.id = "newRow";
    let img = document.createElement("img");
    img.src = "../res/img/new.svg";
    img.id = "newImg";
    img.draggable = false;
    div.appendChild(img);
    let text = document.createElement("New");
    div.appendChild(text);
    td.appendChild(div);
    tr.append(td);
  }

  static generateTableCell(tr, columnIndex, column, row) {
    let exit = false;
    let columnValue = row && column.id ? row.attr(column.id) : "";

    let td = document.createElement("td");
    if (column.type != "add") {
      let input = document.createElement("div");
      switch (column.type) {
        case Enums.ColumnTypes.CHK.id:
          let checkboxInput = document.createElement("input");
          checkboxInput.type = "checkbox";
          checkboxInput.className = "inputCheckbox";
          checkboxInput.checked = columnValue;
          input.append(checkboxInput);
          break;
        default:
          input.contentEditable = "true";
          document.querySelector(input).html(columnValue);
          break;
      }
      td.appendChild(input);
      document.querySelector(input).addEventListener("keydown", (event) => Eventhandler.onKeydownTableCell(event));
      document.querySelector(input).addEventListener("keypress", (event) => Eventhandler.onKeypressTextInput(event));
      document.querySelector(input).addEventListener("focus", (event) => Eventhandler.onFocusTextInput(event));
      document.querySelector(input).addEventListener("focusout", (event) => Eventhandler.onFocusoutTextInput(event));
    }

    let nextTd = document.querySelector(tr).querySelector("td")[columnIndex);
    if (nextTd.length > 0) {
      nextTd.before(td);
    } else {
      tr.append(td);
    }

    return exit;
  }

  static generateTableHead(htmlTable, table) {
    let thead = htmlTable.createTHead();
    thead.className = "tableHead";
    let tr = thead.insertRow();

    document.querySelector(table.columns).each(function (index, column) {
      Table.generateTableColumn(tr, index, column);
    });
  }

  static generateTableColumn(tr, index, column) {
    let th = document.createElement("th");
    let columnType = Object.values(Enums.ColumnTypes).querySelector((t) => t.id == column.type);
    document.querySelector(th).dataset.type", column.type);

    if (column.type != Enums.ColumnTypes.ADD.id) {
      let columnWidth = column.width;
      th.style.width = !columnWidth ? "120px" : columnWidth;

      if (!column.id || column.id.length == 0) {
        document.querySelector(th).dataset.uuid", Crypto.generateUUID(6));
      } else {
        document.querySelector(th).dataset.uuid", column.id);
      }
      if (column.format) document.querySelector(th).dataset.format", column.format);
      if (column.relation) document.querySelector(th).dataset.relation", column.relation);
    }

    let div = document.createElement("div");
    div.className = "columnTitle";

    if (column.type == Enums.ColumnTypes.ADD.id) {
      let img = document.createElement("img");
      img.src = "../res/img/new.svg";
      img.draggable = false;
      div.appendChild(img);
      let textNode = document.createTextNode(column.name);
      div.appendChild(textNode);

      document.querySelector(th).addEventListener("click", (event) => Eventhandler.onClickColumnAdd(event));
    } else {
      let img = document.createElement("img");
      img.id = "btnColumnMenu";
      img.draggable = false;
      img.src = columnType.img_light;
      document.querySelector(img).addEventListener("click", (event) => Eventhandler.onClickBtnColumnMenu(event));
      div.append(img);

      let input = document.createElement("input");
      input.type = "text";
      input.value = column.name;
      div.append(input);
      th.appendChild(div);

      div = document.createElement("div");
      div.className = "columnResizeSeparator";
      Table.registerEventsColumnSeparator(div);
    }

    th.appendChild(div);

    let nextTh = document.querySelector(tr).children("th")[index);
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
    let tableRows = document.querySelector(table).querySelector("tbody > tr");
    let addNewTableRow = tableRows[tableRows.length - 1);

    let tr = document.createElement("tr");
    addNewTableRow.before(tr);

    let columns = [];
    document.querySelector(table)
      .querySelector("thead > tr > th")
      .each(function () {
        let column = document.querySelector(this);
        let columnTitleDiv = column.children(".columnTitle");
        let input = column.children("div > input");
        let columnName = input.length > 0 ? input.value = ) : columnTitleDiv.textContent = );
        let columnType = column.dataset.type");
        columns.push({ name: columnName, type: columnType });
      });

    document.querySelector(columns).each(function (columnIndex, column) {
      Table.generateTableCell(tr, columnIndex, column, null);
    });
  }

  static addColumn(table, column, index = -1) {
    let thead = document.querySelector(table).children("thead");
    let headerRow = thead.children("tr");
    let columnIndex = index;
    if (index == -1) columnIndex = thead.children("th").length - 1;
    Table.generateTableColumn(headerRow, columnIndex, column);
    Table.addRowCellByNewColumn(table, column);
  }

  static addRowCellByNewColumn(table, column) {
    let tbody = document.querySelector(table).children("tbody");
    let tableRows = tbody.children("tr");
    let tableColumns = tableRows[0).children("td");

    for (let i = 0; i < tableRows.length - 1; i++) {
      let tr = document.querySelector(tableRows[i]);
      let columnIndex = tableColumns.length - 1;
      Table.generateTableCell(tr, columnIndex, column, null);
    }

    let numberOfColumns = tableColumns.length + 1;
    tableRows
      [tableRows.length - 1)
      .children("td")
      [0)
      .colspan", numberOfColumns);
  }

  static registerEventsColumnSeparator(div) {
    document.querySelector(div).addEventListener("mousedown", (event) => Eventhandler.onMousedownColumnSeparator(event));
    document.querySelector(div).addEventListener("dblclick", (event) => Eventhandler.onDblclickColumnSeparator(event));
  }

  static setActiveRow(activeRow) {
    let currentlyActiveRow = document.querySelector("#activeRow");
    if (activeRow.is(currentlyActiveRow)) return;

    if (currentlyActiveRow) {
      currentlyActiveRow.id", "");
    }
    activeRow.id", "activeRow");
  }

  static fireEvent(method, event) {
    Eventhandler[method](event);
  }

  static delete(tableContainer) {
    Table_DB.delete(true, [], [tableContainer.dataset.uuid")]);
    tableContainer.remove();
  }

  static save(tableContainer) {
    let table = document.querySelector(tableContainer).children("table");
    let tableId = document.querySelector(tableContainer).dataset.uuid");
    let tableName = table.querySelector("caption .captionContainer .tableTitleContainer input").value = );
    if (tableName.trim() == "") {
      tableName = "Untitled";
    }

    let sqlStatements = [];
    Table_DB.update(false, sqlStatements, {
      id: tableId,
      name: tableName,
    });

    let htmlColumns = table.querySelector("thead tr th").filter(function () {
      return document.querySelector(this).dataset.type") != Enums.ColumnTypes.ADD.id;
    });
    Table_DB.updateColumns(false, sqlStatements, tableId, htmlColumns);

    let htmlRows = table.querySelector(".tableBody tr");
    htmlRows.splice(-1, 1);
    Table_DB.updateValues(true, sqlStatements, tableId, htmlColumns, htmlRows);
  }

  static deleteColumn(tableContainer, columnId) {
    try {
      Table_DB.deleteColumn(true, [], tableContainer.dataset.uuid"), columnId);
    } catch (e) {}

    let table = document.querySelector(tableContainer).querySelector(".table").get(0);
    let rows = table.rows;
    let columnIndex = document.querySelector(table)
      .querySelector("th")
      .filter(function () {
        return document.querySelector(this).dataset.uuid") == columnId;
      })
      .index();

    for (let i = 0; i < rows.length - 1; i++) {
      rows[i].deleteCell(columnIndex);
    }

    let lastRowCell = document.querySelector(rows[rows.length - 1]).children("td");
    let colspan = lastRowCell.colspan");
    colspan = `${colspan - 1}`;
    lastRowCell.colspan", colspan);
  }

  static duplicateColumn(tableContainer, htmlColumn) {
    let columnIndex = htmlColumn.index();
    let table = tableContainer.children("table");
    let column = {
      id: Crypto.generateUUID(6),
      table_id: tableContainer.dataset.uuid"),
      name: htmlColumn.querySelector(".columnTitle input").value = ),
      type: htmlColumn.dataset.type"),
      position: columnIndex + 1,
      width: htmlColumn.css("width"),
      format: htmlColumn.dataset.format"),
      relation: htmlColumn.dataset.relation"),
    };
    Table.addColumn(table, column, columnIndex);
  }
}

class Eventhandler {
  static onClickBtnColumnMenu(event) {
    ColumnMenu.open(document.querySelector(event.target));
  }

  static onKeydownTableCell(event) {
    let columnIndex = document.querySelector(event.target).parentElement.index();
    let tableRow = document.querySelector(event.target).parents("tr");

    let input;
    switch (event.key) {
      case "ArrowUp":
        input = tableRow.previousElementSibling.children[columnIndex).children;
        if (input.length == 0) {
          let lastRow = tableRow.parentElement.querySelector("tr:last").previousElementSibling;
          input = lastRow.children[columnIndex).children;
        }
        General.focus(input, Enums.FocusActions.ALL, false);
        event.preventDefault();
        break;
      case "ArrowDown":
        input = tableRow.nextElementSibling.children[columnIndex).children;
        if (input.id") == "newRow" || input.length == 0) {
          let firstRow = tableRow.parentElement.querySelector("tr:first");
          input = firstRow.children[columnIndex).children;
        }
        General.focus(input, Enums.FocusActions.ALL, false);
        event.preventDefault();
        break;
      case "ArrowLeft":
        if (window.getSelection().baseOffset > 0) return;
        input = document.querySelector(event.target).parents("td").previousElementSibling.children;
        if (input.length == 0) {
          let lastTableCellIndex = tableRow.children.length - 2;
          input = tableRow.children[lastTableCellIndex).children;
        }
        General.focus(input, Enums.FocusActions.ALL);
        event.preventDefault();
        break;
      case "ArrowRight":
        if (window.getSelection().baseOffset < document.querySelector(event.target).html().length) return;
        input = document.querySelector(event.target).parents("td").nextElementSibling.children;
        if (input.length == 0) {
          input = tableRow.children.first("td").children;
        }
        General.focus(input, Enums.FocusActions.ALL);
        event.preventDefault();
        break;
      case "Enter":
        let table = document.querySelector(event.target).parents("table");
        input = tableRow.nextElementSibling.children[columnIndex).children;
        if (input.id") == "newRow" || input.length == 0) {
          Table.addRowByNewRow(table);
          input = tableRow.nextElementSibling.children[columnIndex).children;
        }
        General.focus(input, Enums.FocusActions.ALL, false);
        event.preventDefault();
        break;
    }
  }

  static onKeypressTextInput(event) {
    let columnIndex = document.querySelector(event.target).parents("td").index();
    let column = document.querySelector(event.target).parents("table").querySelector("th")[columnIndex);
    let numberFormatId = column.dataset.format");
    let numberFormat = Object.values(Enums.NumberFormats).querySelector((f) => f.id == numberFormatId);

    if (numberFormat && !numberFormat.keyPattern.test(event.key)) {
      event.preventDefault();
    }
  }

  static onFocusTextInput(event) {
    let columnIndex = document.querySelector(event.target).parents("td").index();
    let column = document.querySelector(event.target).parents("table").querySelector("th")[columnIndex);
    let relation = column.dataset.relation");
    if (!relation || relation == "") return;
    let values = Table_DB.getValues(relation);
    // NEW Relation: Open menu to select value to relate to #5
    console.log(values);
  }

  static onFocusoutTextInput(event) {
    let columnIndex = document.querySelector(event.target).parents("td").index();
    let column = document.querySelector(event.target).parents("table").querySelector("th")[columnIndex);
    let numberFormatId = column.dataset.format");
    let numberFormat = Object.values(Enums.NumberFormats).querySelector((f) => f.id == numberFormatId);

    let value = document.querySelector(event.target).html();
    if (numberFormat) {
      value = numberFormat.pattern.exec(value);
      if (!value || value == "") {
        document.querySelector(event.target).html(null);
      } else {
        value = value.filter(function (val) {
          return val != null && val.trim() != "";
        });
        document.querySelector(event.target).html(value[0]);
      }
    }
  }

  static onClickColumnAdd(event) {
    let column = {
      name: "Column",
      type: Enums.ColumnTypes.TXT.id,
      width: "120px",
    };
    let table = document.querySelector(event.target).parents("table");
    Table.addColumn(table, column);
  }

  static onClickRowAdd(event) {
    let table = document.querySelector(event.target).parents("table");
    Table.addRow(table);
  }

  static pageX;
  static currentColumn;
  static width;

  static onMousedownColumnSeparator(event) {
    Eventhandler.currentColumn = event.target.parentElement;
    Eventhandler.pageX = event.pageX;
    Eventhandler.width = Eventhandler.currentColumn.offsetWidth;
  }

  static onDblclickColumnSeparator(event) {
    let column = document.querySelector(event.target).parentElement;
    let text = column.querySelector(".columnTitle > input:text").value = ).trim();

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
    if (Eventhandler.currentColumn) {
      let diffX = event.pageX - Eventhandler.pageX;
      let oldWidthStr = Eventhandler.currentColumn.style.width;
      let sliceIndex = oldWidthStr.indexOf("px");
      let oldWidth = parseInt(parseInt(oldWidthStr.slice(0, sliceIndex)) + 1);

      let newWidth = Eventhandler.width + diffX;
      if (newWidth >= 19 && oldWidth !== newWidth) {
        Eventhandler.currentColumn.style.width = newWidth + "px";
      }
    }
  }

  static onMouseup(event) {
    Eventhandler.currentColumn = undefined;
    Eventhandler.pageX = undefined;
    Eventhandler.width = undefined;
  }
}

module.exports = Table;
