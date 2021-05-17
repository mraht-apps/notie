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

  static initColumnType() {
    let id = Eventhandler.selectedColumn.data("type");
    let formatId = Eventhandler.selectedColumn.data("format");
    let format = Object.values(Enums.NumberFormats).find((t) => t.id == formatId);
    let relationId = Eventhandler.selectedColumn.data("relation");
    let relation = Table_DB.get(relationId);

    ColumnMenu.setColumnType(id, format, relation);
  }

  static setColumnType(id, format, relation) {
    let columnType = Object.values(Enums.ColumnTypes).find((t) => t.id == id);

    let columnTypeValue = $("#columnTypeValue");
    columnTypeValue.html(null);
    $(columnTypeValue).data("type", columnType.id);

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

    if (columnType) {
      Eventhandler.selectedColumn.data("type", columnType.id);
      Eventhandler.selectedColumn.find("#btnColumnMenu").attr("src", columnType.img_light);
    }

    ColumnMenu.setFormat(columnType, format);
    ColumnMenu.setRelation(columnType, relation);

    ColumnMenu.setCellData(columnType);
  }

  static setFormat(columnType, format = Enums.NumberFormats.NUMBER) {
    $("#numberFormat").toggle(false);
    Eventhandler.selectedColumn.data("format", null);

    if (columnType.id != Enums.ColumnTypes.NUM.id) return;
    ColumnMenu.setNumberFormat(format);
    $("#numberFormat").toggle(true);
  }

  static setRelation(columnType, relation = null) {
    $("#tableRelation").toggle(false);
    Eventhandler.selectedColumn.data("relation", null);

    if (columnType.id != Enums.ColumnTypes.REL.id) return;
    ColumnMenu.setTableRelation(relation);
    $("#tableRelation").toggle(true);
  }

  static setNumberFormat(format) {
    $("#numberFormatValue span").text(format.descr);
    $("#numberFormatValue").data("format", format.id);
    Eventhandler.selectedColumn.data("format", format.id);
  }

  static setTableRelation(tableRelation = { id: null, name: null }) {
    $("#tableRelationValue").removeClass("error");
    $("#tableRelationValue span").text(tableRelation.name);
    Eventhandler.selectedColumn.data("relation", tableRelation.id);
  }

  static setCellData(columnType) {
    let columnIndex = Eventhandler.selectedColumn.index();
    let cells = [];
    $(Eventhandler.selectedTable)
      .find("tbody tr")
      .each(function (index, row) {
        cells.push($(row).find("td").eq(columnIndex));
      });
    $(cells).each((index, cell) => {
      // OPT Encapsulate source code
      let input = $(cell).find("div");
      switch (columnType) {
        case Enums.ColumnTypes.CHK:
          if (input.children("input").length == 0) {
            let checkboxInput = document.createElement("input");
            checkboxInput.type = "checkbox";
            checkboxInput.className = "inputCheckbox";
            input.append(checkboxInput);
            input.prop("contentEditable", "false");
          }
          break;
        default:
          input.children("input").remove();
          input.prop("contentEditable", "true");
      }
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
    ColumnMenu.initColumnType();

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
      TableSearchMenu.open(Eventhandler.selectedTable);
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
