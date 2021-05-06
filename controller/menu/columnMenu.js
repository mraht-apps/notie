const Table = require("../../model/table");
const ColumnTypeMenu = require("./columnTypeMenu");

class ColumnMenu {
  static init() {
    ColumnMenu.registerEvents();
  }

  static registerEvents() {
    $("#columnTypeValue").on("click", function (event) {
      Eventhandler.onClickColumnTypeValue(event);
    });

    $("#btnColumnMenuDelete").on("click", function (event) {
      Eventhandler.onClickBtnDelete(event);
    });

    $("#btnColumnMenuSave").on("click", function (event) {
      Eventhandler.onClickBtnSave(event);
    });
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
      let columnType = Eventhandler.selectedColumn.data("type");
      ColumnTypeMenu.open(element, columnType);
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
