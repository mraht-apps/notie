class Pagemenu {
  static init() {
    Pagemenu.registerEvents();
  }

  static registerEvents() {
    $("#pageMenu").on("click", function (event) {
      Eventhandler.onClick(event);
    });
  }

  static registerEventMenuItem(tr) {
    $(tr).on("click", function (event) {
      Eventhandler.onClickMenuItem(event);
    });
  }

  static isOpen(pageMenu) {
    return pageMenu.hasClass("visible");
  }

  static close() {
    $("#pageMenu").removeClass("visible");
    $("#pageMenu").toggle(false);
  }

  static open(x, y) {
    if (Pagemenu.isOpen()) {
      Pagemenu.closeAll();
    } else {
      Pagemenu.closeAll();
      $("#pageMenu").css({ top: y - 100 + "px", left: x + 10 + "px" });
      $("#pageMenu").addClass("visible");
      $("#pageMenu").toggle(true);
    }
  }
}

class Eventhandler {
  static onClickMenuItem(event) {
    // NEW Remove page
  }
}

module.exports = Pagemenu;
