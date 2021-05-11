class ColumnMenu {
  static init() {
    ColumnMenu.registerEvents();
  }

  static registerEvents() {
    $("#columnTypeValue").on("click", (event) => Eventhandler.onClickColumnTypeValue(event));
    $("#tableRelationValue").on("click", (event) => Eventhandler.onClickTableRelationValue(event));
    $("#deleteColumn").on("click", (event) => Eventhandler.onClickDeleteColumn(event));
  }

  static setColumnType(columnType) {
    let selectedColumnType;
    for (let element of Object.keys(Enums.ColumnTypes)) {
      if (columnType == Enums.ColumnTypes[element].id) {
        selectedColumnType = Enums.ColumnTypes[element];
        break;
      }
    }

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

    $("#numberFormat").toggle(false);
    $("#tableRelation").toggle(false);

    switch (columnType) {
      case Enums.ColumnTypes.REL.id:
        $(tableRelationValue).find("span").text(null);
        $("#tableRelation").toggle(true);
        break;
      case Enums.ColumnTypes.NUM.id:
        $("#numberFormat").toggle(true);
        break;
    }
  }

  static setTableRelation(tableRelation) {
    $("#tableRelationValue").removeClass("error");
    let span = $(tableRelationValue).find("span");
    span.text(tableRelation.name);

    let columnType = $("#columnTypeValue").data("type");

    console.log(`Type: ${columnType}, Table: ${tableRelation.id}`);
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
    ColumnMenu.setColumnType(Eventhandler.selectedColumn.data("type"));

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

  static onClickTableRelationValue(event) {
    let element = $(event.target);
    if (!TableSearchMenu.isOpen()) {
      TableSearchMenu.open();
    } else {
      TableSearchMenu.close();
    }
  }

  static onClickDeleteColumn(event) {
    if (!this.selectedTable || !this.selectedColumn) return;
    Table.deleteColumn(this.selectedTable, this.selectedColumn.data("uuid"));
    ColumnMenu.close();
  }
}

module.exports = ColumnMenu;
