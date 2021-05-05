class Navbarmenu {
  static init() {
    Navbarmenu.registerEvents();
  }

  static registerEvents() {
    $("#navbarmenu table tbody tr").on("click", function (event) {
      Eventhandler.onClickMenuItem(event);
    });
  }

  static isOpen() {
    return $("#navbarmenu").is(":visible");
  }

  static close(element) {
    if (!Navbarmenu.isOpen() || Navbarmenu.clickedOnMenu(element)) return;
    $("#navbarmenu").toggle(false);
    $("#disabledPageContainer").toggle(false);
  }

  static open(element, position) {
    let btnNavbarMenu = element;
    if (btnNavbarMenu.attr("id") != "btnNavbarMenu") {
      btnNavbarMenu = element.find("#btnNavbarMenu");
    }

    if (!position) {
      position = {
        top: btnNavbarMenu.position().top + 24,
        left: btnNavbarMenu.position().left,
      };
    }

    Navbarmenu.close(btnNavbarMenu);
    Eventhandler.selectedPage = btnNavbarMenu.parent();
    $("#navbarmenu").css({
      top: `${position.top}px`,
      left: `${position.left}px`,
    });
    $("#navbarmenu").toggle(true);
    $("#disabledPageContainer").toggle(true);
  }

  static clickedOnMenu(element) {
    if (
      element &&
      (element.attr("id") == "btnNavbarMenu" ||
        element.children("#btnNavbarMenu").length > 0)
    ) {
      return true;
    } else {
      return false;
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

    Navbarmenu.close();
  }
}

module.exports = Navbarmenu;
