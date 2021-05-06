class TableMenu {
  static init() {
    TableMenu.registerEvents();
  }

  static registerEvents() {
    $("#tableMenu tr").on("click", function (event) {
      Eventhandler.onClickMenuItem(event);
    });
  }

  static registerEvent(tableMenuContainer) {
    $(tableMenuContainer).on("click", function (event) {
      Eventhandler.onClick(event);
    });
  }

  static isOpen() {
    return $("#tableMenu").is(":visible");
  }

  static close(element) {
    if (!TableMenu.isOpen() || TableMenu.clickedOnMenu(element)) return;
    $("#tableMenu").toggle(false);
    $("#disabledPageContainer").toggle(false);
  }

  static open(element) {
    TableMenu.close(element);
    let position = $(element).get(0).getBoundingClientRect();
    $("#tableMenu").css({
      top: `${position.top + 28}px`,
      left: `${position.left - 120}px`,
    });
    $("#tableMenu").toggle(true);
    $("#disabledPageContainer").toggle(true);
  }

  static clickedOnMenu(element) {
    if (
      element &&
      (element.attr("id") == "btnTableMenu" ||
        element.parents("#tableMenu").length > 0)
    ) {
      return true;
    } else {
      return false;
    }
  }
}

class Eventhandler {
  static selectedTable;

  static onClick(event) {
    let element = $(event.target);

    if (!TableMenu.isOpen()) {
      TableMenu.open(element);
      Eventhandler.selectedTable = $(event.target).parents(".pageElement.table");
    } else {
      TableMenu.close(element);
    }
  }

  static onClickMenuItem(event) {
    let action = $(event.target).parent("tr").attr("id");

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
