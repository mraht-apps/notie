const Enums = require("../model/enums.js");
const General = require("../utils/general.js");

class Table extends Blockelement {
  static createByPageId(pageId) {
    let htmlElements = [];
    let tables = Table_DB.getByPageId(pageId);
    let tableColumns = Table_DB.getColumns(tables);

    tables.forEach((table) => {
      let columns = tableColumns.filter((column) => {
        return column.table_id == table.id;
      });

      let values = Table_DB.getValues(table.id);

      let rows = [];
      values.forEach((value) => {
        let row = {};
        columns.forEach((column) => {
          let cellValue = value[column.id];
          if (column.type == Enums.ColumnTypes.CHK.id) {
            cellValue = cellValue == "true";
          }
          row[column.id] = cellValue;
        });
        rows.push(row);
      });

      let htmlElement = new Table({
        id: table.id,
        caption: table.name,
        columns: columns,
        rows: rows,
      });
      htmlElements.push(htmlElement);
    });

    return htmlElements;
  }

  constructor(jsonData) {
    super(jsonData.id, "table");

    this.initData(jsonData);
    this.prepare();
    this.create();

    this.container.append(this.htmlElement);
  }

  initData(jsonData) {
    if (!jsonData) {
      jsonData = {
        id: "",
        caption: "",
        columns: [
          { id: "", name: "Name", type: Enums.ColumnTypes.TXT.id, width: "120px" },
          { id: "", name: "Done", type: Enums.ColumnTypes.CHK.id, width: "20px" },
        ],
        rows: [
          { Name: "", Done: false },
          { Name: "", Done: false },
          { Name: "", Done: false },
        ],
      };
    }
    this.elementData = jsonData;
  }

  prepare() {
    this.elementData.columns.push({ name: "New", type: Enums.ColumnTypes.ADD.id });
  }

  create() {
    if (!this.elementData) return;
    this.htmlElement = document.createElement("table");
    this.htmlElement.className = "table";

    this.createCaption();
    this.createTableBody();
    this.createTableHead();
  }

  createCaption() {
    let caption = document.createElement("caption");

    let captionContainer = document.createElement("div");
    captionContainer.className = "captionContainer";

    let tableTitleContainer = document.createElement("div");
    tableTitleContainer.className = "tableTitleContainer";
    let captionInput = document.createElement("input");
    captionInput.type = "text";
    captionInput.value = this.elementData.caption;
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
    this.htmlElement.insertBefore(caption, this.htmlElement.childNodes[0]);
  }

  createTableBody() {
    if (this.htmlElement.querySelector("tbody")) this.htmlElement.querySelector("tbody").clear();
    this.createRows();
    this.createRowNewRow();
    this.htmlElement.querySelector("tbody").classList.add("tableBody");
  }

  createRows() {
    this.elementData.rows.forEach((row) => {
      this.createRow(row);
    });
  }

  createRow(row) {
    let tr = this.htmlElement.insertRow();
    tr.dataset.uuid = Crypto.generateUUID(6);

    this.elementData.columns.forEach((columnIndex, column) => {
      let exit = this.createTableCell(tr, columnIndex, column, row);
      if (exit) return false;
    });
  }

  createTableCell(tr, columnIndex, column, row) {
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

  createRowNewRow() {
    let numberOfColumns = this.elementData.columns.length + 1;
    let tr = this.htmlElement.insertRow();
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

  createTableHead() {
    let thead = this.htmlElement.createTHead();
    thead.className = "tableHead";
    let tr = thead.insertRow();

    this.elementData.columns.forEach((column, index) => {
      this.createTableColumn(tr, index, column);
    });
  }

  createTableColumn(tr, index, column) {
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
      this.registerEventsColumnSeparator(div);
    }

    th.appendChild(div);

    let nextTh = $(tr).children("th").eq(index);
    if (nextTh.length > 0) {
      nextTh.before(th);
    } else {
      tr.appendChild(th);
    }
  }

  addRow() {
    this.addRowByNewRow();
  }

  addRowByNewRow() {
    let tableRows = $(this.htmlElement).find("tbody > tr");
    let addNewTableRow = tableRows.eq(tableRows.length - 1);

    let tr = document.createElement("tr");
    addNewTableRow.before(tr);

    let columns = [];
    $(this.htmlElement)
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
      this.createTableCell(tr, columnIndex, column, null);
    });
  }

  addColumn(column, index = -1) {
    let thead = $(this.htmlElement).children("thead");
    let headerRow = thead.children("tr");
    let columnIndex = index;
    if (index == -1) columnIndex = thead.children("th").length - 1;
    this.createTableColumn(headerRow, columnIndex, column);
    this.addCellByNewColumn(column);
  }

  addCellByNewColumn(column) {
    let tbody = $(this.htmlElement).children("tbody");
    let tableRows = tbody.children("tr");
    let tableColumns = tableRows.eq(0).children("td");

    for (let i = 0; i < tableRows.length - 1; i++) {
      let tr = $(tableRows[i]);
      let columnIndex = tableColumns.length - 1;
      this.generateTableCell(tr, columnIndex, column, null);
    }

    let numberOfColumns = tableColumns.length + 1;
    tableRows
      .eq(tableRows.length - 1)
      .children("td")
      .eq(0)
      .attr("colspan", numberOfColumns);
  }

  registerEventsColumnSeparator(div) {
    $(div).on("mousedown", (event) => Eventhandler.onMousedownColumnSeparator(event));
    $(div).on("dblclick", (event) => Eventhandler.onDblclickColumnSeparator(event));
  }

  setActiveRow(activeRow) {
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

  delete() {
    Table_DB.delete(true, [], [this.container.data("uuid")]);
    this.container.remove();
  }

  save() {
    let tableId = $(this.container).data("uuid");
    let tableName = this.htmlElement.find("caption .captionContainer .tableTitleContainer input").val();
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

  deleteColumn(columnId) {
    try {
      Table_DB.deleteColumn(true, [], this.container.data("uuid"), columnId);
    } catch (e) {}

    let rows = this.htmlElement.rows;
    let columnIndex = $(this.htmlElement)
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

  duplicateColumn(htmlColumn) {
    let columnIndex = htmlColumn.index();
    let column = {
      id: Crypto.generateUUID(6),
      table_id: this.container.data("uuid"),
      name: htmlColumn.find(".columnTitle input").val(),
      type: htmlColumn.data("type"),
      position: columnIndex + 1,
      width: htmlColumn.css("width"),
      format: htmlColumn.data("format"),
      relation: htmlColumn.data("relation"),
    };
    this.addColumn(column, columnIndex);
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
          table.addRowByNewRow();
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
    table.addColumn(column);
  }

  static onClickRowAdd(event) {
    let table = $(event.target).parents("table");
    table.addRow();
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
