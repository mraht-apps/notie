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
    General.toggle(document.querySelector("#tableSearchMenu"), false);
  }

  static open(table) {
    TableSearchMenu.table = table;

    General.toggle(document.querySelector("#tableSearchMenu"), true);
    document.querySelector("#tableSearchValue").textContent = "";
    document.querySelector("#tableSearchValue").dispatchEvent(new Event("focus"));
    let result = TableSearchMenu.getResult();
    TableSearchMenu.showResult(result);
  }

  static getResult(name = "") {
    let resultset = Table_DB.getByName(name);
    resultset = resultset.filter((result) => {
      return result.id != TableSearchMenu.table.dataset.uuid;
    });
    return resultset;
  }

  static showResult(resultset) {
    let tbody = document.querySelector("#tableSearchMenu table tbody");
    tbody.children
      .filter((child) => {
        return child.id != "noTableFound";
      })
      .remove();

    if (resultset.length == 0) {
      General.toggle(document.querySelector("#noTableFound"), true);
      return;
    } else {
      General.toggle(document.querySelector("#noTableFound"), false);
      resultset.forEach((result) => {
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        td.textContent = result.name;
        td.dataset.uuid = result.id;
        tr.append(td);
        tr.onclick = (event) => Eventhandler.onClickTableResult(event);
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
    let result = TableSearchMenu.getResult(event.target.value);
    TableSearchMenu.showResult(result);
  }

  static onInput(event) {
    let result = TableSearchMenu.getResult(event.target.value);
    TableSearchMenu.showResult(result);
  }

  static onClickTableResult(event) {
    ColumnMenu.setTableRelation({ id: event.target.dataset.uuid, name: event.target.textContent });
    TableSearchMenu.close();
  }
}

module.exports = TableSearchMenu;
