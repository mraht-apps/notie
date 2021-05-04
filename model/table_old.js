const General = require("../utils/general");

class Table {
  static DEFAULT_TITLE = "Untitled";

  static captionText;
  static columns;
  static rows;

  static create(table) {
    if (!table) {
      table = {
        id: "",
        caption: "",
        columns: [
          { id: "", name: "Name", type: "text", width: "120px" },
          { id: "", name: "Done", type: "checkbox", width: "20px" },
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

    let divContainer = document.createElement("div");
    divContainer.className = "pageElement table";
    if (!table.id || table.id.length == 0) {
      $(divContainer).data("uuid", Crypto.generateUUID(6));
    } else {
      $(divContainer).data("uuid", table.id);
    }
    divContainer.append(htmlTable);

    return divContainer;
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
    captionInput.placeholder = Table.DEFAULT_TITLE;
    tableTitleContainer.appendChild(captionInput);
    captionContainer.appendChild(tableTitleContainer);

    let tableMenuContainer = document.createElement("div");
    tableMenuContainer.className = "tableMenuContainer";
    let menuImg = document.createElement("img");
    menuImg.src = "../res/img/menu.svg";
    tableMenuContainer.appendChild(menuImg);
    Tablemenu.registerEvent(tableMenuContainer);
    captionContainer.appendChild(tableMenuContainer);
    caption.appendChild(captionContainer);

    let tableMenu = document.createElement("div");
    tableMenu.className = "tableMenu";
    let tableMenuTable = document.createElement("table");
    let tr = tableMenuTable.insertRow();
    tr.id = "deleteTable";
    Tablemenu.registerEventMenuItem(tr);
    let td = document.createElement("td");
    let deleteImg = document.createElement("img");
    deleteImg.src = "../res/img/trash.svg";
    td.appendChild(deleteImg);
    let textNode = document.createTextNode("Delete");
    td.appendChild(textNode);
    tr.appendChild(td);
    tableMenu.appendChild(tableMenuTable);
    caption.appendChild(tableMenu);
    table.insertBefore(caption, table.childNodes[0]);
  }

  static prepareGeneration(data) {
    data.columns.push({ name: "New", type: "add" });
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
    $(tr).on("click", function (event) {
      Eventhandler.onClickRowAdd(event);
    });
    let td = document.createElement("td");
    td.colSpan = numberOfColumns;
    let div = document.createElement("div");
    div.className = "newRow";
    let img = document.createElement("img");
    img.src = "../res/img/new.svg";
    img.className = "newImg";
    div.appendChild(img);
    let textNode = document.createTextNode("New");
    div.appendChild(textNode);
    td.appendChild(div);
    tr.append(td);
  }

  static generateTableCell(tr, columnIndex, column, row) {
    let exit = false;
    let columnValue = row && column.id ? row.attr(column.id) : "";
    let columnType = column.type;

    let td = document.createElement("td");
    if (columnType != "add") {
      let input = null;
      switch (columnType) {
        case "checkbox":
          input = document.createElement("input");
          input.type = columnType;
          input.checked = columnValue;
          break;
        case "text":
          input = document.createElement("div");
          input.contentEditable = "true";
          $(input).html(columnValue);
          break;
      }
      td.appendChild(input);

      $(td).on("keydown", function (event) {
        Eventhandler.onKeydownTableCell(event);
      });
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
    $(th).data("type", column.type);
    if (column.type != "add") {
      let columnWidth = column.width;
      th.style.width = !columnWidth ? "120px" : columnWidth;

      if (!column.id || column.id.length == 0) {
        $(th).data("uuid", Crypto.generateUUID(6));
      } else {
        $(th).data("uuid", column.id);
      }
    }

    let div = document.createElement("div");
    div.className = "columnTitle";

    if (column.type == "add") {
      let img = document.createElement("img");
      img.src = "../res/img/new.svg";
      div.appendChild(img);
      let textNode = document.createTextNode(column.name);
      div.appendChild(textNode);

      $(th).on("click", function (event) {
        Eventhandler.onClickColumnAdd(event);
      });
    } else {
      let img = document.createElement("img");
      switch (column.type) {
        case "checkbox":
          img.src = "../res/img/checkbox.svg";
          break;
        case "text":
          img.src = "../res/img/text.svg";
          break;
      }
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

  static addColumn(table, column) {
    let thead = $(table).children("thead");
    let headerRow = thead.children("tr");
    let columnIndex = thead.children("th").length - 1;
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
    let tableName = table
      .find("caption .captionContainer .tableTitleContainer input")
      .val();

    let sqlStatements = [];
    Table_DB.update(false, sqlStatements, {
      id: tableId,
      name: tableName,
    });

    let htmlColumns = table.find("thead tr th").filter(function () {
      return $(this).data("type") != "add";
    });
    Table_DB.updateColumns(false, sqlStatements, tableId, htmlColumns);

    let htmlRows = table.find(".tableBody tr");
    htmlRows.splice(-1, 1);
    Table_DB.updateValues(true, sqlStatements, tableId, htmlColumns, htmlRows);
  }
}

class Eventhandler {
  static onKeydownTableCell(event) {
    var columnIndex = $(event.target).parent().index();

    switch (event.key) {
      case "ArrowDown":
        var input = $(event.target)
          .parents("tr")
          .next()
          .children()
          .eq(columnIndex)
          .children()
          .trigger("focus");
          if(input.is("[contentEditable='true']")) General.selectText();
        event.preventDefault();
        break;
      case "ArrowLeft":
        if (window.getSelection().baseOffset > 0) return;
        var input = $(event.target).parents("td").prev().children();
        if (input.length == 0) {
          input = $(event.target)
            .parents("tr")
            .children()
            .eq($(event.target).parents("tr").children().length - 2)
            .children();
        }
        input.trigger("focus");
        input.is("[contentEditable='true']") ? General.selectText() : General.deselectText();
        event.preventDefault();
        break;
      case "ArrowRight":
        if (window.getSelection().baseOffset < $(event.target).html().length)
          return;
        var input = $(event.target).parents("td").next().children();
        if (input.length == 0) {
          input = $(event.target)
            .parents("tr")
            .children()
            .first("td")
            .children();
        }
        input.trigger("focus");
        input.is("[contentEditable='true']") ? General.selectText() : General.deselectText();
        event.preventDefault();
        break;
      case "ArrowUp":
        var input = $(event.target)
          .parents("tr")
          .prev()
          .children()
          .eq(columnIndex)
          .children()
          .trigger("focus");
          if(input.is("[contentEditable='true']")) General.selectText();
        event.preventDefault();
        break;
    }
  }

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
