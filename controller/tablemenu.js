const { Table } = require("../model/table");

// FIX Call methods tablemenu-specific
class TableMenu {
  static registerEvent(tableMenuContainer) {
    $(tableMenuContainer).on("click", function (event) {
      Eventhandler.onClick(event);
    });
  }

  static registerEventMenuItem(tr) {
    $(tr).on("click", function (event) {
      Eventhandler.onClickMenuItem(event);
    });
  }

  static isOpen(tableMenu) {
    return tableMenu.hasClass("visible");
  }

  static closeAll() {
    $(".tableMenu").removeClass("visible");
    $(".tableMenu").toggle(false);
  }

  static open(tableMenu) {
    TableMenu.closeAll();
    tableMenu.addClass("visible");
    tableMenu.toggle(true);
  }
}

class Eventhandler {
  static onClick(event) {
    let element = $(event.target);
    let tableMenu = element.parents("caption").children(".tableMenu");
    if (!TableMenu.isOpen(tableMenu)) {
      TableMenu.open(tableMenu);
    } else {
      TableMenu.closeAll();
    }
  }

  static onClickMenuItem(event) {
    let table = $(event.target).parents(".table");
    TableJS.Table.remove(table);
    TableMenu.closeAll();
  }
}

module.exports = { TableMenu, Eventhandler };
