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

  static isOpen() {
    return $(".tableMenu").hasClass("visible");
  }

  // FIX open and close
  static close() {
    if (!Tablemenu.isOpen()) return;
    $(".tableMenu").removeClass("visible");
    $(".tableMenu").toggle();
  }

  static open(element) {
    let tableMenu = element.parents("caption").children(".tableMenu");
    tableMenu.addClass("visible");
    tableMenu.toggle();
  }
}

class Eventhandler {
  static onClick(event) {
    let element = $(event.target);
    Tablemenu.open(element);
  }

  static onClickMenuItem(event) {
    let table = $(event.target).parents(".table");
    TableJS.Table.remove(table);
    Tablemenu.close();
  }
}

module.exports = { Tablemenu, Eventhandler };
