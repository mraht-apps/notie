class TableSearchMenu {
  static table;

  static init() {
    TableSearchMenu.registerEvents();
  }

  static registerEvents() {
    let input = $("#tableSearchValue");
    input.on("focus", (event) => Eventhandler.onFocus(event));
    input.on("input", (event) => Eventhandler.onInput(event));
  }

  static isOpen() {
    return $("#tableSearchMenu").is(":visible");
  }

  static close(element) {
    if (!TableSearchMenu.isOpen() || TableSearchMenu.clickedOnMenu(element)) return;
    $("#tableSearchMenu").toggle(false);
  }

  static open(table) {
    TableSearchMenu.table = table;

    $("#tableSearchMenu").toggle(true);
    $("#tableSearchValue").text("");
    $("#tableSearchValue").trigger("focus");
    let result = TableSearchMenu.getResult();
    TableSearchMenu.showResult(result);
  }

  static getResult(name = "") {
    let result = Table_DB.getByName(name);
    result = $(result).filter(function () {
      return this.id != $(TableSearchMenu.table).data("uuid");
    });
    return result;
  }

  static showResult(result) {
    let tbody = $("#tableSearchMenu table tbody");
    tbody
      .children()
      .filter(function () {
        return this.id != "noTableFound";
      })
      .remove();

    if (result.length == 0) {
      $("#noTableFound").toggle(true);
      return;
    } else {
      $("#noTableFound").toggle(false);
      $(result).each(function () {
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        td.textContent = this.name;
        $(td).data("uuid", this.id);
        tr.append(td);
        $(tr).on("click", (event) => Eventhandler.onClickTableResult(event));
        tbody.append(tr);
      });
    }
  }

  static clickedOnMenu(element) {
    if (
      element &&
      (element.attr("id") == "tableRelationValue" ||
        element.parents("#tableRelationValue").length > 0 ||
        element.attr("id") == "tableSearchMenu" ||
        element.parents("#tableSearchMenu").length > 0)
    ) {
      return true;
    } else {
      return false;
    }
  }
}

class Eventhandler {
  static onFocus(event) {
    let input = $(event.target);
    let result = TableSearchMenu.getResult(input.val());
    TableSearchMenu.showResult(result);
  }

  static onInput(event) {
    let input = $(event.target);
    let result = TableSearchMenu.getResult(input.val());
    TableSearchMenu.showResult(result);
  }

  static onClickTableResult(event) {
    let row = $(event.target);
    ColumnMenu.setTableRelation({ id: row.data("uuid"), name: row.text() });
    TableSearchMenu.close();
  }
}

module.exports = TableSearchMenu;
