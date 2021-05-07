class TableSearchMenu {
  static init() {
    TableSearchMenu.registerEvents();
  }

  static registerEvents() {
    let input = $("#tableRelationValue");
    input.on("focus", (event) => Eventhandler.onFocus(event));
    input.on("focusout", (event) => Eventhandler.onFocusout(event));
    input.on("input", (event) => Eventhandler.onInput(event));
  }

  static close() {
    $("#tableSearchMenu").toggle(false);
  }

  static open() {
    $("#tableSearchMenu").toggle(true);
  }

  static getResult(name = "") {
    return Table_DB.getByName(name);
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
        tr.append(td);
        tbody.append(tr);
      });
    }
  }
}

class Eventhandler {
  static onFocus(event) {
    TableSearchMenu.open();
    let result = TableSearchMenu.getResult();
    TableSearchMenu.showResult(result);
  }

  static onFocusout(event) {
    TableSearchMenu.close();
  }

  static onInput(event) {
    let input = $(event.target);
    let result = TableSearchMenu.getResult(input.val());
    TableSearchMenu.showResult(result);
  }
}

module.exports = TableSearchMenu;
