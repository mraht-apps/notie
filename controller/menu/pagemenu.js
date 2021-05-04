class Pagemenu {
  static init() {
    Pagemenu.registerEvents();
  }

  static registerEvents() {
    $("#pagemenu table tbody tr").on("click", function (event) {
      Eventhandler.onClickMenuItem(event);
    });
  }

  static isOpen() {
    return $("#pagemenu").is(":visible");
  }

  static closeAll() {
    $("#pagemenu").toggle(false);
  }

  static open(navbarItem) {
    let isOpen = Pagemenu.isOpen();
    Pagemenu.closeAll();
    if (!isOpen) {
      Eventhandler.selectedPage = navbarItem;
      let { x, y } = General.getCursorPixelPosition();
      $("#pagemenu").css({ top: y + 10 + "px", left: x + "px" });
      $("#pagemenu").toggle(true);
    }
  }
}

class Eventhandler {
  static selectedPage;

  static onClickMenuItem(event) {
    if (!Eventhandler.selectedPage) return;
    let action = $(event.target).parents("tr").attr("id");

    switch (action) {
      case Enums.PageActions["delete"]:
        Page.delete(Eventhandler.selectedPage.data("uuid"));
        Eventhandler.selectedPage.remove();
        break;
    }

    Pagemenu.closeAll();
  }
}

module.exports = Pagemenu;
