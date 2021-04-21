// FIX Call methods tablemenu-specific
class Tablemenu {
  static registerEvent(tr) {
    $(tr).on("click", function (event) {
      Eventhandler.onClickMenuItem(event);
    });
  }

  static isOpen() {
    return $(".tableMenu").hasClass("visible");
  }

  static close() {
    if (!Tablemenu.isOpen()) return;
    $(".clickable").removeClass("active");
    $(".tableMenu").removeClass("visible");
    $(".tableMenu").toggle();
  }

  static open() {
    $(".tableMenu").addClass("visible");
    $(".tableMenu").toggle();
  }
}

class Eventhandler {
  static onClickMenuItem(event) {
    let table = $(event.target).parents(".table");
    TableJS.Table.remove(table);
    Tablemenu.close();
  }
}

module.exports = { Tablemenu, Eventhandler };
