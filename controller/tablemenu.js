const { Table } = require("../model/table");

// FIX Call methods tablemenu-specific
class Tablemenu {
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

  static close() {
    // if (!Tablemenu.isOpen()) return;
    $(".tableMenu").removeClass("visible");
    $(".tableMenu").toggle(false);
  }

  static open(tableMenu) {
    Tablemenu.close();
    tableMenu.addClass("visible");
    tableMenu.toggle(true);
  }
}

class Eventhandler {
  static onClick(event) {
    let element = $(event.target);
    let tableMenu = element.parents("caption").children(".tableMenu");
    if (!Tablemenu.isOpen(tableMenu)) {
      Tablemenu.open(tableMenu);
    } else {
      Tablemenu.close();
    }
  }

  static onClickMenuItem(event) {
    let table = $(event.target).parents(".table");
    TableJS.Table.remove(table);
    Tablemenu.close();
  }
}

module.exports = { Tablemenu, Eventhandler };
