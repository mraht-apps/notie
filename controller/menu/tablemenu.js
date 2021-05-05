class Tablemenu {
  static init() {
    Tablemenu.registerEvents();
  }

  static registerEvents() {
    $("#tablemenu tr").on("click", function (event) {
      Eventhandler.onClickMenuItem(event);
    });
  }

  static registerEvent(tableMenuContainer) {
    $(tableMenuContainer).on("click", function (event) {
      Eventhandler.onClick(event);
    });
  }

  static isOpen() {
    return $("#tablemenu").is(":visible");
  }

  static close(element) {
    if (!Tablemenu.isOpen() || Tablemenu.clickedOnMenu(element)) return;
    $("#tablemenu").toggle(false);
    $("#disabledPageContainer").toggle(false);
  }

  static open(element) {
    Tablemenu.close(element);
    let position = $(element).get(0).getBoundingClientRect();
    $("#tablemenu").css({
      top: `${position.top + 28}px`,
      left: `${position.left - 120}px`,
    });
    $("#tablemenu").toggle(true);
    $("#disabledPageContainer").toggle(true);
  }

  static clickedOnMenu(element) {
    if (
      element &&
      (element.attr("id") == "btnTableMenu" ||
        element.parents("#tablemenu").length > 0)
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

    if (!Tablemenu.isOpen()) {
      Tablemenu.open(element);
      Eventhandler.selectedTable = $(event.target).parents(".pageElement.table");
    } else {
      Tablemenu.close(element);
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

    Tablemenu.close();
  }
}

module.exports = Tablemenu;
