class ColumnMenu {
  static init() {
    ColumnMenu.registerEvents();
  }

  static registerEvents() {
    document
      .querySelector("#columnTypeValue")
      .addEventListener("click", (event) => Eventhandler.onClickColumnTypeValue(event));
    document
      .querySelector("#numberFormatValue")
      .addEventListener("click", (event) => Eventhandler.onClickNumberFormatValue(event));
    document
      .querySelector("#tableRelationValue")
      .addEventListener("click", (event) => Eventhandler.onClickTableRelationValue(event));

    document
      .querySelector("#deleteColumn")
      .addEventListener("click", (event) => Eventhandler.onClickDeleteColumn(event));
    document
      .querySelector("#duplicateColumn")
      .addEventListener("click", (event) => Eventhandler.onClickDuplicateColumn(event));
  }

  static initColumnType() {
    let id = Eventhandler.selectedColumn.dataset.type;
    let formatId = Eventhandler.selectedColumn.dataset.format;
    let format = Object.values(Enums.NumberFormats).querySelector((t) => t.id == formatId);
    let relationId = Eventhandler.selectedColumn.dataset.relation;
    let relation = Table_DB.get(relationId);

    ColumnMenu.setColumnType(id, format, relation);
  }

  static setColumnType(id, format, relation) {
    let columnType = Object.values(Enums.ColumnTypes).querySelector((t) => t.id == id);

    let columnTypeValue = document.querySelector("#columnTypeValue");
    columnTypeValue.html(null);
    document.querySelector(columnTypeValue).dataset.type = columnType.id;

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
      Eventhandler.selectedColumn.dataset.type = columnType.id;
      Eventhandler.selectedColumn.querySelector("#btnColumnMenu").src = columnType.img_light;
    }

    ColumnMenu.setFormat(columnType, format);
    ColumnMenu.setRelation(columnType, relation);

    ColumnMenu.setCellData(columnType);
  }

  static setFormat(columnType, format = Enums.NumberFormats.NUMBER) {
    General.toggle(document.querySelector("#numberFormat"), false);
    Eventhandler.selectedColumn.dataset.format = null;

    if (columnType.id != Enums.ColumnTypes.NUM.id) return;
    ColumnMenu.setNumberFormat(format);
    General.toggle(document.querySelector("#numberFormat"), true);
  }

  static setRelation(columnType, relation = null) {
    General.toggle(document.querySelector("#tableRelation"), false);
    Eventhandler.selectedColumn.dataset.relation = null;

    if (columnType.id != Enums.ColumnTypes.REL.id) return;
    ColumnMenu.setTableRelation(relation);
    General.toggle(document.querySelector("#tableRelation"), true);
  }

  static setNumberFormat(format) {
    if (!format) return;
    document.querySelector("#numberFormatValue span").textContent = format.descr;
    document.querySelector("#numberFormatValue").dataset.format = format.id;
    Eventhandler.selectedColumn.dataset.format = format.id;
  }

  static setTableRelation(relation = { id: null, name: null }) {
    if (!relation) return;
    document.querySelector("#tableRelationValue").classList.remove("error");
    document.querySelector("#tableRelationValue span").textContent = relation.name;
    Eventhandler.selectedColumn.dataset.relation = relation.id;
  }

  static setCellData(columnType) {
    let columnIndex = Eventhandler.selectedColumn.index();
    let cells = [];
    document
      .querySelector(Eventhandler.selectedTable)
      .querySelector("tbody tr")
      .forEach((row) => {
        cells.push(row.querySelector("td")[columnIndex]);
      });
    cells.forEach((cell) => {
      // OPT Encapsulate source code
      let input = cell.querySelector("div");
      switch (columnType) {
        case Enums.ColumnTypes.CHK:
          if (input.children("input").length == 0) {
            let checkboxInput = document.createElement("input");
            checkboxInput.type = "checkbox";
            checkboxInput.className = "inputCheckbox";
            input.append(checkboxInput);
            input.contentEditable = "false";
          }
          break;
        default:
          input.children("input").remove();
          input.contentEditable = "true";
      }
    });
  }

  static isOpen() {
    return document.querySelector("#columnMenu").style.display != "none";
  }

  static close(element) {
    if (!ColumnMenu.isOpen() || ColumnMenu.clickedOnMenu(element)) return;
    General.toggle(document.querySelector("#columnMenu"), false);
    General.toggle(document.querySelector("#disabledPageContainer"), false);
  }

  static open(element) {
    let btnColumnMenu = element;

    Eventhandler.selectedTable = General.getParents(btnColumnMenu, "div.pageElement");
    Eventhandler.selectedColumn = General.getParents(btnColumnMenu, "th");

    ColumnMenu.close(btnColumnMenu);
    ColumnMenu.initColumnType();

    let position = document.querySelector(element).get(0).getBoundingClientRect();
    document.querySelector("#columnMenu").style({
      top: `${position.top + 25}px`,
      left: `${position.left - 9}px`,
    });
    General.toggle(document.querySelector("#columnMenu"), true);
    General.toggle(document.querySelector("#disabledPageContainer"), true);
  }

  static clickedOnMenu(element) {
    if (
      element &&
      (element.id == "btnColumnMenu" || element.id == "columnMenu" || General.getParent(element, "#columnMenu"))
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
      ColumnTypeMenu.open(document.querySelector("#columnTypeValue").dataset.type);
    } else {
      ColumnTypeMenu.close();
    }
  }

  static onClickNumberFormatValue(event) {
    if (!NumberFormatMenu.isOpen()) {
      NumberFormatMenu.open(document.querySelector("#numberFormatValue").dataset.format);
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
    Table.deleteColumn(this.selectedTable, this.selectedColumn.dataset.uuid);
    ColumnMenu.close();
  }

  static onClickDuplicateColumn(event) {
    Table.duplicateColumn(this.selectedTable, this.selectedColumn);
    ColumnMenu.close();
  }
}

module.exports = ColumnMenu;
