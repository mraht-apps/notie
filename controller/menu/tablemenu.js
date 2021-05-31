class TableMenu {
  static init() {
    TableMenu.registerEvents();
  }

  static registerEvents() {
    document.querySelector("#tableMenu tr").addEventListener("click", (event) => Eventhandler.onClickMenuItem(event));
  }

  static registerEvent(tableMenuContainer) {
    document.querySelector(tableMenuContainer).addEventListener("click", (event) => Eventhandler.onClick(event));
  }

  static isOpen() {
    return document.querySelector("#tableMenu").style.display != "none";
  }

  static close(element) {
    if (!TableMenu.isOpen() || TableMenu.clickedOnMenu(element)) return;
    document.querySelector("#tableMenu").toggle(false);
    document.querySelector("#disabledPageContainer").toggle(false);
  }

  static open(element) {
    TableMenu.close(element);
    let position = document.querySelector(element).get(0).getBoundingClientRect();
    document.querySelector("#tableMenu").css({
      top: `${position.top + 28}px`,
      left: `${position.left - 120}px`,
    });
    document.querySelector("#tableMenu").toggle(true);
    document.querySelector("#disabledPageContainer").toggle(true);
  }

  static clickedOnMenu(element) {
    if (element && (element.id == "btnTableMenu" || General.getParents(element, "#tableMenu").length > 0)) {
      return true;
    } else {
      return false;
    }
  }
}

class Eventhandler {
  static selectedTable;

  static onClick(event) {
    let element = document.querySelector(event.target);

    if (!TableMenu.isOpen()) {
      TableMenu.open(element);
      Eventhandler.selectedTable = General.getParents(event.target, ".pageElement.table");
    } else {
      TableMenu.close(element);
    }
  }

  static onClickMenuItem(event) {
    let action = document.querySelector(event.target).parent("tr").id;

    switch (action) {
      case Enums.TableActions["delete"]:
        Table.delete(Eventhandler.selectedTable);
        Textline.focusLast();
        break;
    }

    TableMenu.close();
  }
}

module.exports = TableMenu;
