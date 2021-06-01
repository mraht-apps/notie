const Enums = require("./enums.js");
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
    super(jsonData?.id, "table");

    this.initData(jsonData);
    this.prepare();
    this.create();

    this.container.append(this.htmlElement);
  }

  initData(jsonData) {
    if (!jsonData) {
      jsonData = {
        type: Enums.ElementTypes.TABLE.id,
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
    this.htmlElement.insertBefore(caption, this.htmlElement.children[0]);
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

    this.elementData.columns.forEach((column, columnIndex) => {
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
          input.innerHTML = columnValue;
          break;
      }
      td.appendChild(input);
      input.addEventListener("keydown", (event) => Eventhandler.onKeydownTableCell(event));
      input.addEventListener("keypress", (event) => Eventhandler.onKeypressTextInput(event));
      input.addEventListener("focus", (event) => Eventhandler.onFocusTextInput(event));
      input.addEventListener("focusout", (event) => Eventhandler.onFocusoutTextInput(event));
    }

    let nextTd = tr.querySelectorAll("td")[columnIndex];
    if (nextTd) {
      nextTd.before(td);
    } else {
      tr.append(td);
    }

    return exit;
  }

  createRowNewRow() {
    let numberOfColumns = this.elementData.columns.length + 1;
    let tr = this.htmlElement.insertRow();
    tr.onclick = (event) => Eventhandler.onClickRowAdd(event);
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
    let columnType = Object.values(Enums.ColumnTypes).filter((t) => t.id == column.type)[0];
    th.dataset.type = column.type;

    if (column.type != Enums.ColumnTypes.ADD.id) {
      let columnWidth = column.width;
      th.style.width = !columnWidth ? "120px" : columnWidth;

      if (!column.id || column.id.length == 0) {
        th.dataset.uuid = Crypto.generateUUID(6);
      } else {
        th.dataset.uuid = column.id;
      }
      if (column.format) th.dataset.format = column.format;
      if (column.relation) th.dataset.relation = column.relation;
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

      th.addEventListener("click", (event) => Eventhandler.onClickColumnAdd(event));
    } else {
      let img = document.createElement("img");
      img.id = "btnColumnMenu";
      img.draggable = false;
      img.src = columnType.img_light;
      img.addEventListener("click", (event) => Eventhandler.onClickBtnColumnMenu(event));
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

    let nextTh = tr.querySelectorAll("th")[index];
    if (nextTh) {
      nextTh.insertBefore(th);
    } else {
      tr.append(th);
    }
  }

  addRow() {
    this.addRowByNewRow();
  }

  addRowByNewRow() {
    let tableRows = this.htmlElement.querySelectorAll("tbody > tr");
    let addNewTableRow = tableRows[tableRows.length - 1];

    let tr = document.createElement("tr");
    addNewTableRow.before(tr);

    let columns = [];
    document
      .querySelector(this.htmlElement)
      .querySelectorAll("thead > tr > th")
      .forEach((th) => {
        let columnTitleDiv = column.children(".columnTitle");
        let input = th.children("div > input");
        let columnName = input.length > 0 ? input.value : columnTitleDiv.textContent;
        let columnType = th.dataset.type;
        columns.push({ name: columnName, type: columnType });
      });

    columns.forEach((column) => {
      this.createTableCell(tr, columnIndex, column, null);
    });
  }

  addColumn(column, index = -1) {
    let thead = this.htmlElement.querySelector("thead");
    let headerRow = thead.querySelectorAll("tr");
    let columnIndex = index;
    if (index == -1) columnIndex = thead.children("th").length - 1;
    this.createTableColumn(headerRow, columnIndex, column);
    this.addCellByNewColumn(column);
  }

  addCellByNewColumn(column) {
    let tbody = this.htmlElement.children("tbody");
    let tableRows = tbody.querySelectorAll("tr");
    let tableColumns = tableRows[0].children("td");

    for (let i = 0; i < tableRows.length - 1; i++) {
      let tr = tableRows[i];
      let columnIndex = tableColumns.length - 1;
      this.generateTableCell(tr, columnIndex, column, null);
    }

    let numberOfColumns = tableColumns.length + 1;
    tableRows[tableRows.length - 1].querySelector("td").style.colspan = numberOfColumns;
  }

  registerEventsColumnSeparator(div) {
    div.addEventListener("mousedown", (event) => Eventhandler.onMousedownColumnSeparator(event));
    div.addEventListener("dblclick", (event) => Eventhandler.onDblclickColumnSeparator(event));
  }

  setActiveRow(activeRow) {
    let currentlyActiveRow = document.querySelector("#activeRow");
    if (activeRow === currentlyActiveRow) return;

    if (currentlyActiveRow) {
      currentlyActiveRow.id = "";
    }
    activeRow.id = "activeRow";
  }

  static dispatchEvent(method, event) {
    Eventhandler[method](event);
  }

  delete() {
    Table_DB.delete(true, [], [this.container.dataset.uuid]);
    this.container.remove();
    Page.removeElement(this);
  }

  save() {
    let tableId = this.container.dataset.uuid;
    let tableName = this.htmlElement.querySelector("caption .captionContainer .tableTitleContainer input").value;
    if (tableName.trim() == "") {
      tableName = "Untitled";
    }

    let sqlStatements = [];
    Table_DB.update(false, sqlStatements, {
      id: tableId,
      name: tableName,
    });

    let htmlColumns = table.querySelectorAll("thead tr th").filter((th) => {
      return th.dataset.type != Enums.ColumnTypes.ADD.id;
    });
    Table_DB.updateColumns(false, sqlStatements, tableId, htmlColumns);

    let htmlRows = table.querySelectorAll(".tableBody tr");
    htmlRows.splice(-1, 1);
    Table_DB.updateValues(true, sqlStatements, tableId, htmlColumns, htmlRows);
  }

  deleteColumn(columnId) {
    try {
      Table_DB.deleteColumn(true, [], this.container.dataset.uuid, columnId);
    } catch (e) {}

    let rows = this.htmlElement.rows;
    let columnIndex = document
      .querySelector(this.htmlElement)
      .querySelectorAll("th")
      .filter((th) => {
        return th.dataset.uuid == columnId;
      })
      .index();

    for (let i = 0; i < rows.length - 1; i++) {
      rows[i].deleteCell(columnIndex);
    }

    let lastRowCell = rows[rows.length - 1].children("td");
    let colspan = lastRowCell.colspan;
    colspan = `${colspan - 1}`;
    lastRowCell.colspan = colspan;
  }

  duplicateColumn(htmlColumn) {
    let columnIndex = htmlColumn.index();
    let column = {
      id: Crypto.generateUUID(6),
      table_id: this.container.dataset.uuid,
      name: htmlColumn.querySelector(".columnTitle input").value,
      type: htmlColumn.dataset.type,
      position: columnIndex + 1,
      width: htmlColumn.style.width,
      format: htmlColumn.dataset.format,
      relation: htmlColumn.dataset.relation,
    };
    this.addColumn(column, columnIndex);
  }
}

class Eventhandler {
  static onClickBtnColumnMenu(event) {
    ColumnMenu.open(event.target);
  }

  static onKeydownTableCell(event) {
    let columnIndex = General.getParents(event.target.parents).indexOf(event.target.parentNode);
    let tableRow = General.getParents(event.target, "tr");

    let input;
    switch (event.key) {
      case "ArrowUp":
        input = tableRow.previousElementSibling.children[columnIndex].children;
        if (input.length == 0) {
          let lastRow = tableRow.parentElement.querySelector("tr:last-of-type").previousElementSibling;
          input = lastRow.children[columnIndex].children;
        }
        General.focus(input, Enums.FocusActions.ALL, false);
        event.preventDefault();
        break;
      case "ArrowDown":
        input = tableRow.nextElementSibling.children[columnIndex].children;
        if (input.id == "newRow" || input.length == 0) {
          let firstRow = tableRow.parentNode.querySelector("tr:first-of-type");
          input = firstRow.children[columnIndex].children;
        }
        General.focus(input, Enums.FocusActions.ALL, false);
        event.preventDefault();
        break;
      case "ArrowLeft":
        if (window.getSelection().baseOffset > 0) return;
        input = event.target.parents("td").previousElementSibling.children;
        if (input.length == 0) {
          let lastTableCellIndex = tableRow.children.length - 2;
          input = tableRow.children[lastTableCellIndex].children;
        }
        General.focus(input, Enums.FocusActions.ALL);
        event.preventDefault();
        break;
      case "ArrowRight":
        if (window.getSelection().baseOffset < event.target.innerHTML.length) return;
        input = General.getParents(event.target, "td").nextElementSibling.children;
        if (input.length == 0) {
          input = tableRow.children.first("td").children;
        }
        General.focus(input, Enums.FocusActions.ALL);
        event.preventDefault();
        break;
      case "Enter":
        let table = General.getParents(event.target, "table");
        input = tableRow.nextElementSibling.children[columnIndex].children;
        if (input.id == "newRow" || input.length == 0) {
          table.addRowByNewRow();
          input = tableRow.nextSibling.children[columnIndex].children;
        }
        General.focus(input, Enums.FocusActions.ALL, false);
        event.preventDefault();
        break;
    }
  }

  static onKeypressTextInput(event) {
    let columnIndex = General.getParents(event.target, "td").index();
    let column = General.getParents(event.target, "table").querySelector("th")[columnIndex];
    let numberFormatId = column.dataset.format;
    let numberFormat = Object.values(Enums.NumberFormats).querySelector((f) => f.id == numberFormatId);

    if (numberFormat && !numberFormat.keyPattern.test(event.key)) {
      event.preventDefault();
    }
  }

  static onFocusTextInput(event) {
    let table = General.getParents(event.target, "table")[0];
    let tableCell = event.target.parentElement;
    let tableRow = General.getParent(tableCell, "tr");
    let tableCells = tableRow.querySelectorAll("td");

    let columnIndex = Array.prototype.indexOf.call(tableCells, tableCell);
    let column = table.querySelectorAll("th")[columnIndex];
    let relation = column.dataset.relation;
    if (!relation || relation == "") return;
    let values = Table_DB.getValues(relation);
    // NEW Relation: Open menu to select value to relate to #5
    console.log(values);
  }

  static onFocusoutTextInput(event) {
    let columnIndex = General.getParents(event.target, "td").index();
    let column = General.getParents(event.target, "table").querySelector("th")[columnIndex];
    let numberFormatId = column.dataset.format;
    let numberFormat = Object.values(Enums.NumberFormats).querySelector((f) => f.id == numberFormatId);

    let value = event.target.innerHTML;
    if (numberFormat) {
      value = numberFormat.pattern.exec(value);
      if (!value || value == "") {
        event.target.innerHTML = null;
      } else {
        value = value.filter((val) => {
          return val != null && val.trim() != "";
        });
        event.target.innerHTML = value[0];
      }
    }
  }

  static onClickColumnAdd(event) {
    let column = {
      name: "Column",
      type: Enums.ColumnTypes.TXT.id,
      width: "120px",
    };
    let table = General.getParents(event.target, "table");
    table.addColumn(column);
  }

  static onClickRowAdd(event) {
    let table = General.getParents(event.target, "table");
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
    let column = event.target.parentElement;
    let text = column.querySelector(".columnTitle > input:text").value.trim();

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
