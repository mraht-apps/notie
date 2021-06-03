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
    let format = Object.values(Enums.NumberFormats).filter((t) => t.id == formatId)[0];
    let relationId = Eventhandler.selectedColumn.dataset.relation;
    let relation = Table_DB.get(relationId);

    ColumnMenu.setColumnType(id, format, relation);
  }

  static setColumnType(id, format, relation) {
    let columnType = Object.values(Enums.ColumnTypes).filter((t) => t.id == id)[0];

    let columnTypeValue = document.querySelector("#columnTypeValue");
    columnTypeValue.innerHTML = "";
    columnTypeValue.dataset.type = columnType.id;

    let img = document.createElement("img");
    img.src = columnType.img;
    img.draggable = false;
    columnTypeValue.append(img);
    let textNode = document.createTextNode(columnType.descr);
    columnTypeValue.append(textNode);
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
    delete Eventhandler.selectedColumn.dataset.format;

    if (columnType.id != Enums.ColumnTypes.NUM.id) return;
    ColumnMenu.setNumberFormat(format);
    General.toggle(document.querySelector("#numberFormat"), true);
  }

  static setRelation(columnType, relation = null) {
    General.toggle(document.querySelector("#tableRelation"), false);
    delete Eventhandler.selectedColumn.dataset.relation;

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
    if (Eventhandler.selectedColumn.dataset.type != columnType) return;

    let columns = General.findAll(Eventhandler.selectedTable.htmlElement, "th");
    let columnIndex = Array.prototype.indexOf.call(columns, Eventhandler.selectedColumn);
    General.findAll(Eventhandler.selectedTable.htmlElement, "tbody tr").forEach((row) => {
      let cell = General.findAll(row, "td")[columnIndex];
      DOM.removeAll(cell.children);

      let input = null;
      switch (columnType) {
        case Enums.ColumnTypes.CHK:
          input = document.createElement("input");
          input.type = "checkbox";
          input.className = "inputCheckbox";
          break;
        default:
          input = cell.querySelector("div");
          input.contentEditable = "true";
      }
      if (input) cell.append(input);
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

    let container = General.getParents(btnColumnMenu, "div.pageElement")[0];
    Eventhandler.selectedTable = Page.getBlockElement(container.dataset.uuid);
    Eventhandler.selectedColumn = General.getParents(btnColumnMenu, "th")[0];

    ColumnMenu.close(btnColumnMenu);
    ColumnMenu.initColumnType();

    let position = element.getBoundingClientRect();
    document.querySelector("#columnMenu").style.cssText = `top: ${position.top + 25}px; left: ${position.left - 9}px`;
    General.toggle(document.querySelector("#columnMenu"), true);
    General.toggle(document.querySelector("#disabledPageContainer"), true);
  }

  static clickedOnMenu(element) {
    if (
      element &&
      (element.id == "btnColumnMenu" ||
        element.id == "columnMenu" ||
        General.getParents(element, "#columnMenu").length > 0)
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
    this.selectedTable.deleteColumn(this.selectedColumn.dataset.uuid);
    ColumnMenu.close();
  }

  static onClickDuplicateColumn(event) {
    this.selectedTable.duplicateColumn(this.selectedColumn);
    ColumnMenu.close();
  }
}

module.exports = ColumnMenu;
