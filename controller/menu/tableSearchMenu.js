class TableSearchMenu {
  static table;

  static init() {
    TableSearchMenu.registerEvents();
  }

  static registerEvents() {
    let input = document.querySelector("#tableSearchValue");
    input.addEventListener("focus", (event) => Eventhandler.onFocus(event));
    input.addEventListener("input", (event) => Eventhandler.onInput(event));
  }

  static isOpen() {
    return document.querySelector("#tableSearchMenu").style.display != "none";
  }

  static close(element) {
    if (!TableSearchMenu.isOpen() || TableSearchMenu.clickedOnMenu(element)) return;
    document.querySelector("#tableSearchMenu").toggle(false);
  }

  static open(table) {
    TableSearchMenu.table = table;

    document.querySelector("#tableSearchMenu").toggle(true);
    document.querySelector("#tableSearchValue").textContent = "";
    document.querySelector("#tableSearchValue").fireEvent("onfocus");
    let result = TableSearchMenu.getResult();
    TableSearchMenu.showResult(result);
  }

  static getResult(name = "") {
    let result = Table_DB.getByName(name);
    result = document.querySelector(result).filter(function () {
      return this.id != document.querySelector(TableSearchMenu.table).dataset.uuid;
    });
    return result;
  }

  static showResult(result) {
    let tbody = document.querySelector("#tableSearchMenu table tbody");
    tbody.children
      .filter(function () {
        return this.id != "noTableFound";
      })
      .remove();

    if (result.length == 0) {
      document.querySelector("#noTableFound").toggle(true);
      return;
    } else {
      document.querySelector("#noTableFound").toggle(false);
      document.querySelector(result).each(function () {
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        td.textContent = this.name;
        document.querySelector(td).dataset.uuid = this.id;
        tr.append(td);
        document.querySelector(tr).addEventListener("click", (event) => Eventhandler.onClickTableResult(event));
        tbody.append(tr);
      });
    }
  }

  static clickedOnMenu(element) {
    if (
      element &&
      (element.id == "tableRelationValue" ||
        General.getParents(element, "#tableRelationValue").length > 0 ||
        element.id == "tableSearchMenu" ||
        General.getParents(element, "#tableSearchMenu").length > 0)
    ) {
      return true;
    } else {
      return false;
    }
  }
}

class Eventhandler {
  static onFocus(event) {
    let input = document.querySelector(event.target);
    let result = TableSearchMenu.getResult(input.value);
    TableSearchMenu.showResult(result);
  }

  static onInput(event) {
    let input = document.querySelector(event.target);
    let result = TableSearchMenu.getResult(input.value);
    TableSearchMenu.showResult(result);
  }

  static onClickTableResult(event) {
    let row = document.querySelector(event.target);
    ColumnMenu.setTableRelation({ id: row.dataset.uuid, name: row.textContent });
    TableSearchMenu.close();
  }
}

module.exports = TableSearchMenu;
