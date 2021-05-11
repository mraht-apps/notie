class ColumnMenu {
  static init() {
    ColumnMenu.registerEvents();
  }

  static registerEvents() {
    $("#columnTypeValue").on("click", (event) => Eventhandler.onClickColumnTypeValue(event));
    $("#numberFormatValue").on("click", (event) => Eventhandler.onClickNumberFormatValue(event));
    $("#tableRelationValue").on("click", (event) => Eventhandler.onClickTableRelationValue(event));

    $("#deleteColumn").on("click", (event) => Eventhandler.onClickDeleteColumn(event));
    $("#duplicateColumn").on("click", (event) => Eventhandler.onClickDuplicateColumn(event));
  }

  static setColumnType(id) {
    let columnTypeValue = $("#columnTypeValue");
    columnTypeValue.html(null);
    $(columnTypeValue).data("type", id);

    let columnType = Object.values(Enums.ColumnTypes).find((t) => t.id == id);

    let img = document.createElement("img");
    img.src = columnType.img;
    img.draggable = false;
    columnTypeValue.append(img);
    let text = document.createTextNode(columnType.descr);
    columnTypeValue.append(text);
    img = document.createElement("img");
    img.src = "../res/img/arrow_down.svg";
    img.draggable = false;
    columnTypeValue.append(img);

    $("#numberFormat").toggle(false);
    $("#tableRelation").toggle(false);

    switch (columnType) {
      case Enums.ColumnTypes.REL:
        $(tableRelationValue).find("span").text(null);
        $("#tableRelation").toggle(true);
        break;
      case Enums.ColumnTypes.NUM:
        ColumnMenu.setNumberFormat(Enums.NumberFormats.NUMBER.id);
        $("#numberFormat").toggle(true);
        break;
    }
  }

  static setNumberFormat(id) {
    let numberFormat = Object.values(Enums.NumberFormats).find((f) => f.id == id);
    $("#numberFormatValue span").text(numberFormat.descr);
    $("#numberFormatValue").data("format", numberFormat.id);

    Eventhandler.selectedColumn.data("type", Enums.ColumnTypes.NUM.id);
    Eventhandler.selectedColumn.data("format", numberFormat.id);
    Eventhandler.selectedColumn.find("#btnColumnMenu").attr("src", Enums.ColumnTypes.NUM.img_light);
  }

  static setTableRelation(tableRelation) {
    $("#tableRelationValue").removeClass("error");
    $("#tableRelationValue span").text(tableRelation.name);
    Eventhandler.selectedColumn.data("relation", tableRelation.id);
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
    if (!ColumnTypeMenu.isOpen()) {
      ColumnTypeMenu.open($("#columnTypeValue").data("type"));
    } else {
      ColumnTypeMenu.close();
    }
  }

  static onClickNumberFormatValue(event) {
    if (!NumberFormatMenu.isOpen()) {
      NumberFormatMenu.open($("#numberFormatValue").data("format"));
    } else {
      NumberFormatMenu.close();
    }
  }

  static onClickTableRelationValue(event) {
    if (!TableSearchMenu.isOpen()) {
      TableSearchMenu.open();
    } else {
      TableSearchMenu.close();
    }
  }

  static onClickDeleteColumn(event) {
    Table.deleteColumn(this.selectedTable, this.selectedColumn.data("uuid"));
    ColumnMenu.close();
  }

  static onClickDuplicateColumn(event) {
    Table.duplicateColumn(this.selectedTable, this.selectedColumn);
    ColumnMenu.close();
  }
}

module.exports = ColumnMenu;
