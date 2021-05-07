const Table = require("../../model/table");
const ColumnTypeMenu = require("./columnTypeMenu");

class ColumnMenu {
  static init() {
    ColumnMenu.registerEvents();
  }

  static registerEvents() {
    $("#columnTypeValue").on("click", (event) => Eventhandler.onClickColumnTypeValue(event));
    $("#btnColumnMenuDelete").on("click", (event) => Eventhandler.onClickBtnDelete(event));
    $("#btnColumnMenuSave").on("click", (event) => Eventhandler.onClickBtnSave(event));
  }

  static create(columnType) {
    let selectedColumnType;
    for (let element of Object.keys(Enums.ColumnTypes)) {
      if (columnType == Enums.ColumnTypes[element].id) {
        selectedColumnType = Enums.ColumnTypes[element];
        break;
      }
    }

    $("#numberFormat").toggle(false);
    $("#tableRelation").toggle(false);

    let columnTypeValue = $("#columnTypeValue");
    columnTypeValue.html(null);
    $(columnTypeValue).data("type", selectedColumnType.id);

    let img = document.createElement("img");
    img.src = selectedColumnType.img;
    img.draggable = false;
    columnTypeValue.append(img);
    let text = document.createTextNode(selectedColumnType.descr);
    columnTypeValue.append(text);
    img = document.createElement("img");
    img.src = "../res/img/arrow_down.svg";
    img.draggable = false;
    columnTypeValue.append(img);

    switch (columnType) {
      case Enums.ColumnTypes.REL.id:
        $("#tableRelation").toggle(true);
        break;
    }
  }

  static isOpen() {
    return $("#columnMenu").is(":visible");
  }

  static close(element) {
    if (!ColumnMenu.isOpen() || ColumnMenu.clickedOnMenu(element)) return;
    $("#columnMenu").toggle(false);
    $("#disabledPageContainer").toggle(false);
  }

  static open(element) {
    let btnColumnMenu = element;

    Eventhandler.selectedTable = btnColumnMenu.parents("div.pageElement");
    Eventhandler.selectedColumn = btnColumnMenu.parents("th");

    ColumnMenu.close(btnColumnMenu);
    ColumnMenu.create(Eventhandler.selectedColumn.data("type"));

    let position = $(element).get(0).getBoundingClientRect();
    $("#columnMenu").css({
      top: `${position.top + 25}px`,
      left: `${position.left - 9}px`,
    });
    $("#columnMenu").toggle(true);
    $("#disabledPageContainer").toggle(true);
  }

  static clickedOnMenu(element) {
    if (
      element &&
      (element.attr("id") == "btnColumnMenu" ||
        element.attr("id") == "columnMenu" ||
        element.parents("#columnMenu").length > 0)
    ) {
      return true;
    } else {
      return false;
    }
  }
}

class Eventhandler {
  static selectedTable;
  static selectedColumn;

  static onClickColumnTypeValue(event) {
    let element = $(event.target);
    if (!ColumnTypeMenu.isOpen()) {
      ColumnTypeMenu.open(element, $("#columnTypeValue").data("type"));
    } else {
      ColumnTypeMenu.close();
    }
  }

  static onClickBtnDelete(event) {
    if (!this.selectedTable || !this.selectedColumn) return;
    Table.deleteColumn(this.selectedTable, this.selectedColumn.data("uuid"));
    ColumnMenu.close();
  }

  static onClickBtnSave(event) {
    if (!this.selectedTable || !this.selectedColumn) return;

    ColumnMenu.close();
  }
}

module.exports = ColumnMenu;
