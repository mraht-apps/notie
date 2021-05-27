const Enums = require("../model/enums.js");
const General = require("../utils/general.js");

class Table {
  static createByPageId(pageId) {
    let htmlElements = [];
    let tables = Table_DB.getByPageId(pageId);
    let tableColumns = Table_DB.getColumns(tables);

    $(tables).each(function (index, table) {
      let columns = $(tableColumns).filter(function () {
        return this.table_id == table.id;
      });

      let values = Table_DB.getValues(table.id);

      let rows = [];
      $(values).each(function (index, value) {
        let row = {};
        $(columns).each(function (index, column) {
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

  static create(table) {
    if (!table) {
      table = {
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

    let htmlTable = document.createElement("table");
    htmlTable.className = "table";
    Table.createCaption(htmlTable, table.caption);

    Table.prepareGeneration(table);
    Table.generateTableBody(htmlTable, table);
    Table.generateTableHead(htmlTable, table);

    let htmlElement = document.createElement("div");
    htmlElement.className = "pageElement table";
    if (!table.id || table.id.length == 0) {
      $(htmlElement).data("uuid", Crypto.generateUUID(6));
    } else {
      $(htmlElement).data("uuid", table.id);
    }
    htmlElement.append(htmlTable);

    return htmlElement;
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
    let menuImg = document.createElement("img");
    menuImg.src = "../res/img/menu.svg";
    menuImg.id = "btnTableMenu";
    menuImg.draggable = false;
    tableMenuContainer.appendChild(menuImg);
    TableMenu.registerEvent(tableMenuContainer);
    captionContainer.appendChild(tableMenuContainer);
    caption.appendChild(captionContainer);
    table.insertBefore(caption, table.childNodes[0]);
  }

  static prepareGeneration(data) {
    data.columns.push({ name: "New", type: Enums.ColumnTypes.ADD.id });
  }

  static generateTableBody(table, data) {
    $(data.rows).each(function () {
      Table.generateTableRow(table, data, $(this));
    });
    Table.generateTableRowNew(table, data);
    $(table).children("tbody").addClass("tableBody");
  }

  static generateTableRow(table, data, row) {
    let tr = table.insertRow();
    $(tr).data("uuid", Crypto.generateUUID(6));

    $(data.columns).each(function (columnIndex, column) {
      let exit = Table.generateTableCell(tr, columnIndex, column, row);
      if (exit) return false;
    });
  }

  static generateTableRowNew(table, data) {
    let numberOfColumns = data.columns.length + 1;
    let tr = table.insertRow();
    $(tr).on("click", (event) => Eventhandler.onClickRowAdd(event));
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
          $(input).html(columnValue);
          break;
      }
      td.appendChild(input);
      $(input).on("keydown", (event) => Eventhandler.onKeydownTableCell(event));
      $(input).on("keypress", (event) => Eventhandler.onKeypressTextInput(event));
      $(input).on("focus", (event) => Eventhandler.onFocusTextInput(event));
      $(input).on("focusout", (event) => Eventhandler.onFocusoutTextInput(event));
    }

    let nextTd = $(tr).find("td").eq(columnIndex);
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

    $(table.columns).each(function (index, column) {
      Table.generateTableColumn(tr, index, column);
    });
  }

  static generateTableColumn(tr, index, column) {
    let th = document.createElement("th");
    let columnType = Object.values(Enums.ColumnTypes).find((t) => t.id == column.type);
    $(th).data("type", column.type);

    if (column.type != Enums.ColumnTypes.ADD.id) {
      let columnWidth = column.width;
      th.style.width = !columnWidth ? "120px" : columnWidth;

      if (!column.id || column.id.length == 0) {
        $(th).data("uuid", Crypto.generateUUID(6));
      } else {
        $(th).data("uuid", column.id);
      }
      if (column.format) $(th).data("format", column.format);
      if (column.relation) $(th).data("relation", column.relation);
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

      $(th).on("click", (event) => Eventhandler.onClickColumnAdd(event));
    } else {
      let img = document.createElement("img");
      img.id = "btnColumnMenu";
      img.draggable = false;
      img.src = columnType.img_light;
      $(img).on("click", (event) => Eventhandler.onClickBtnColumnMenu(event));
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
    let tableRows = $(table).find("tbody > tr");
    let addNewTableRow = tableRows.eq(tableRows.length - 1);

    let tr = document.createElement("tr");
    addNewTableRow.before(tr);

    let columns = [];
    $(table)
      .find("thead > tr > th")
      .each(function () {
        let column = $(this);
        let columnTitleDiv = column.children(".columnTitle");
        let input = column.children("div > input");
        let columnName = input.length > 0 ? input.val() : columnTitleDiv.text();
        let columnType = column.data("type");
        columns.push({ name: columnName, type: columnType });
      });

    $(columns).each(function (columnIndex, column) {
      Table.generateTableCell(tr, columnIndex, column, null);
    });
  }

  static addColumn(table, column, index = -1) {
    let thead = $(table).children("thead");
    let headerRow = thead.children("tr");
    let columnIndex = index;
    if (index == -1) columnIndex = thead.children("th").length - 1;
    Table.generateTableColumn(headerRow, columnIndex, column);
    Table.addRowCellByNewColumn(table, column);
  }

  static addRowCellByNewColumn(table, column) {
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
    $(div).on("mousedown", (event) => Eventhandler.onMousedownColumnSeparator(event));
    $(div).on("dblclick", (event) => Eventhandler.onDblclickColumnSeparator(event));
  }

  static setActiveRow(activeRow) {
    let currentlyActiveRow = $("#activeRow");
    if (activeRow.is(currentlyActiveRow)) return;

    if (currentlyActiveRow) {
      currentlyActiveRow.attr("id", "");
    }
    activeRow.attr("id", "activeRow");
  }

  static trigger(method, event) {
    Eventhandler[method](event);
  }

  static delete(tableContainer) {
    Table_DB.delete(true, [], [tableContainer.data("uuid")]);
    tableContainer.remove();
  }

  static save(tableContainer) {
    let table = $(tableContainer).children("table");
    let tableId = $(tableContainer).data("uuid");
    let tableName = table.find("caption .captionContainer .tableTitleContainer input").val();
    if (tableName.trim() == "") {
      tableName = "Untitled";
    }

    let sqlStatements = [];
    Table_DB.update(false, sqlStatements, {
      id: tableId,
      name: tableName,
    });

    let htmlColumns = table.find("thead tr th").filter(function () {
      return $(this).data("type") != Enums.ColumnTypes.ADD.id;
    });
    Table_DB.updateColumns(false, sqlStatements, tableId, htmlColumns);

    let htmlRows = table.find(".tableBody tr");
    htmlRows.splice(-1, 1);
    Table_DB.updateValues(true, sqlStatements, tableId, htmlColumns, htmlRows);
  }

  static deleteColumn(tableContainer, columnId) {
    try {
      Table_DB.deleteColumn(true, [], tableContainer.data("uuid"), columnId);
    } catch (e) {}

    let table = $(tableContainer).find(".table").get(0);
    let rows = table.rows;
    let columnIndex = $(table)
      .find("th")
      .filter(function () {
        return $(this).data("uuid") == columnId;
      })
      .index();

    for (let i = 0; i < rows.length - 1; i++) {
      rows[i].deleteCell(columnIndex);
    }

    let lastRowCell = $(rows[rows.length - 1]).children("td");
    let colspan = lastRowCell.attr("colspan");
    colspan = `${colspan - 1}`;
    lastRowCell.attr("colspan", colspan);
  }

  static duplicateColumn(tableContainer, htmlColumn) {
    let columnIndex = htmlColumn.index();
    let table = tableContainer.children("table");
    let column = {
      id: Crypto.generateUUID(6),
      table_id: tableContainer.data("uuid"),
      name: htmlColumn.find(".columnTitle input").val(),
      type: htmlColumn.data("type"),
      position: columnIndex + 1,
      width: htmlColumn.css("width"),
      format: htmlColumn.data("format"),
      relation: htmlColumn.data("relation"),
    };
    Table.addColumn(table, column, columnIndex);
  }
}

class Eventhandler {
  static onClickBtnColumnMenu(event) {
    ColumnMenu.open($(event.target));
  }

  static onKeydownTableCell(event) {
    let columnIndex = $(event.target).parent().index();
    let tableRow = $(event.target).parents("tr");

    let input;
    switch (event.key) {
      case "ArrowUp":
        input = tableRow.prev().children().eq(columnIndex).children();
        if (input.length == 0) {
          let lastRow = tableRow.parent().find("tr:last").prev();
          input = lastRow.children().eq(columnIndex).children();
        }
        General.focus(input, Enums.FocusActions.ALL, false);
        event.preventDefault();
        break;
      case "ArrowDown":
        input = tableRow.next().children().eq(columnIndex).children();
        if (input.attr("id") == "newRow" || input.length == 0) {
          let firstRow = tableRow.parent().find("tr:first");
          input = firstRow.children().eq(columnIndex).children();
        }
        General.focus(input, Enums.FocusActions.ALL, false);
        event.preventDefault();
        break;
      case "ArrowLeft":
        if (window.getSelection().baseOffset > 0) return;
        input = $(event.target).parents("td").prev().children();
        if (input.length == 0) {
          let lastTableCellIndex = tableRow.children().length - 2;
          input = tableRow.children().eq(lastTableCellIndex).children();
        }
        General.focus(input, Enums.FocusActions.ALL);
        event.preventDefault();
        break;
      case "ArrowRight":
        if (window.getSelection().baseOffset < $(event.target).html().length) return;
        input = $(event.target).parents("td").next().children();
        if (input.length == 0) {
          input = tableRow.children().first("td").children();
        }
        General.focus(input, Enums.FocusActions.ALL);
        event.preventDefault();
        break;
      case "Enter":
        let table = $(event.target).parents("table");
        input = tableRow.next().children().eq(columnIndex).children();
        if (input.attr("id") == "newRow" || input.length == 0) {
          Table.addRowByNewRow(table);
          input = tableRow.next().children().eq(columnIndex).children();
        }
        General.focus(input, Enums.FocusActions.ALL, false);
        event.preventDefault();
        break;
    }
  }

  static onKeypressTextInput(event) {
    let columnIndex = $(event.target).parents("td").index();
    let column = $(event.target).parents("table").find("th").eq(columnIndex);
    let numberFormatId = column.data("format");
    let numberFormat = Object.values(Enums.NumberFormats).find((f) => f.id == numberFormatId);

    if (numberFormat && !numberFormat.keyPattern.test(event.key)) {
      event.preventDefault();
    }
  }

  static onFocusTextInput(event) {
    let columnIndex = $(event.target).parents("td").index();
    let column = $(event.target).parents("table").find("th").eq(columnIndex);
    let relation = column.data("relation");
    if (!relation || relation == "") return;
    let values = Table_DB.getValues(relation);
    // NEW Relation: Open menu to select value to relate to #5
    console.log(values);
  }

  static onFocusoutTextInput(event) {
    let columnIndex = $(event.target).parents("td").index();
    let column = $(event.target).parents("table").find("th").eq(columnIndex);
    let numberFormatId = column.data("format");
    let numberFormat = Object.values(Enums.NumberFormats).find((f) => f.id == numberFormatId);

    let value = $(event.target).html();
    if (numberFormat) {
      value = numberFormat.pattern.exec(value);
      if (!value || value == "") {
        $(event.target).html(null);
      } else {
        value = value.filter(function (val) {
          return val != null && val.trim() != "";
        });
        $(event.target).html(value[0]);
      }
    }
  }

  static onClickColumnAdd(event) {
    let column = {
      name: "Column",
      type: Enums.ColumnTypes.TXT.id,
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
    Eventhandler.currentColumn = event.target.parentElement;
    Eventhandler.pageX = event.pageX;
    Eventhandler.width = Eventhandler.currentColumn.offsetWidth;
  }

  static onDblclickColumnSeparator(event) {
    let column = $(event.target).parent();
    let text = column.find(".columnTitle > input:text").val().trim();

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
