class TableMenu {
  static init() {
    TableMenu.registerEvents();
  }

  static registerEvents() {
    document.querySelector("#tableMenu tr").addEventListener("click", (event) => Eventhandler.onClickMenuItem(event));
  }

  static registerEvent(tableMenuContainer) {
    tableMenuContainer.addEventListener("click", (event) => Eventhandler.onClick(event));
  }

  static isOpen() {
    return document.querySelector("#tableMenu").style.display != "none";
  }

  static close(element) {
    if (!TableMenu.isOpen() || TableMenu.clickedOnMenu(element)) return;
    General.toggle(document.querySelector("#tableMenu"), false);
    General.toggle(document.querySelector("#disabledPageContainer"), false);
  }

  static open(element) {
    TableMenu.close(element);
    let position = element.getBoundingClientRect();
    document.querySelector("#tableMenu").style.cssText = `top: ${position.top + 28}px; left: ${position.left - 120}px;`;
    General.toggle(document.querySelector("#tableMenu"), true);
    General.toggle(document.querySelector("#disabledPageContainer"), true);
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
    if (!TableMenu.isOpen()) {
      TableMenu.open(event.target);
      let pageElement = General.getParents(event.target, ".pageElement.table")[0];
      Eventhandler.selectedTable = Page.getBlockElement(pageElement.dataset.uuid);
      
    } else {
      TableMenu.close(event.target);
    }
  }

  static onClickMenuItem(event) {
    let action = event.target.parentNode.id;

    switch (action) {
      case Enums.TableActions["delete"]:
        Eventhandler.selectedTable.delete();
        Textline.focusLast();
        break;
    }

    TableMenu.close();
  }
}

module.exports = TableMenu;
